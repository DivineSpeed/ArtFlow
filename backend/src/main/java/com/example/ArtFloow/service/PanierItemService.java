package com.example.ArtFloow.service;

import com.example.ArtFloow.entity.Panier;
import com.example.ArtFloow.entity.PanierItem;
import com.example.ArtFloow.exceptions.PanierIntrouvableException;
import com.example.ArtFloow.repository.PanierItemRepository;
import com.example.ArtFloow.repository.PanierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PanierItemService {
    @Autowired
    private final PanierItemRepository panierItemRepo;
    private final PanierRepository panierRepo;


    public PanierItemService(PanierItemRepository panierItemRepo, PanierRepository panierRepo) {
        this.panierItemRepo = panierItemRepo;
        this.panierRepo = panierRepo;
    }


    public List<PanierItem> getpanierItemBySessionID(String SessionId) {
        Panier panier = panierRepo.findBySessionId(SessionId)
                .orElseThrow(() -> new PanierIntrouvableException("Panier introuvable pour cette session"));

        List<PanierItem> panierItemByPanierID = panierItemRepo.findByPanierId(panier.getIdPanier());

        // Vérifier si la liste est vide et lancer une exception personnalisée
        if (panierItemByPanierID.isEmpty()) {
            throw new PanierIntrouvableException("Aucun panierItem trouvé pour cette panier.");
        }

        return panierItemByPanierID;
    }
}