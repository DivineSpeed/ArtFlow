package com.example.ArtFloow.repository;

import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.entity.Boutique;
import com.example.ArtFloow.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    // Trouver tous les produits d'une boutique
    List<Produit> findByBoutique(Boutique boutique);

    // Trouver les produits d'un artisan (en passant par la boutique)
    List<Produit> findByBoutique_Artisan(Artisan artisan);


    List<Produit> findByBoutique_Artisan_IdArtisan(Long artisanId);

    List<Produit> findByBoutique_Artisan_IdArtisanAndNomProduitContaining(Long artisanId, String nomProduit);

    public List<Produit> findByBoutique_ArtisanAndNomProduitContaining(Artisan artisan, String nomProduit);

    Optional<Produit> findById(Long id);
}
