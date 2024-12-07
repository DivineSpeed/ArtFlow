package com.example.ArtFloow.dto;

import com.example.ArtFloow.entity.Produit;
import lombok.Data;

@Data
public class ProduitRequest {

    private Long userId;
    private Produit produit;

    // Getters et setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Produit getProduit() {
        return produit;
    }

    public void setProduit(Produit produit) {
        this.produit = produit;
    }
}

