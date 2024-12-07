package com.example.ArtFloow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "panieritem") // Correspond au nom de la table SQL
public class PanierItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPanierItem;

    @ManyToOne
    @JoinColumn(name = "idPanier", nullable = false)
    @JsonIgnore
    private Panier panier;

    // Relationship with Produit (assuming you have a Produit entity)
    @ManyToOne
    @JoinColumn(name = "idProduit", nullable = false)
    private Produit produit;

    private int quantite;  // Quantité du produit dans le panier

    // Getters and setters
    public Long getIdPanierItem() {
        return idPanierItem;
    }

    public void setIdPanierItem(Long idPanierItem) {
        this.idPanierItem = idPanierItem;
    }

    public Panier getPanier() {
        return panier;
    }

    public void setPanier(Panier panier) {
        this.panier = panier;
    }

    public Produit getProduit() {
        return produit;
    }

    public void setProduit(Produit produit) {
        this.produit = produit;
    }

    public int getQuantite() {
        return quantite;
    }

    public void setQuantite(int quantite) {
        this.quantite = quantite;
    }
}