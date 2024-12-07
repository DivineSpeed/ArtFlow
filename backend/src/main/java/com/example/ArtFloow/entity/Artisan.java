package com.example.ArtFloow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "artisan")
public class Artisan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idArtisan")
    private Long idArtisan;

    @Column(name = "nomArtisan", nullable = false)
    private String nomArtisan;

    @Column(name = "prenomArtisan", nullable = false)
    private String prenomArtisan;

    @Column(name = "numTelephone", nullable = false)
    private String numTelephone;

    @OneToOne
    @JoinColumn(name = "idCompte", referencedColumnName = "idCompte", nullable = false)
    private Compte compte;

    // Getters et setters
    public Long getIdArtisan() {
        return idArtisan;
    }

    public void setIdArtisan(Long idArtisan) {
        this.idArtisan = idArtisan;
    }

    public String getNomArtisan() {
        return nomArtisan;
    }

    public void setNomArtisan(String nomArtisan) {
        this.nomArtisan = nomArtisan;
    }

    public String getPrenomArtisan() {
        return prenomArtisan;
    }

    public void setPrenomArtisan(String prenomArtisan) {
        this.prenomArtisan = prenomArtisan;
    }

    public String getNumTelephone() {
        return numTelephone;
    }

    public void setNumTelephone(String numTelephone) {
        this.numTelephone = numTelephone;
    }

    public Compte getCompte() {
        return compte;
    }

    public void setCompte(Compte compte) {
        this.compte = compte;
    }
}