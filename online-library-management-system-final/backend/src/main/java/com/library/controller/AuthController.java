package com.library.controller;

import com.library.dto.JwtResponse;
import com.library.dto.LoginRequest;
import com.library.dto.RegisterRequest;
import com.library.entity.User;
import com.library.security.JwtUtils;
import com.library.security.UserPrincipal;
import com.library.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        User created = userService.register(req.getName(), req.getEmail(), req.getPassword(), req.getRole());
        return ResponseEntity.ok(new JwtResponse("", created.getId(), created.getName(), created.getEmail(), created.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getName(), userDetails.getEmail(),
                User.Role.valueOf(userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""))));
    }
}
