package com.example.ArtFloow.repository;

import com.example.ArtFloow.entity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande,Long> {

    // Récupérer les commandes par artisanId
    @Query("SELECT c FROM Commande c JOIN c.panier p JOIN p.items pi JOIN pi.produit pr JOIN pr.boutique b JOIN b.artisan a WHERE a.id = :artisanId")
    List<Commande> findByArtisanId(@Param("artisanId") Long artisanId);
}