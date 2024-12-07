// Replace placeholders with dynamic data
document.addEventListener("DOMContentLoaded", function () {
    // Example data
    const data = {
        firstName: 'John Doe',
        orderId: '987654',
        items: [
            {
                name: 'Digital Artwork 1',
                artist: 'Artist A',
                store: 'Gallery A',
                quantity: 2,
                price: '$40',
                image: 'https://via.placeholder.com/100?text=Art1'
            },
            {
                name: 'Painting Artwork 2',
                artist: 'Artist B',
                store: 'Gallery B',
                quantity: 1,
                price: '$65',
                image: 'https://via.placeholder.com/100?text=Art2'
            }
        ],
        shippingAddress: '123 Example Street',
        city: 'Sample City',
        postalCode: '12345',
        country: 'Country Z',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        totalAmount: '$145'
    };

    // 1. Replace static data like firstName and orderId
    document.querySelector('.thank-you-title').textContent = `Thank you, ${data.firstName}!`;
    document.querySelector('.order-tag').textContent = `Order #ART${data.orderId}`;
    document.querySelector('.total-amount').textContent = data.totalAmount;

    // 2. Populate the artwork section using Handlebars
    const source = document.getElementById("artwork-template").innerHTML;  // Get the Handlebars template
    const template = Handlebars.compile(source); // Compile the template
    const html = template(data);  // Generate the HTML using data
    document.getElementById("artwork-section").innerHTML = html;  // Insert the generated HTML into the page

    // 3. Replace shipping and contact info
    const shippingContent = document.querySelectorAll('.info-content')[0];
    shippingContent.innerHTML = `${data.shippingAddress}, ${data.city}, ${data.postalCode}<br>${data.country}`;

    const contactContent = document.querySelectorAll('.info-content')[1];
    contactContent.innerHTML = `${data.email}<br>${data.phone}`;
});
