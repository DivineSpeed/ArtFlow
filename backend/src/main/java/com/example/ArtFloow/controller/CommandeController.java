package com.example.ArtFloow.controller;

import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.entity.Boutique;
import com.example.ArtFloow.entity.Commande;
import com.example.ArtFloow.entity.Produit;
import com.example.ArtFloow.exceptions.PanierIntrouvableException;
import com.example.ArtFloow.service.ArtisanService;
import com.example.ArtFloow.service.BoutiqueService;
import com.example.ArtFloow.service.CommandeService;
import com.example.ArtFloow.service.ProduitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/Commandes")


public class CommandeController {


    private final CommandeService commandeService;
    private final ProduitService produitservice;
    private final BoutiqueService boutiqueservice;
    private final ArtisanService artisanservice;

    @Autowired
    public CommandeController(CommandeService commandeservice, ProduitService produitservice, BoutiqueService boutiqueservice, ArtisanService artisanservice) {
        this.commandeService = commandeservice;
        this.produitservice = produitservice;
        this.boutiqueservice = boutiqueservice;
        this.artisanservice = artisanservice;
    }

    @GetMapping("/All")
    public ResponseEntity<?> getCommande() {
        try {
            // Récupérer la liste des commandes
            List<Commande> commandes = commandeService.getCommandes();
            return ResponseEntity.ok(commandes); // HTTP 200 avec les données des commandes
        } catch (IllegalArgumentException ex) {
            // Lorsque la requête est mal formulée ou les paramètres sont invalides
            return ResponseEntity.badRequest().body("Erreur de requête : " + ex.getMessage()); // HTTP 400 pour mauvaise requête
        } catch (RuntimeException ex) {
            // Lorsque l'erreur est liée à une ressource non trouvée ou une autre erreur d'exécution
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ressource non trouvée : " + ex.getMessage()); // HTTP 404 pour non trouvé
        }
    }

    @GetMapping("/getCommandeByID/{id}")
    public ResponseEntity<?> getCommandeByid(@PathVariable Long id) {
        try {
            // Récupérer la liste des commandes
            Optional<Commande> c = commandeService.getCommandesByID(id);
            return ResponseEntity.ok(c); // HTTP 200 avec les données des commandes
        } catch (IllegalArgumentException ex) {
            // Lorsque la requête est mal formulée ou les paramètres sont invalides
            return ResponseEntity.badRequest().body("Erreur de requête : " + ex.getMessage()); // HTTP 400 pour mauvaise requête
        } catch (RuntimeException ex) {
            // Lorsque l'erreur est liée à une ressource non trouvée ou une autre erreur d'exécution
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ressource non trouvée : " + ex.getMessage()); // HTTP 404 pour non trouvé
        }
    }


    @GetMapping("/getCommandeByIDBoutique/{idboutique}")
    public ResponseEntity<?> getCommandeByidBoutique(@PathVariable Long idboutique) {
        try {
            // Récupérer les produits de la boutique
            List<Produit> produitsBoutique = boutiqueservice.getProductByIdBoutique(idboutique);

            if (produitsBoutique.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun produit trouvé pour cette boutique.");
            }

            // Récupérer toutes les commandes
            List<Commande> toutesLesCommandes = commandeService.getCommandes();

            // Filtrer les commandes contenant au moins un produit de la boutique
            List<Commande> commandesFiltrees = toutesLesCommandes.stream()
                    .filter(commande -> commande.getPanier().getItems().stream()
                            .anyMatch(item -> produitsBoutique.contains(item.getProduit())))
                    .collect(Collectors.toList());

            // Vérifier si des commandes ont été trouvées
            if (commandesFiltrees.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune commande associée à cette boutique.");
            }

            return ResponseEntity.ok(commandesFiltrees); // Retourner les commandes filtrées

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Erreur de requête : " + ex.getMessage()); // HTTP 400
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur : " + ex.getMessage()); // HTTP 500
        }
    }


    @GetMapping("/getCommandeByIDArtisan/{idArtisan}")
public ResponseEntity<?> getCommandeByidArtisan(@PathVariable Long idArtisan) {
    try {
        // Récupérer l'artisan
        Artisan artisan = artisanservice.getArtisanByCompteId(idArtisan);
        if (artisan == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artisan non trouvé.");
        }

        // Récupérer la boutique de l'artisan
        Boutique boutique = boutiqueservice.getBoutiqueByUserId(idArtisan);
        if (boutique == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune boutique trouvée pour cet artisan.");
        }

        // Récupérer les produits de la boutique
        List<Produit> produitsBoutique = boutiqueservice.getProductByIdBoutique(boutique.getIdBoutique());
        if (produitsBoutique.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun produit trouvé pour la boutique de cet artisan.");
        }

        // Récupérer toutes les commandes
        List<Commande> toutesLesCommandes = commandeService.getCommandes();

        // Filtrer les commandes contenant au moins un produit de la boutique
        List<Commande> commandesFiltrees = toutesLesCommandes.stream()
                .filter(commande -> commande.getPanier().getItems().stream()
                        .anyMatch(item -> produitsBoutique.contains(item.getProduit())))
                .collect(Collectors.toList());

        // Vérifier si des commandes ont été trouvées
        if (commandesFiltrees.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune commande associée à la boutique de cet artisan.");
        }

        return ResponseEntity.ok(commandesFiltrees); // Retourner les commandes filtrées

    } catch (IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body("Erreur de requête : " + ex.getMessage()); // HTTP 400
    } catch (RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur : " + ex.getMessage()); // HTTP 500
    }
}




    @PostMapping("/creer")
    public ResponseEntity<?> creerCommande(HttpServletRequest request, HttpSession session,
                                           @RequestBody Commande commande) {
        try {
            String sessionId = session.getId();

            // Step 1: Process the command (creation and validation)
            String m1 = commandeService.verifierEtCreerCommande(sessionId, commande);

            // Step 2: Invalidate the current session and create a new one
            session.invalidate();
            HttpSession newSession = request.getSession(true); // New session with a new sessionId

            // Step 3: Optional - Set attributes to the new session if needed
            newSession.setAttribute("orderStatus", "created");

            // Step 4: Prepare the response message
            String msg = "Commande confirmée. Nouveau sessionId : " + newSession.getId();

            // Step 5: Return the response
            Map<String, String> response = new HashMap<>();
            response.put("IdCommande", m1);

            return ResponseEntity.ok().body(response); // Returning the response map containing the message

        } catch (PanierIntrouvableException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erreur : " + ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur : " + ex.getMessage());
        }
    }

}