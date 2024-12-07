package com.example.ArtFloow.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAdmin")
    private int idAdmin;

    @ManyToOne
    @JoinColumn(name = "idCompte", referencedColumnName = "idCompte", nullable = false)
    private Compte compte; // Correspond à la table Compte

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "prenom", nullable = false)
    private String prenom;

    @Column(name = "dateCreation", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dateCreation;

    // Constructeurs
    public Admin() {
    }

    public Admin(Compte compte, String nom, String prenom) {
        this.compte = compte;
        this.nom = nom;
        this.prenom = prenom;
        this.dateCreation = LocalDateTime.now(); // Valeur par défaut à la création
    }

    // Getters et Setters
    public int getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(int idAdmin) {
        this.idAdmin = idAdmin;
    }

    public Compte getCompte() {
        return compte;
    }

    public void setCompte(Compte compte) {
        this.compte = compte;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "idAdmin=" + idAdmin +
                ", compte=" + compte +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", dateCreation=" + dateCreation +
                '}';
    }
}