package com.example.ArtFloow.service;

import com.example.ArtFloow.entity.Panier;
import com.example.ArtFloow.entity.PanierItem;
import com.example.ArtFloow.entity.Produit;
import com.example.ArtFloow.exceptions.ArtisansNotFoundException;
import com.example.ArtFloow.exceptions.PanierIntrouvableException;
import com.example.ArtFloow.repository.PanierItemRepository;
import com.example.ArtFloow.repository.PanierRepository;
import com.example.ArtFloow.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PanierService {
    private final PanierRepository panierRepository;
    private final ProduitRepository produitRepository;
    private final PanierItemRepository panierItemRepository;

    @Autowired
    public PanierService(PanierRepository panierRepository, ProduitRepository produitRepository, PanierItemRepository panierItemRepository) {
        this.panierRepository = panierRepository;
        this.produitRepository = produitRepository;
        this.panierItemRepository = panierItemRepository;
    }


    public Panier createPanier(String sessionId) {
        // Créer une nouvelle instance de panier
        Panier panier = new Panier();

        panier.setSessionId(sessionId);

        panierRepository.save(panier);

        return panier;
    }

    public List<Panier> getPanier() {
        List<Panier> paniers = panierRepository.findAll();

        // Vérifier si la liste est vide et lancer une exception personnalisée
        if (paniers.isEmpty()) {
            throw new ArtisansNotFoundException("Aucun artisan (boutique) trouvé.");
        }

        return paniers;
    }

    public Panier getPanierByPanierId(Long PanierId) {
        Panier panier = panierRepository.findById(PanierId)
                .orElseThrow(() -> new PanierIntrouvableException("Panier introuvable pour cette session"));


        return panier;
    }

    public Panier getPanierBySessionId(String SessionId) {
        Panier panier = panierRepository.findBySessionId(SessionId)
                .orElseThrow(() -> new PanierIntrouvableException("Panier introuvable pour cette session"));


        return panier;
    }

    @Transactional  // Assure que la suppression est atomique
    public String deletePanier(String sessionId) {
        Optional<Panier> optionalPanier = panierRepository.findBySessionId(sessionId);

        if (optionalPanier.isPresent()) {
            Panier panier = optionalPanier.get();

            // Suppression des items associés si nécessaire
            panierItemRepository.deleteByIdPanier(panier.getIdPanier());

            // Suppression du panier
            panierRepository.deleteById(panier.getIdPanier());

            return "Le panier a été supprimé avec succès";
        } else {
            return "Panier non trouvé pour la session ID : " + sessionId;
        }
    }


   /* public String addToCart(String sessionId, Integer idProduit) {
        // 1. Récupérer ou créer un panier pour le sessionId
        panier panier = panierRepo.findBySessionId(sessionId)
                .orElseGet(() -> {
                    panier newPanier = new panier();
                    newPanier.setSessionId(sessionId);
                    return panierRepo.save(newPanier);
                });

        // 2. Vérifier si le produit existe dans la base
        produit produit = produitRepo.findById(Long.valueOf(idProduit))
                .orElseThrow(() -> new RuntimeException("Produit introuvable avec l'ID : " + idProduit));

        // 3. Vérifier si le produit est déjà dans le panier
        panierItem existingItem = panieritemRepo.findByPanierAndProduit(panier, produit);  // Utiliser l'instance

        if (existingItem != null) {
            // Si le produit est déjà dans le panier, incrémenter la quantité
            return "Produit deja existe dans le panier !";

        } else {
            // Si le produit n'est pas dans le panier, ajouter un nouvel article
            panierItem newItem = new panierItem();
            newItem.setPanier(panier);
            newItem.setProduit(produit);
            newItem.setQuantite(1);
            panieritemRepo.save(newItem);
            return "Produit ajouté au panier avec succès !";

        }

    }*/


    public String ajouterAuPanier(int quantite, Long idProduit, String sessionId) {
        // Vérification de la quantité valide
        PanierItem panierItem = new PanierItem();
        if (quantite <= 0) {
            return "Quantité invalide !";
        }

        // Récupérer ou créer le panier pour la session donnée
        Panier p = this.getPanierBySessionId(sessionId);
        if (p == null) {
            // Si le panier n'existe pas, créer un nouveau panier
            p = createPanier(sessionId);
            panierRepository.save(p);
        }

        // Associer le panier au panierItem
        panierItem.setPanier(p);
        panierItem.setQuantite(quantite);
        Produit pro = produitRepository.getReferenceById(idProduit);
        panierItem.setProduit(pro);

        // Sauvegarde du panierItem dans la base de données
        panierItemRepository.save(panierItem);

        // Retourner un message de succès
        return "Produit ajouté avec succès au panier !";
    }



    @Transactional
    public String removeItemFromCart(Long idProduit, String sessionId) {
        Panier panier = this.getPanierBySessionId(sessionId);
        if (panier != null) {
            Produit produit = produitRepository.findById(idProduit).orElse(null); // Get the product by its ID
            if (produit != null) {
                PanierItem panierItem = panierItemRepository.findByPanierAndProduit(panier, produit);
                if (panierItem != null) {
                    panierItemRepository.delete(panierItem); // Remove item from cart
                    return "Item removed successfully from the cart!";
                } else {
                    return "Item not found in the cart.";
                }
            } else {
                return "Product not found.";
            }
        }
        return "Cart not found for this session.";
    }

    // Method to update the quantity of a cart item
    @Transactional
    public String updateItemQuantityInCart(Long idProduit, int quantity, String sessionId) {
        if (quantity <= 0) {
            return "Invalid quantity.";
        }
        Panier panier = this.getPanierBySessionId(sessionId);
        if (panier != null) {
            Produit produit = produitRepository.findById(idProduit).orElse(null); // Get the product by its ID
            if (produit != null) {
                PanierItem panierItem = panierItemRepository.findByPanierAndProduit(panier, produit);
                if (panierItem != null) {
                    panierItem.setQuantite(quantity); // Update the quantity
                    panierItemRepository.save(panierItem); // Save updated item
                    return "Item quantity updated successfully!";
                } else {
                    return "Item not found in the cart.";
                }
            } else {
                return "Product not found.";
            }
        }
        return "Cart not found for this session.";
    }
}