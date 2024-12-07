package com.example.ArtFloow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "boutique")
public class Boutique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idBoutique")
    private Long idBoutique;

    @Column(name = "nomBoutique", nullable = false)
    private String nomBoutique;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "adresseBoutique", nullable = false)
    private String adresseBoutique;

    @Column(name = "facebookLink")
    private String facebookLink;

    @OneToMany(mappedBy = "boutique", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Produit> produits;  // A list to store all products in this boutique

    @Column(name = "instagramLink")
    private String instagramLink;

    @Column(name = "dateCreation", nullable = false, updatable = false)
    private Timestamp dateCreation;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)  // Apply cascading
    @JoinColumn(name = "idArtisan", referencedColumnName = "idArtisan", nullable = false)
    private Artisan artisan;

    // Getters et setters
    public Long getIdBoutique() {
        return idBoutique;
    }

    public void setIdBoutique(Long idBoutique) {
        this.idBoutique = idBoutique;
    }

    public String getNomBoutique() {
        return nomBoutique;
    }

    public void setNomBoutique(String nomBoutique) {
        this.nomBoutique = nomBoutique;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAdresseBoutique() {
        return adresseBoutique;
    }

    public void setAdresseBoutique(String adresseBoutique) {
        this.adresseBoutique = adresseBoutique;
    }

    public String getFacebookLink() {
        return facebookLink;
    }

    public void setFacebookLink(String facebookLink) {
        this.facebookLink = facebookLink;
    }

    public String getInstagramLink() {
        return instagramLink;
    }

    public void setInstagramLink(String instagramLink) {
        this.instagramLink = instagramLink;
    }

    public Timestamp getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Timestamp dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Artisan getArtisan() {
        return artisan;
    }

    public void setArtisan(Artisan artisan) {
        this.artisan = artisan;
    }


    @PrePersist
    public void onPrePersist() {
        // Assurez-vous que la date de création est définie avant l'insertion dans la base de données
        this.dateCreation = new Timestamp(System.currentTimeMillis());
    }
}