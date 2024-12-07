package com.example.ArtFloow.service;

import com.example.ArtFloow.entity.Compte;
import com.example.ArtFloow.repository.CompteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompteService {

    @Autowired
    private CompteRepository compteRepository;

    // Authentifier un utilisateur par email et mot de passe
    public Compte authenticateUser(String email, String password) {
        Compte compte = compteRepository.findByEmail(email);
        if (compte != null && compte.getMotDePasse().equals(password)) {
            return compte;
        }
        return null;
    }
}
