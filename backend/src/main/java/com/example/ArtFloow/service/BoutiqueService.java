package com.example.ArtFloow.service;

import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.entity.Boutique;
import com.example.ArtFloow.entity.Compte;
import com.example.ArtFloow.entity.Produit;
import com.example.ArtFloow.exceptions.ArtisansNotFoundException;
import com.example.ArtFloow.repository.ArtisanRepository;
import com.example.ArtFloow.repository.BoutiqueRepository;
import com.example.ArtFloow.repository.CompteRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BoutiqueService {

    private final ArtisanRepository artisanRepository;
    private final BoutiqueRepository boutiqueRepository;
    private final CompteRepository compteRepository;

    public BoutiqueService(ArtisanRepository artisanRepository, BoutiqueRepository boutiqueRepository,
            CompteRepository compteRepository) {
        this.artisanRepository = artisanRepository;
        this.boutiqueRepository = boutiqueRepository;
        this.compteRepository = compteRepository;
    }

    @Transactional
    public Boutique createBoutique(Boutique boutique, Compte compte, Artisan artisan) {
        // Associer le compte à l'artisan
        artisan.setCompte(compte);
        Compte savedCompte = compteRepository.save(compte);

        // Enregistrer l'artisan
        artisan = artisanRepository.save(artisan);

        // Associer l'artisan à la boutique
        boutique.setArtisan(artisan);

        // Enregistrer la boutique
        return boutiqueRepository.save(boutique);
    }

    public Boutique getBoutiqueByUserId(Long userId) {
        return boutiqueRepository.findByArtisanCompteIdCompte(userId)
                .orElse(null); // Retourne null si aucune boutique n'est trouvée
    }

    public List<Boutique> getBoutiques() {
        List<Boutique> boutiques = boutiqueRepository.findAll();

        // Vérifier si la liste est vide et lancer une exception personnalisée
        if (boutiques.isEmpty()) {
            throw new ArtisansNotFoundException("Aucun  boutique trouvé.");
        }

        return boutiques;
    }

    public Boutique getBoutiqueById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("L'ID ne peut pas être null.");

        }
        return boutiqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("boutique non trouvé pour l'ID : " + id));
    }

    public String deleteBoutique(Long id) {
        try {
            Boutique boutique = boutiqueRepository.findById(id).orElse(null);
            if (boutique == null) {
                throw new ArtisansNotFoundException("No boutique found for ID: " + id);
            }
            boutiqueRepository.deleteById(id);
            return "Boutique deleted successfully.";
        } catch (DataAccessException e) {
            throw new RuntimeException("Database access error: " + e.getMessage(), e);
        }
    }

    public List<Produit> getProductByIdBoutique(Long idboutique) {
        return boutiqueRepository.findProduitsByBoutique(idboutique);
    }

    public List<Boutique> getBoutiqueByIdartisan(Artisan artisan) {
        return boutiqueRepository.findBoutiqueByIdArtisan(artisan);
    }
}
