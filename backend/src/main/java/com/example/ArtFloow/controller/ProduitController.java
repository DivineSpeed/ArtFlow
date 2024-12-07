package com.example.ArtFloow.controller;

import com.example.ArtFloow.dto.SearchProduitRequest;
import com.example.ArtFloow.dto.UpdateProduitRequest;
import com.example.ArtFloow.dto.UserIdRequest;
import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.entity.Boutique;
import com.example.ArtFloow.entity.Produit;
import com.example.ArtFloow.entity.Role;
import com.example.ArtFloow.repository.CompteRepository;
import com.example.ArtFloow.service.ArtisanService;
import com.example.ArtFloow.service.BoutiqueService;
import com.example.ArtFloow.service.FileUploadService;
import com.example.ArtFloow.service.ProduitService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/produits")
public class ProduitController {

    private final ProduitService produitService;
    private final BoutiqueService boutiqueService;
    private final ArtisanService artisanService;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private CompteRepository compteRepository;

    public ProduitController(ProduitService produitService, BoutiqueService boutiqueService, ArtisanService artisanService) {
        this.produitService = produitService;
        this.boutiqueService = boutiqueService;
        this.artisanService = artisanService;
    }

    // Route publique accessible à tous
    @GetMapping("/allProducts")
    public ResponseEntity<List<Produit>> getAllProduits() {
        List<Produit> produits = produitService.getAllProduits();
        return ResponseEntity.ok(produits);
    }


