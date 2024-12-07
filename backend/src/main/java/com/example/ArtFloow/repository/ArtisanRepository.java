package com.example.ArtFloow.repository;

import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtisanRepository extends JpaRepository<Artisan, Long> {


        // Recherche de l'artisan par le compte
        Optional<Artisan> findByCompte(Compte compte);


        Optional<Artisan> findByCompte_IdCompte(Long idCompte);

        Optional<Artisan> findByCompteIdCompte(Long idCompte);



        }
