package com.library.service;

import com.library.entity.User;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(String name, String email, String rawPassword, User.Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User(name, email, passwordEncoder.encode(rawPassword), role);
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User updated) {
        return userRepository.findById(id).map(u -> {
            u.setName(updated.getName());
            u.setEmail(updated.getEmail());
            if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
                u.setPassword(passwordEncoder.encode(updated.getPassword()));
            }
            u.setRole(updated.getRole());
            return userRepository.save(u);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