    @PostMapping("/artisan/addProduct")
    public ResponseEntity<?> addProduit(@RequestBody Map<String, Object> requestBody) {
        try {
            // Extraire l'ID de compte et les détails du produit depuis le corps de la requête
            Long userId = Long.valueOf(requestBody.get("userId").toString());
            Map<String, Object> produitData = (Map<String, Object>) requestBody.get("produit");

            if (userId == null || produitData == null) {
                return new ResponseEntity<>("Paramètres invalides : userId ou produit manquant", HttpStatus.BAD_REQUEST); // 400
            }

            // Construire un objet Produit à partir des données reçues
            Produit produit = new Produit();
            produit.setNomProduit((String) produitData.get("nomProduit"));
            produit.setDescriptionProduit((String) produitData.get("descriptionProduit"));
            produit.setPrix(new BigDecimal(produitData.get("prix").toString()));
            produit.setQuantiteEnStock(Integer.valueOf(produitData.get("quantiteEnStock").toString()));
            produit.setImageProduit((String) produitData.get("imageProduit"));

            // Appeler le service pour associer et sauvegarder le produit à la boutique de l'artisan
            Produit savedProduit = produitService.addProduitToBoutique(produit, userId);

            if (savedProduit != null) {
                return new ResponseEntity<>(savedProduit, HttpStatus.CREATED); // 201 Created
            } else {
                return new ResponseEntity<>("Erreur lors de l'ajout du produit", HttpStatus.BAD_REQUEST); // 400 Bad Request
            }

        } catch (SecurityException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // 401 Unauthorized

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400 Bad Request

        } catch (Exception e) {
            return new ResponseEntity<>("Erreur interne du serveur", HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    //    /// Méthode pour mettre à jour un produit
    @PutMapping("/artisan/updateProduit/{idProduit}")
    public ResponseEntity<?> updateProduit(@PathVariable Long idProduit, @RequestBody UpdateProduitRequest request) {
        try {
            // Appeler le service pour mettre à jour le produit
            Produit updatedProduit = produitService.updateProduit(idProduit, request);

            // Si le produit a été mis à jour, retourner le produit mis à jour
            if (updatedProduit != null) {
                return new ResponseEntity<>(updatedProduit, HttpStatus.OK); // 200 OK
            } else {
                return new ResponseEntity<>("Produit non trouvé", HttpStatus.NOT_FOUND); // 404 Not Found
            }

        } catch (RuntimeException e) {
            // En cas d'erreur spécifique, retourner un message d'erreur avec code 400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400 Bad Request

        } catch (Exception e) {
            // En cas d'erreur générale, retourner un message d'erreur avec code 500 (Internal Server Error)
            return new ResponseEntity<>("Erreur interne du serveur", HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }


    @DeleteMapping("/artisan/deleteProduit/{idProduit}")
    public ResponseEntity<?> deleteProduit(@PathVariable Long idProduit) {
        try {
            produitService.deleteProduit(idProduit);

            return ResponseEntity.ok("Produit supprimé avec succès"); // 204

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400

        } catch (Exception e) {
            return new ResponseEntity<>("Erreur interne du serveur", HttpStatus.INTERNAL_SERVER_ERROR); // 500
        }
    }


    @PostMapping("/artisan/getProduitsByArtisanActif")
    public ResponseEntity<List<Produit>> getProduitsByArtisanActif(@RequestBody Long compteId) {
        if (compteId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.emptyList());
        }

        try {
            List<Produit> produits = produitService.getProduitsByArtisanActif(compteId);
            return ResponseEntity.ok(produits);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Collections.emptyList());
        }
    }


    @PostMapping("/artisan/getBoutiqueByUserId")
    public ResponseEntity<Boutique> getBoutiqueByUserId(@RequestBody Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            Boutique boutique = boutiqueService.getBoutiqueByUserId(userId);
            if (boutique == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(boutique);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // Utilitaires pour la validation
    private void validateArtisan(HttpSession session) {
        if (session == null || session.getAttribute("role") == null) {
            throw new SecurityException("Unauthorized: No session or role found");
        }

        Role role;
        try {
            role = Role.valueOf(session.getAttribute("role").toString());
        } catch (IllegalArgumentException e) {
            throw new SecurityException("Forbidden: Invalid role");
        }

        if (role != Role.ARTISAN) {
            throw new SecurityException("Forbidden: Access denied");
        }
    }

    private Long getUserIdFromSession(HttpSession session) {
        Object userId = session.getAttribute("userId");
        if (userId == null || !(userId instanceof Long)) {
            throw new SecurityException("Unauthorized: User ID not found");
        }
        return (Long) userId;
    }

    @PostMapping("/artisan/getArtisanByUserId")
    public ResponseEntity<Artisan> getArtisanByUserId(@RequestBody Long userId) {
        try {
            Artisan artisan = artisanService.getArtisanByCompteId(userId);
            return ResponseEntity.ok(artisan);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @GetMapping("/artisan/searchProduitsByName")
    public ResponseEntity<List<Produit>> searchProduitsByName(@RequestBody SearchProduitRequest request) {
        Long compteId = request.getUserId();

        // Vérifier si le userId est valide
        if (compteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.emptyList());
        }

        try {
            // Appeler le service pour récupérer les produits par nom dans la boutique de l'artisan
            List<Produit> produits = produitService.getProduitsByNameArtisanActif(compteId, request.getNomProduit());
            return ResponseEntity.ok(produits);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Collections.emptyList());
        }
    }

    @PostMapping("/artisan/getProduitById/{idProduit}")
    public ResponseEntity<?> getProductById(@RequestBody UserIdRequest request, @PathVariable Long idProduit) {
        Long compteId = request.getUserId();

        // Vérification si le userId est valide
        if (compteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Utilisateur non authentifié");
        }

        try {
            // Appel du service pour obtenir le produit
            Produit produit = produitService.getProduitById(compteId, idProduit);

            // Si le produit existe et appartient à l'artisan
            if (produit != null) {
                return ResponseEntity.ok(produit);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Produit non trouvé ou il n'appartient pas à cet artisan");
            }

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());
        }
    }


    @GetMapping("/public/products")
    public List<Produit> getAllProduitsPublic() {
        // Appeler le service
        return produitService.getProduits(); // Appel correct de la méthode
    }


    @GetMapping("/getproductbyid/{id}")
    public ResponseEntity<?> getOneProduit(@PathVariable Long id) {
        try {
            Produit produit = produitService.getOneProduit(id);
            return ResponseEntity.ok(produit); // HTTP 200 with product data
        } catch (
                IllegalArgumentException ex) {//The ex.getMessage() method retrieves the message associated with the exception that was thrown
            return ResponseEntity.badRequest().body(ex.getMessage()); // HTTP 400 for bad request
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); // HTTP 404 for not found
        }
    }
}
