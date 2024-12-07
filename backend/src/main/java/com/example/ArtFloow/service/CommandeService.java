package com.example.ArtFloow.service;

import com.example.ArtFloow.entity.Commande;
import com.example.ArtFloow.entity.Panier;
import com.example.ArtFloow.entity.PanierItem;
import com.example.ArtFloow.entity.Produit;
import com.example.ArtFloow.exceptions.CommandeNotFoundException;
import com.example.ArtFloow.exceptions.PanierIntrouvableException;
import com.example.ArtFloow.repository.CommandeRepository;
import com.example.ArtFloow.repository.PanierItemRepository;
import com.example.ArtFloow.repository.PanierRepository;
import com.example.ArtFloow.repository.ProduitRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Service
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final PanierRepository panierRepository;
    private final PanierItemRepository panierItemRepository;
    private final ProduitRepository produitRepository;

    @Autowired
    public CommandeService(CommandeRepository commandeRepository, PanierRepository panierRepository, PanierItemRepository panierItemRepository, ProduitRepository produitRepository) {
        this.commandeRepository = commandeRepository;
        this.panierRepository = panierRepository;
        this.panierItemRepository = panierItemRepository;
        this.produitRepository = produitRepository;
    }




    // Récupérer toutes les commandes
    public List<Commande> getCommandes() {
        List<Commande> commandes = commandeRepository.findAll();

        // Vérifier si la liste est vide et lancer une exception personnalisée
        if (commandes.isEmpty()) {
            throw new CommandeNotFoundException("Aucune commande trouvée.");
        }

        return commandes;
    }

    // Récupérer toutes les commandes
    public Optional<Commande> getCommandesByID(Long idCommande) {
        Optional<Commande> c = commandeRepository.findById(idCommande);

        // Vérifier si la liste est vide et lancer une exception personnalisée
        if (c.isEmpty()) {
            throw new CommandeNotFoundException("Aucune commande trouvée.");
        }

        return c;
    }

    // Vérifier et valider une commande
    /*public commande verifierCommande(Long idCommande) {
        Optional<Commande> optionalCommande = Commanderepo.findById(idCommande);

        if (!optionalCommande.isPresent()) {
            throw new CommandeNotFoundException("Commande introuvable avec l'ID : " + idCommande);
        }

        commande cmd = optionalCommande.get();

        Commanderepo.save(cmd); // Sauvegarder la commande avec le nouveau statut
        return cmd;

    }*/

    @Transactional
    public String verifierEtCreerCommande(String sessionId, Commande commande) {
        // Récupérer le panier du visiteur
        Panier panier = panierRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new PanierIntrouvableException("Panier introuvable pour cette session"));

        // Vérifier si le panier est vide
        if (panier.getItems().isEmpty()) {
            panierRepository.delete(panier);
            return "Le panier est vide et a été supprimé.";
        }

        // Mettre à jour le stock des produits
        for (PanierItem item : panier.getItems()) {
            Produit produit = item.getProduit();
            if(produit.getQuantiteEnStock()<=0){
                return "La quanite en stock est <=0";


            }
            else{
                produit.setQuantiteEnStock(produit.getQuantiteEnStock() - item.getQuantite());
                produitRepository.save(produit);  // Enregistrer la mise à jour du stock dans la base de données
            }}

        // Calculer le prix total de la commande directement à partir des articles du panier
        BigDecimal total = panier.getItems().stream()
                .map(item -> item.getProduit().getPrix().multiply(BigDecimal.valueOf(item.getQuantite())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        commande.setPrixTotalCommande(total);
        commande.setPanier(panier);

        // Enregistrer la commande dans la base de données
        commandeRepository.save(commande);


        return ""+commande.getIdCommande();
    }



}
