package com.example.ArtFloow.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "compte") // Correspond au nom de la table SQL
public class Compte {


        public enum Role {
                ADMIN, ARTISAN
        }

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT
        @Column(name = "idCompte")
        private Long idCompte;

        @Column(name = "email") // UNIQUE, NOT NULL
        private String email;

        @Column(name = "motDePasse") // NOT NULL
        private String motDePasse;

        @Enumerated(EnumType.STRING)
        @Column(name = "role") // NOT NULL
        private Role role;

        @Column(name = "dateCreation") // TIMESTAMP
        private LocalDateTime dateCreation = LocalDateTime.now();



        public Compte(){
                this.dateCreation = LocalDateTime.now();
        }


        // Getters et setters
        public Long getIdCompte() {
                return idCompte;
        }

        public void setIdCompte(Long idCompte) {
                this.idCompte = idCompte;
        }

        public String getEmail() {
                return email;
        }

        public void setEmail(String email) {
                this.email = email;
        }

        public String getMotDePasse() {
                return motDePasse;
        }

        public void setMotDePasse(String motDePasse) {
                this.motDePasse = motDePasse;
        }



        public LocalDateTime getDateCreation() {
                return dateCreation;
        }

        public void setDateCreation(LocalDateTime dateCreation) {
                this.dateCreation = dateCreation;
        }

        public Role getRole() {
                return role;
        }

        public void setRole(Role role) {
                if (role == null) {
                        this.role = Role.ARTISAN;  // Si rôle est null, on assigne ARTISAN par défaut
                } else {
                        this.role = role;
                }
        }
}