package com.example.ArtFloow.service;

import com.example.ArtFloow.dto.UpdateProfileRequest;
import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.entity.Boutique;
import com.example.ArtFloow.exceptions.ArtisansNotFoundException;
import com.example.ArtFloow.repository.ArtisanRepository;
import com.example.ArtFloow.repository.BoutiqueRepository;
import com.example.ArtFloow.repository.CompteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtisanService {
    private final ArtisanRepository artisanRepository;

    @Autowired
    private BoutiqueRepository boutiqueRepository;

   @Autowired
    private CompteRepository compteRepository;

    public ArtisanService(ArtisanRepository artisanRepository) {
        this.artisanRepository = artisanRepository;
    }

    public String updateArtisanAndBoutique(Long userId, UpdateProfileRequest request) {
        try {
            // Récupérer l'artisan par son userId (idCompte)
            Artisan artisan = artisanRepository.findByCompte_IdCompte(userId)
                    .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));

            // Mettre à jour les informations de l'artisan
            if (request.getNomArtisan() != null) {
                artisan.setNomArtisan(request.getNomArtisan());
            }
            if (request.getPrenomArtisan() != null) {
                artisan.setPrenomArtisan(request.getPrenomArtisan());
            }
            if (request.getNumTelephone() != null) {
                artisan.setNumTelephone(request.getNumTelephone());
            }

            // Sauvegarder les modifications de l'artisan
            artisanRepository.save(artisan);

            // Vérifier si l'artisan a une boutique associée
            Boutique boutique = boutiqueRepository.findByArtisan_IdArtisan(artisan.getIdArtisan())
                    .orElseThrow(() -> new RuntimeException("Boutique non trouvée"));

            // Mettre à jour les informations de la boutique
            if (request.getNomBoutique() != null) {
                boutique.setNomBoutique(request.getNomBoutique());
            }
            if (request.getDescription() != null) {
                boutique.setDescription(request.getDescription());
            }
            if (request.getAdresseBoutique() != null) {
                boutique.setAdresseBoutique(request.getAdresseBoutique());
            }
            if (request.getFacebookLink() != null) {
                boutique.setFacebookLink(request.getFacebookLink());
            }
            if (request.getInstagramLink() != null) {
                boutique.setInstagramLink(request.getInstagramLink());
            }

            // Sauvegarder les modifications de la boutique
            boutiqueRepository.save(boutique);

            return "Profil de l'artisan et de la boutique mis à jour avec succès";
        } catch (RuntimeException e) {
            throw new RuntimeException("Erreur de mise à jour: " + e.getMessage());
        }
    }



    public Artisan getArtisanByCompteId(Long idCompte) {
        return artisanRepository.findByCompteIdCompte(idCompte)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé pour le compte spécifié"));
    }




    public List<Artisan> getBoutiques() {
        List<Artisan> artisans = artisanRepository.findAll();

        // Vérifier si la liste est vide et lancer une exception personnalisée
        if (artisans.isEmpty()) {
            throw new ArtisansNotFoundException("Aucun artisan (boutique) trouvé.");
        }

        return artisans;
    }

    public Artisan getArtisanById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("L'ID ne peut pas être null.");

        }
        return artisanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé pour l'ID : " + id));
    }

    public String deleteArtisan(Long id) {
        try {
            Artisan A = artisanRepository.findById(id).orElse(null);
            if (A == null) {
                throw new ArtisansNotFoundException("Pas de boutique trouvée pour l'ID : " + id);
            }
            artisanRepository.deleteById(id);
            return ("Boutique supprimé avec succès.");
        } catch (DataAccessException e) {
            throw new RuntimeException("Erreur d'accès à la base de données : " + e.getMessage(), e);
        }
    }


}
