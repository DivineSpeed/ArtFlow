package com.example.ArtFloow.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "panier") // Correspond au nom de la table SQL

public class Panier {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long idPanier;

        @Column(nullable = false, unique = true)
        private String sessionId;  // Identifiant unique pour la session

        @Column(nullable = false)
        private LocalDateTime dateCreation = LocalDateTime.now();  // Date de création du panier

        @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<PanierItem> items = new ArrayList<>();  // Liste des articles dans le panier

        // Getters and setters
        public Long getIdPanier() {
            return idPanier;
        }

        public void setIdPanier(Long idPanier) {
            this.idPanier = idPanier;
        }

        public String getSessionId() {
            return sessionId;
        }

        public void setSessionId(String sessionId) {
            this.sessionId = sessionId;
        }

        public LocalDateTime getDateCreation() {
            return dateCreation;
        }

        public void setDateCreation(LocalDateTime dateCreation) {
            this.dateCreation = dateCreation;
        }

        public List<PanierItem> getItems() {
            return items;
        }

        public void setItems(List<PanierItem> items) {
            this.items = items;
        }

        // Méthodes utilitaires pour gérer les items
        public void addItem(PanierItem item) {
            items.add(item);
            item.setPanier(this);
        }

        public void removeItem(PanierItem item) {
            items.remove(item);
            item.setPanier(null);
        }


    }