package com.example.ArtFloow.service;

import com.example.ArtFloow.entity.FileMetadata;
import com.example.ArtFloow.repository.FileUploadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class FileUploadService {

    @Autowired
    private FileUploadRepository fileUploadRepository;

    private final String uploadDir = "uploads/";

    public FileUploadService() {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public String saveFile(String base64Image, String fileName) throws IOException {
        byte[] decodedBytes = Base64.getDecoder().decode(base64Image);
        File file = new File(uploadDir + fileName);

        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(decodedBytes);
        }

        // Sauvegarder les métadonnées dans la base de données
        FileMetadata metadata = new FileMetadata();
        metadata.setFileName(fileName);
        metadata.setFilePath(file.getAbsolutePath());
        metadata.setUploadTime(LocalDateTime.now());
        fileUploadRepository.save(metadata);

        return file.getAbsolutePath();
    }
}
