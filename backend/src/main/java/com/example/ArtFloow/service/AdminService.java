package com.example.ArtFloow.service;


import com.example.ArtFloow.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final AdminRepository adminRepository;

    @Autowired
    public AdminService(AdminRepository adminRepository) {
        super();
        this.adminRepository = adminRepository;
    }

}