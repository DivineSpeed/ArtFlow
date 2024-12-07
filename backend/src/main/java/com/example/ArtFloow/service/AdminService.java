package com.example.ArtFloow.service;


import com.example.ArtFloow.repository.AdminRepository;
import com.example.ArtFloow.repository.CompteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final CompteRepository compteRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public AdminService(AdminRepository adminRepository, CompteRepository compteRepository, PasswordEncoder passwordEncoder) {
        super();
        this.adminRepository = adminRepository;
        this.compteRepository = compteRepository;
        this.passwordEncoder = passwordEncoder;
    }




//    @Transactional
//    public Admin createCompteAdmin(AdminRequest adminRequest) {
//        // Créer un compte
//        Compte compte = new Compte();
//        compte.setEmail(adminRequest.getEmail());
//
//        // Hacher le mot de passe
//        String hashedPassword = passwordEncoder.encode(adminRequest.getPassword());
//        compte.setMotDePasse(hashedPassword);
//
//        // Sauvegarder le compte
//        compte = compteRepository.save(compte);
//
//        // Créer un admin
//        Admin admin = new Admin();
//        admin.setNom(adminRequest.getNom());
//        admin.setPrenom(adminRequest.getPrenom());
//        admin.setCompte(compte);  // Associer le compte à l'admin
//
//        // Sauvegarder l'admin
//        return adminRepository.save(admin);
//    }

}