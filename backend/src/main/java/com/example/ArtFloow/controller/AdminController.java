package com.example.ArtFloow.controller;

import com.example.ArtFloow.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admins")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }


//    @PostMapping("/createCompteAdmin")
//    public ResponseEntity<?> createCompteAdmin(@RequestBody AdminRequest adminRequest) {
//        try {
//            Admin createdAdmin = adminService.createCompteAdmin(adminRequest);
//            return ResponseEntity.status(HttpStatus.CREATED).body(createdAdmin);
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
//        }
//    }
}