package com.example.ArtFloow.service;

import com.example.ArtFloow.entity.Compte;
import com.example.ArtFloow.repository.CompteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CompteService {


        private final CompteRepository compteRepository;
        private final PasswordEncoder passwordEncoder;

        public CompteService(CompteRepository compteRepository, PasswordEncoder passwordEncoder) {
            this.compteRepository = compteRepository;
            this.passwordEncoder = passwordEncoder;
        }

        public Compte authenticateUser(String email, String rawPassword) {
            Compte compte = compteRepository.findByEmail(email);

            if (compte != null && passwordEncoder.matches(rawPassword, compte.getMotDePasse())) {
                return compte; // Authentification réussie
            }
            return null; // Authentification échouée
        }
    }
