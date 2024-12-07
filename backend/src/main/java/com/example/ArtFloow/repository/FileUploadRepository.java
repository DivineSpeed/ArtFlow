package com.example.ArtFloow.repository;

import com.example.ArtFloow.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileUploadRepository extends JpaRepository<FileMetadata, Long> {
    // Ajoutez des méthodes personnalisées si nécessaire
}
