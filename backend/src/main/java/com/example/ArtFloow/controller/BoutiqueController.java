package com.example.ArtFloow.controller;

import com.example.ArtFloow.dto.BoutiqueRequest;
import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.entity.Boutique;
import com.example.ArtFloow.entity.Compte;
import com.example.ArtFloow.service.BoutiqueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boutiques")
public class BoutiqueController {

    private final BoutiqueService boutiqueService;
    private final PasswordEncoder passwordEncoder;

    public BoutiqueController(BoutiqueService boutiqueService, PasswordEncoder passwordEncoder) {
        this.boutiqueService = boutiqueService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/createBoutique")
    public ResponseEntity<?> createBoutique(@RequestBody BoutiqueRequest boutiqueRequest) {
        try {
            // Créer un compte avec mot de passe hashé
            Compte compte = new Compte();
            compte.setEmail(boutiqueRequest.getEmail());
            compte.setMotDePasse(passwordEncoder.encode(boutiqueRequest.getPassword())); // Hachage du mot de passe
            compte.setRole(boutiqueRequest.getRole() != null ? boutiqueRequest.getRole() : Compte.Role.ARTISAN);

            // Créer un artisan
            Artisan artisan = new Artisan();
            artisan.setNomArtisan(boutiqueRequest.getNomArtisan());
            artisan.setPrenomArtisan(boutiqueRequest.getPrenomArtisan());
            artisan.setNumTelephone(boutiqueRequest.getNumTelephone());

            // Créer une boutique
            Boutique boutique = new Boutique();
            boutique.setNomBoutique(boutiqueRequest.getNomBoutique());
            boutique.setDescription(boutiqueRequest.getDescription());
            boutique.setAdresseBoutique(boutiqueRequest.getAdresseBoutique());
            boutique.setFacebookLink(boutiqueRequest.getFacebookLink());
            boutique.setInstagramLink(boutiqueRequest.getInstagramLink());

            // Appeler le service pour enregistrer la boutique, le compte et l'artisan
            Boutique savedBoutique = boutiqueService.createBoutique(boutique, compte, artisan);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedBoutique);
        } catch (Exception ex) {
            // Gérer les erreurs génériques avec ResponseEntity
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ex.getMessage());
        }
    }


    @GetMapping("/All")
    public List<Boutique> getAllboutiques() {
        // Appeler le service
        return boutiqueService.getBoutiques(); // Appel correct de la méthode
    }
    @GetMapping("/getBoutiqueById/{id}")
    public ResponseEntity<?> getArtisanbyId(@PathVariable Long id) {
        try {
            Boutique boutique = boutiqueService.getBoutiqueById(id);
            return ResponseEntity.ok(boutique); // HTTP 200 with product data
        } catch (IllegalArgumentException ex) {//The ex.getMessage() method retrieves the message associated with the exception that was thrown
            return ResponseEntity.badRequest().body(ex.getMessage()); // HTTP 400 for bad request
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); // HTTP 404 for not found
        }
    }



    @DeleteMapping("/deleteBoutiqueByid/{id}")
    public ResponseEntity<?> DeleteBoutiquebyId(@PathVariable Long id) {
        try {
            String S = boutiqueService.deleteBoutique(id);
            return ResponseEntity.ok(S); // HTTP 200 with product data
        } catch (
                IllegalArgumentException ex) {//The ex.getMessage() method retrieves the message associated with the exception that was thrown
            return ResponseEntity.badRequest().body(ex.getMessage()); // HTTP 400 for bad request
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); // HTTP 404 for not found
        }
    }

}
