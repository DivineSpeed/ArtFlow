package com.example.ArtFloow.repository;

import com.example.ArtFloow.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {

    // Méthode pour trouver un compte par email
    Compte findByEmail(String email);

    Optional<Compte> findByIdCompte(Long idCompte);
}
