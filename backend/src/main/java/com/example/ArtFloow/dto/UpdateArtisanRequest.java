package com.example.ArtFloow.dto;

public class UpdateArtisanRequest {
    private Long userId;  // Ajout du champ userId
    private String nomArtisan;
    private String prenomArtisan;
    private String numTelephone;

    // Getters et setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
}


