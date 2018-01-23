package com.example;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;

@Controller
public class HomeController {

    public HomeController() {
    }

    @GetMapping("/home")
    public String howdy(Model model, Principal user) {
        model.addAttribute("user", user);
        return "home";
    }
}