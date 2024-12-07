package com.example.ArtFloow.controller;

import com.example.ArtFloow.dto.LoginRequest;
import com.example.ArtFloow.dto.LoginResponse;
import com.example.ArtFloow.entity.Compte;
import com.example.ArtFloow.service.CompteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final CompteService compteService;

    public AuthController(CompteService compteService) {
        this.compteService = compteService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        // Authentifier l'utilisateur
        Compte compte = compteService.authenticateUser(request.getEmail(), request.getPassword());

        if (compte == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // Invalider une session existante
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // Créer une nouvelle session
        session = httpRequest.getSession(true);
        session.setMaxInactiveInterval(5 * 60 * 60); // 5 heures en secondes

        // Générer un jeton unique
        String token = java.util.UUID.randomUUID().toString();

        // Stocker les informations dans la session
        session.setAttribute("token", token);
        session.setAttribute("userId", compte.getIdCompte());
        session.setAttribute("role", compte.getRole());

        System.out.println("Session créée pour l'utilisateur avec jeton : " + token);

        // Retourner le jeton et les informations utilisateur
        return ResponseEntity.ok(new LoginResponse(token, compte.getRole().name(), compte.getIdCompte()));
    }



    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); // Invalidates the session to log out the user
        return ResponseEntity.ok("Logged out successfully");
    }
}
