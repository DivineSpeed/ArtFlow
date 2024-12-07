package com.example.ArtFloow.controller;

import com.example.ArtFloow.entity.Panier;
import com.example.ArtFloow.entity.PanierItem;
import com.example.ArtFloow.exceptions.PanierIntrouvableException;
import com.example.ArtFloow.service.PanierItemService;
import com.example.ArtFloow.service.PanierService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class PanierController {

    @Autowired
    private PanierService panierservice;
    @Autowired
    private PanierItemService panieritemService;


    @GetMapping("/getAll")
    public List<Panier> getAllpanier() {
        // Appeler le service
        return panierservice.getPanier(); // Appel correct de la méthode
    }

    @PostMapping("/creer")
    public ResponseEntity<Panier> creerPanier(HttpSession session) {
        String sessionId = session.getId();  // Récupérer l'ID de session

        Panier panier = panierservice.createPanier(sessionId);
        return ResponseEntity.status(HttpStatus.CREATED).body(panier);
    }

    @GetMapping("/getPanier")
    public ResponseEntity<?> getPanierBySessionId(HttpSession session) {
        String sessionId = session.getId();  // Récupérer l'ID de session

        try {
            // Récupérer le panier via le service
            Panier panier = panierservice.getPanierBySessionId(sessionId);

            // Retourner directement l'objet panier, qui sera converti en JSON
            return ResponseEntity.ok(panier);
        } catch (PanierIntrouvableException ex) {
            // Retourner une erreur 404 si le panier n'est pas trouvé
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erreur : " + ex.getMessage());
        } catch (Exception ex) {
            // Gérer les erreurs inattendues avec une réponse 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur du serveur : " + ex.getMessage());
        }
    }


    @GetMapping("/getPanierByPanierId/{id}")
    public ResponseEntity<?> getPanierByPanierId(@PathVariable Long id) {

        try {
            // Récupérer le panier via le service
            Panier panier = panierservice.getPanierByPanierId(id);

            // Retourner directement l'objet panier, qui sera converti en JSON
            return ResponseEntity.ok(panier);
        } catch (PanierIntrouvableException ex) {
            // Retourner une erreur 404 si le panier n'est pas trouvé
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erreur : " + ex.getMessage());
        } catch (Exception ex) {
            // Gérer les erreurs inattendues avec une réponse 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur du serveur : " + ex.getMessage());
        }
    }

    @GetMapping("/getPanierItems")
    public ResponseEntity<?> getpanierItemBySessionID(HttpSession session) {
        String sessionId = session.getId();  // Récupérer l'ID de session

        try {
            // Récupérer le panier via le service
            List<PanierItem> panierItems = panieritemService.getpanierItemBySessionID(sessionId);

            // Retourner directement l'objet panier, qui sera converti en JSON
            return ResponseEntity.ok(panierItems);
        } catch (PanierIntrouvableException ex) {
            // Retourner une erreur 404 si le panier n'est pas trouvé
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erreur : " + ex.getMessage());
        } catch (Exception ex) {
            // Gérer les erreurs inattendues avec une réponse 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur du serveur : " + ex.getMessage());
        }
    }


    /* @PostMapping("/add")
     public ResponseEntity<String> addToCart(@RequestParam Integer productId, HttpSession session) {
         // Récupérer le session ID
         String sessionId = session.getId();

         try {
             // Appeler la méthode du service pour ajouter un produit au panier
             String responseMessage = panierservice.addToCart(sessionId, productId);
             // Si tout est ok, retourner une réponse 200 (OK)
             return ResponseEntity.ok(responseMessage);
         } catch (RuntimeException ex) {
             // Si une erreur de produit non trouvé ou autre exception, retourner 404 ou 400
             return ResponseEntity.status(HttpStatus.NOT_FOUND)
                     .body("Erreur: " + ex.getMessage());
         } catch (Exception ex) {
             // Si une erreur inattendue, retourner 500
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body("Erreur du serveur: " + ex.getMessage());
         }
     }*/
    @PostMapping("/ajouter")
    public ResponseEntity<Map<String, String>> ajouterAuPanier(
            @RequestParam int quantite,
            @RequestParam Long Idproduit,
            HttpSession session) {
        String sessionId = session.getId();
        String responseMessage = panierservice.ajouterAuPanier(quantite, Idproduit, sessionId);

        Map<String, String> response = new HashMap<>();
        response.put("message", responseMessage);

        if (responseMessage.equals("Quantité invalide !")) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        } else {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(response);
        }
    }


    @DeleteMapping("/removeItem")
    public ResponseEntity<Map<String, String>> removeItemFromCart(
                @RequestParam Long Idproduit, HttpSession session) {
        String sessionId = session.getId();
        String responseMessage = panierservice.removeItemFromCart(Idproduit, sessionId);

        Map<String, String> response = new HashMap<>();
        response.put("message", responseMessage);

        if (responseMessage.contains("successfully")) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Endpoint to update item quantity in the cart
    @PutMapping("/updateQuantity")
    public ResponseEntity<Map<String, String>> updateItemQuantityInCart(
            @RequestParam Long Idproduit, @RequestParam int quantite, HttpSession session) {
        String sessionId = session.getId();
        String responseMessage = panierservice.updateItemQuantityInCart(Idproduit, quantite, sessionId);

        Map<String, String> response = new HashMap<>();
        response.put("message", responseMessage);

        if (responseMessage.contains("updated")) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

}
