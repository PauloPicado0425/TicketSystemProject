package com.paulo.ticketsystem.controller;

import com.paulo.ticketsystem.dto.AuthResponse;
import com.paulo.ticketsystem.dto.LoginRequest;
import com.paulo.ticketsystem.dto.RegisterRequest;
import com.paulo.ticketsystem.security.JwtService;
import com.paulo.ticketsystem.user.AppUser;
import com.paulo.ticketsystem.user.AppUserRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
   
    private final AppUserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public AuthController(
            AppUserRepository userRepo,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authManager,
            JwtService jwtService
    ) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {

        if (userRepo.findByUsername(req.username()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        AppUser u = new AppUser();
        u.setUsername(req.username());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        userRepo.save(u);

        UserDetails userDetails = User.withUsername(u.getUsername())
                .password(u.getPasswordHash())
                .authorities("USER")
                .build();

        String token = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password())
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String token = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
