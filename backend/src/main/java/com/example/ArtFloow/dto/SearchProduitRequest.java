package com.example.ArtFloow.dto;

public class SearchProduitRequest {
    private Long userId;  // ID de l'artisan (Compte)
    private String nomProduit;  // Nom du produit à rechercher

    // Getters et Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getNomProduit() {
        return nomProduit;
    }

    public void setNomProduit(String nomProduit) {
        this.nomProduit = nomProduit;
    }
}
