package com.example.ArtFloow.dto;

import com.example.ArtFloow.entity.Role;
import lombok.Data;

@Data
public class ArtisanWithBoutiqueRequest {
    private String nomArtisan;
    private String prenomArtisan;
    private String numTelephone;
    private String email;
    private String motDePasse;
    private Role role;

    private String nomBoutique;
    private String description;
    private String adresseBoutique;
    private String facebookLink;
    private String instagramLink;
}
