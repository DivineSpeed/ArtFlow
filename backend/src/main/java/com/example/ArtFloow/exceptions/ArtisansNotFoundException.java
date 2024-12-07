package com.example.ArtFloow.exceptions;

public class ArtisansNotFoundException extends RuntimeException {
    public ArtisansNotFoundException(String message) {
        super(message);
    }
}