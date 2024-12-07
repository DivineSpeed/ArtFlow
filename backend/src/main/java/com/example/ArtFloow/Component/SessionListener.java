package com.example.ArtFloow.Component;

import com.example.ArtFloow.service.PanierService;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import org.springframework.beans.factory.annotation.Autowired;

public class SessionListener implements HttpSessionListener {

    @Autowired
    private PanierService panierService;

    @Override
    public void sessionCreated(HttpSessionEvent se) {


    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        String sessionId = se.getSession().getId();

    }
}
