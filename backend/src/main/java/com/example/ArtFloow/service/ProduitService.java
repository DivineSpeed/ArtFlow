package com.example.ArtFloow.service;

import com.example.ArtFloow.dto.UpdateProduitRequest;
import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.entity.Boutique;
import com.example.ArtFloow.entity.Compte;
import com.example.ArtFloow.entity.Produit;
import com.example.ArtFloow.repository.ArtisanRepository;
import com.example.ArtFloow.repository.BoutiqueRepository;
import com.example.ArtFloow.repository.CompteRepository;
import com.example.ArtFloow.repository.ProduitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final ArtisanRepository artisanRepository;
    private final BoutiqueRepository boutiqueRepository;
    private final CompteRepository compteRepository;


    public ProduitService(ProduitRepository produitRepository, ArtisanRepository artisanRepository, BoutiqueRepository boutiqueRepository, CompteRepository compteRepository) {
        this.produitRepository = produitRepository;
        this.artisanRepository = artisanRepository;
        this.boutiqueRepository = boutiqueRepository;
        this.compteRepository = compteRepository;
    }



    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }


    public Produit addProduitToBoutique(Produit produit, Long userId) {
        // Récupérer l'artisan par son compte
        Artisan artisan = artisanRepository.findByCompteIdCompte(userId)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé pour l'ID du compte : " + userId));

        // Vérifier si l'artisan a une boutique
        Boutique boutique = boutiqueRepository.findByArtisan(artisan)
                .orElseThrow(() -> new RuntimeException("Boutique introuvable pour cet artisan"));

        // Associer la boutique au produit
        produit.setBoutique(boutique);

        // Sauvegarder le produit dans le repository
        return produitRepository.save(produit);
    }



    public Produit updateProduit(Long idProduit, UpdateProduitRequest request) {
    // 1. Récupérer le produit à mettre à jour
    Produit produit = produitRepository.findById(idProduit)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

    // 2. Mettre à jour les informations du produit avec les valeurs du request body
    if (request.getNomProduit() != null) {
        produit.setNomProduit(request.getNomProduit());
    }
    if (request.getDescriptionProduit() != null) {
        produit.setDescriptionProduit(request.getDescriptionProduit());
    }
    if (request.getPrix() != null) {
        produit.setPrix(request.getPrix());
    }
    if (request.getQuantiteEnStock() != null) {
        produit.setQuantiteEnStock(request.getQuantiteEnStock());
    }
    if (request.getImageProduit() != null) {
        produit.setImageProduit(request.getImageProduit());
    }

    // 3. Sauvegarder les modifications dans la base de données
    return produitRepository.save(produit);
}





    public void deleteProduit(Long idProduit) {

        Produit produit = produitRepository.findById(idProduit)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));


        produitRepository.delete(produit);
    }



    public List<Produit> getProduitsByBoutique(Boutique boutique) {
        return produitRepository.findByBoutique(boutique);
    }

    private Artisan getArtisanByCompteId(Long compteId) {
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new IllegalArgumentException("Compte not found"));

        return artisanRepository.findByCompte(compte)
                .orElseThrow(() -> new IllegalArgumentException("Artisan not found for compte"));
    }

    public List<Produit> getAllProduitsByArtisan(Long idCompte) {
        Artisan artisan = getArtisanByCompteId(idCompte); // Récupérer l'artisan à partir de l'idCompte
        return produitRepository.findByBoutique_Artisan(artisan);
    }




    public List<Produit> getProduitsByArtisanActif(Long compteId) {
        // Récupérer l'artisan basé sur l'ID du compte
        Artisan artisan = artisanRepository.findByCompte_IdCompte(compteId)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));

        // Vérifier si l'artisan est actif
        if (artisan.getCompte().getRole() != Compte.Role.ARTISAN) {
            throw new RuntimeException("Utilisateur non authentifié ou rôle incorrect");
        }

        // Récupérer tous les produits associés à l'artisan
        return produitRepository.findByBoutique_Artisan_IdArtisan(artisan.getIdArtisan());
    }



    public List<Produit> getProduitsByNameArtisanActif(Long userId, String nomProduit) {
        // Trouver l'artisan correspondant au userId
        Artisan artisan = artisanRepository.findByCompte_IdCompte(userId)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));

        // Récupérer les produits de la boutique de cet artisan et filtrer par nom
        return produitRepository.findByBoutique_ArtisanAndNomProduitContaining(artisan, nomProduit);
    }


    public Produit getProduitById(Long userId, Long idProduit) {
        // Trouver l'artisan correspondant au userId
        Artisan artisan = artisanRepository.findByCompte_IdCompte(userId)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));

        // Trouver le produit en fonction de idProduit
        Produit produit = produitRepository.findById(idProduit)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        // Vérifier que le produit appartient à la boutique de cet artisan
        if (!produit.getBoutique().getArtisan().equals(artisan)) {
            throw new RuntimeException("Le produit n'appartient pas à cet artisan");
        }

        return produit;
    }



    public  List<Produit> getProduits() {
        List<Produit> produits=produitRepository.findAll();
        return produits; // Utilisation correcte de l'instance injectée
    }

    public Produit getOneProduit(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("L'ID ne peut pas être null.");

        }
        return produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé pour l'ID : " + id));
    }

}

