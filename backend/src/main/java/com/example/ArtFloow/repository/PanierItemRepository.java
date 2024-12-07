package com.example.ArtFloow.repository;

import com.example.ArtFloow.entity.Panier;
import com.example.ArtFloow.entity.PanierItem;
import com.example.ArtFloow.entity.Produit;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PanierItemRepository extends JpaRepository<PanierItem,Long> {


    @Query("SELECT pi FROM PanierItem pi WHERE pi.panier = :panier AND pi.produit = :produit")
    PanierItem findByPanierAndProduit(@Param("panier") Panier panier, @Param("produit") Produit produit);

    @Transactional
    @Modifying
    @Query("DELETE FROM PanierItem pi WHERE pi.panier.idPanier = :idPanier")
    void deleteByIdPanier(@Param("idPanier") Long idPanier);

    @Query("SELECT pi FROM PanierItem pi WHERE pi.panier.idPanier = :idPanier")
    List<PanierItem> findByPanierId(@Param("idPanier") Long idpanier);


}