package com.example.ArtFloow.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "Commande")
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCommande;

    @OneToOne
    @JoinColumn(name = "idPanier", referencedColumnName = "idPanier")
    private Panier panier; // Référence à la table Panier

    @Column(name = "dateCommande")
    private Timestamp dateCommande;

    @Column(name = "nomVisiteur")
    @JsonProperty("nomVisiteur")
    private String nomVisiteur;

    @Column(name = "prenomVisiteur")
    @JsonProperty("prenomVisiteur")
    private String prenomVisiteur;

    @Column(name = "prixTotalCommande")
    private BigDecimal prixTotalCommande;

    @Column(name = "adresseLivraison")
    private String adresseLivraison;

    @Column(name = "ville")
    private String ville;

    @Column(name = "codePostal")
    private String codePostal;

    @Column(name = "pays")
    private String pays;

    @Column(name = "numeroTelephone")
    private String numeroTelephone;

    @Column(name = "email")
    private String email;

    // No-args constructor required for Jackson
    public Commande() {
    }

    // Getters and Setters
    public Long getIdCommande() {
        return idCommande;
    }

    public void setIdCommande(Long idCommande) {
        this.idCommande = idCommande;
    }

    public Panier getPanier() {
        return panier;
    }

    public void setPanier(Panier panier) {
        this.panier = panier;
    }

    public Timestamp getDateCommande() {
        return dateCommande;
    }

    public void setDateCommande(Timestamp dateCommande) {
        this.dateCommande = dateCommande;
    }

    public String getNomVisiteur() {
        return nomVisiteur;
    }

    public void setNomVisiteur(String nomVisiteur) {
        this.nomVisiteur = nomVisiteur;
    }

    public String getPrenomVisiteur() {
        return prenomVisiteur;
    }

    public void setPrenomVisiteur(String prenomVisiteur) {
        this.prenomVisiteur = prenomVisiteur;
    }

    public BigDecimal getPrixTotalCommande() {
        return prixTotalCommande;
    }

    public void setPrixTotalCommande(BigDecimal prixTotalCommande) {
        this.prixTotalCommande = prixTotalCommande;
    }

    public String getAdresseLivraison() {
        return adresseLivraison;
    }

    public void setAdresseLivraison(String adresseLivraison) {
        this.adresseLivraison = adresseLivraison;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public String getNumeroTelephone() {
        return numeroTelephone;
    }

    public void setNumeroTelephone(String numeroTelephone) {
        this.numeroTelephone = numeroTelephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Commande{idCommande=" + idCommande +
                ", nomVisiteur=" + nomVisiteur +
                ", prenomVisiteur=" + prenomVisiteur +
                ", prixTotalCommande=" + prixTotalCommande +
                ", adresseLivraison=" + adresseLivraison +
                ", ville=" + ville +
                ", email=" + email +
                '}';
    }
}