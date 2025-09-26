package com.library.service;

import com.library.entity.User;
import com.library.repository.UserRepository;
import com.library.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthContextService {

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUserOrThrow() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal up)) {
            throw new RuntimeException("Unauthenticated");
        }
        return userRepository.findByEmail(up.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
