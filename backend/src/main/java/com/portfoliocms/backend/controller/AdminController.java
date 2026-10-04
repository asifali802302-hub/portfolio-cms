package com.portfoliocms.backend.controller;

import com.portfoliocms.backend.entity.AdminUser;
import com.portfoliocms.backend.repository.AdminUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminUserRepository adminUserRepository;

    private final BCryptPasswordEncoder passwordEncoder;

public AdminController(
        AdminUserRepository adminUserRepository) {

    this.adminUserRepository = adminUserRepository;
    this.passwordEncoder = new BCryptPasswordEncoder();
}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminUser loginRequest) {

        Optional<AdminUser> adminUser =
                adminUserRepository.findByUsername(loginRequest.getUsername());

        if (adminUser.isPresent()
                && passwordEncoder.matches(
        loginRequest.getPassword(),
        adminUser.get().getPassword())) {

            return ResponseEntity.ok("Login successful");
        }

        return ResponseEntity
                .status(401)
                .body("Invalid username or password");
    }
}