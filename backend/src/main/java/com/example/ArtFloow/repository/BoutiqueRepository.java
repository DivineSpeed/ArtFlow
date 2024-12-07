package com.example.ArtFloow.repository;

import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.entity.Boutique;
import com.example.ArtFloow.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoutiqueRepository extends JpaRepository<Boutique, Long> {

    // Méthode pour trouver la boutique d'un artisan
    Optional<Boutique> findByArtisan(Artisan artisan);


    Optional<Boutique> findByArtisanCompteIdCompte(Long idCompte);

    Optional<Boutique> findByArtisan_IdArtisan(Long idArtisan);

    @Query("SELECT b.produits FROM Boutique b WHERE b.idBoutique = :idboutique")
    List<Produit> findProduitsByBoutique(@Param("idboutique") Long idboutique);

    @Query("SELECT b FROM Boutique b WHERE b.artisan = :artisan")
    List<Boutique> findBoutiqueByIdArtisan(@Param("artisan") Artisan artisan);
}


