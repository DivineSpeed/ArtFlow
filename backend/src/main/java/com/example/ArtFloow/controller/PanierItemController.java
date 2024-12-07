package com.example.ArtFloow.controller;

import com.example.ArtFloow.service.PanierItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/panierItem")
public class PanierItemController {
    private final PanierItemService panierItemservice;
    @Autowired
    public PanierItemController(PanierItemService panierItemservice) {
        this.panierItemservice = panierItemservice;
    }

   /* @GetMapping("/getproductbyid/{id}")

    public List<panierItem> getpanierItemByPanierID (@PathVariable Integer id) {
        return  panierItemservice.getpanierItemByPanierID(id);

    }
*/

}