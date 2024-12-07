package com.example.ArtFloow.controller;

import com.example.ArtFloow.dto.UpdateProfileRequest;
import com.example.ArtFloow.entity.Artisan;
import com.example.ArtFloow.service.ArtisanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artisans")

    public class ArtisanController {

        @Autowired
        private ArtisanService artisanService;


    @PutMapping("/updateProfile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        try {
            String response = artisanService.updateArtisanAndBoutique(request.getUserId(), request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }


    @GetMapping("/All")
    public List<Artisan> getAllboutiques() {
        // Appeler le service
        return artisanService.getBoutiques(); // Appel correct de la méthode
    }
    @GetMapping("/getArtisanById/{id}")
    public ResponseEntity<?> getArtisanbyId(@PathVariable Long id) {
        try {
            Artisan artisan = artisanService.getArtisanById(id);
            return ResponseEntity.ok(artisan); // HTTP 200 with product data
        } catch (IllegalArgumentException ex) {//The ex.getMessage() method retrieves the message associated with the exception that was thrown
            return ResponseEntity.badRequest().body(ex.getMessage()); // HTTP 400 for bad request
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); // HTTP 404 for not found
        }
    }

    @DeleteMapping("/deleteArtisanByid/{id}")
    public ResponseEntity<?> DeleteBoutiquebyId(@PathVariable Long id) {
        try {
            String S = artisanService.deleteArtisan(id);
            return ResponseEntity.ok(S); // HTTP 200 with product data
        } catch (
                IllegalArgumentException ex) {//The ex.getMessage() method retrieves the message associated with the exception that was thrown
            return ResponseEntity.badRequest().body(ex.getMessage()); // HTTP 400 for bad request
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); // HTTP 404 for not found
        }
    }


}

