const fs = require('fs');

class AnalyticsService {
  getMonth(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long' });
  }

  generateTimeSeriesData(data, dataType) {
    // Get the current year
    const currentYear = new Date().getFullYear();

    const monthlyMap = new Map();
    const quarterlyMap = new Map();
    const yearlyMap = new Map();

    data.forEach(item => {
      let date;
      let month;
      let year;
      let quarter;

      if (dataType === 'stores') {
        date = new Date(item);
        month = this.getMonth(item);
        year = date.getFullYear();
        quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
      } else {
        date = new Date(item.dateCommande);
        month = this.getMonth(item.dateCommande);
        year = date.getFullYear();
        quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
      }

      // Always track total yearly data across all years
      if (dataType === 'revenue') {
        const value = dataType === 'stores' ? 1 : item.prixTotalCommande;
        yearlyMap.set(year.toString(), (yearlyMap.get(year.toString()) || 0) + value);
      } else {
        yearlyMap.set(year.toString(), (yearlyMap.get(year.toString()) || 0) + 1);
      }

      // Only add to monthly and quarterly if it's the current year
      if (year === currentYear) {
        if (dataType === 'revenue') {
          const value = item.prixTotalCommande;
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + value);
          quarterlyMap.set(quarter, (quarterlyMap.get(quarter) || 0) + value);
        } else {
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
          quarterlyMap.set(quarter, (quarterlyMap.get(quarter) || 0) + 1);
        }
      }
    });

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyData = Array.from(monthlyMap, ([month, value]) => ({
      month,
      [dataType === 'stores' ? 'storesAdded' : (dataType === 'revenue' ? 'revenue' : 'orders')]: value
    })).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));

    const quarterlyData = Array.from(quarterlyMap, ([quarter, value]) => ({
      quarter,
      [dataType === 'stores' ? 'storesAdded' : (dataType === 'revenue' ? 'revenue' : 'orders')]: value
    })).sort((a, b) => {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      return quarters.indexOf(a.quarter) - quarters.indexOf(b.quarter);
    });

    const yearlyData = Array.from(yearlyMap, ([year, value]) => ({
      year,
      [dataType === 'stores' ? 'storesAdded' : (dataType === 'revenue' ? 'revenue' : 'orders')]: value
    }));

    return { monthly: monthlyData, quarterly: quarterlyData, yearly: yearlyData };
  }

  transformAPIData(storesData, ordersData) {
    // Process stores data
    const storesCreationDates = storesData.map(store => store.dateCreation);
    const uniqueStores = [...new Set(storesData.map(store => store.idBoutique))];

    // Calculate total revenue
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.prixTotalCommande, 0);

    // Top selling artworks
    const topSellingArtworks = ordersData.reduce((acc, order) => {
      order.panier.items.forEach(item => {
        const existingArtwork = acc.find(a => a.artworkId === item.produit.idProduit.toString());
        if (existingArtwork) {
          existingArtwork.totalSales += item.quantite;
        } else {
          acc.push({
            artworkId: item.produit.idProduit.toString(),
            name: item.produit.nomProduit,
            totalSales: item.quantite
          });
        }
      });
      return acc;
    }, [])
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);

    // Calculate customer demographics
    const customerDemographics = ordersData.reduce((acc, order) => {
      const country = order.pays;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    return {
      revenueOverTime: this.generateTimeSeriesData(ordersData, 'revenue'),
      ordersOverTime: this.generateTimeSeriesData(ordersData, 'orders'),
      storesOverTime: this.generateTimeSeriesData(storesCreationDates, 'stores'),
      totalStores: uniqueStores.length,
      totalOrders: ordersData.length,
      totalRevenue: Math.round(totalRevenue),
      topSellingArtworks,
      customerDemographics
    };
  }
}

// Example usage
function main() {
  // Read the JSON files
  const storesData = JSON.parse(fs.readFileSync('stores.json', 'utf8'));
  const ordersData = JSON.parse(fs.readFileSync('orders.json', 'utf8'));

  // Create an instance of the AnalyticsService
  const analyticsService = new AnalyticsService();

  // Transform the data
  const transformedData = analyticsService.transformAPIData(storesData, ordersData);

  // Pretty print the results
  console.log(JSON.stringify(transformedData, null, 2));

  // Optionally, write to a file
  fs.writeFileSync('transformed_analytics.json', JSON.stringify(transformedData, null, 2));
}

// Run the main function
main();