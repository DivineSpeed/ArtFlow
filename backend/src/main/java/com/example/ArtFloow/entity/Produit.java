package com.example.ArtFloow.entity;


import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "produit") // Correspond au nom de la table SQL
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT
    @Column(name = "idProduit")
    private Long idProduit;

    @Column(name = "nomProduit") // NOT NULL, VARCHAR(255)
    private String nomProduit;

    @Column(name = "descriptionProduit") // TEXT
    private String descriptionProduit;

    @Column(name = "prix") // DECIMAL(10, 2)
    private BigDecimal prix;

    @Column(name = "quantiteEnStock") // DEFAULT 0
    private Integer quantiteEnStock = 0;

    @Column(name = "imageProduit") // VARCHAR(255)
    private String imageProduit;

    @ManyToOne
    @JoinColumn(name = "idBoutique", referencedColumnName = "idBoutique")
    private Boutique boutique;

    // Getters et setters
    public Long getIdProduit() {
        return idProduit;
    }

    public void setIdProduit(Long idProduit) {
        this.idProduit = idProduit;
    }

    public String getNomProduit() {
        return nomProduit;
    }

    public void setNomProduit(String nomProduit) {
        this.nomProduit = nomProduit;
    }

    public String getDescriptionProduit() {
        return descriptionProduit;
    }

    public void setDescriptionProduit(String descriptionProduit) {
        this.descriptionProduit = descriptionProduit;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public Integer getQuantiteEnStock() {
        return quantiteEnStock;
    }

    public void setQuantiteEnStock(Integer quantiteEnStock) {
        this.quantiteEnStock = quantiteEnStock;
    }

    public String getImageProduit() {
        return imageProduit;
    }

    public void setImageProduit(String imageProduit) {
        this.imageProduit = imageProduit;
    }

    public Boutique getBoutique() {
        return boutique;
    }

    public void setBoutique(Boutique boutique) {
        this.boutique = boutique;
    }
}