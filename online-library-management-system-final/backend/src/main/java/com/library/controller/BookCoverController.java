package com.library.controller;

import com.library.entity.Book;
import com.library.repository.BookRepository;
import com.library.service.BookCoverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/admin/book-covers")
@PreAuthorize("hasRole('ADMIN')")
public class BookCoverController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookCoverService bookCoverService;

    private static final String UPLOAD_DIR = "uploads/covers/";

    /**
     * Upload a custom cover image for a book
     */
    @PostMapping("/upload/{bookId}")
    public ResponseEntity<?> uploadBookCover(@PathVariable Long bookId, 
                                           @RequestParam("file") MultipartFile file) {
        try {
            Optional<Book> bookOpt = bookRepository.findById(bookId);
            if (!bookOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Book book = bookOpt.get();

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("File must be an image");
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update book with new cover URL
            String coverUrl = "/uploads/covers/" + filename;
            book.setCoverImageUrl(coverUrl);
            bookRepository.save(book);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cover uploaded successfully");
            response.put("coverUrl", coverUrl);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Fetch cover automatically from Open Library API
     */
    @PostMapping("/fetch/{bookId}")
    public ResponseEntity<?> fetchBookCover(@PathVariable Long bookId) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (!bookOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Book book = bookOpt.get();
        
        Optional<String> coverUrl = bookCoverService.fetchBookCover(
            book.getIsbn(), book.getTitle(), book.getAuthor()
        );

        Map<String, Object> response = new HashMap<>();
        
        if (coverUrl.isPresent()) {
            book.setCoverImageUrl(coverUrl.get());
            bookRepository.save(book);
            
            response.put("message", "Cover fetched successfully");
            response.put("coverUrl", coverUrl.get());
            response.put("source", "Open Library API");
        } else {
            // Use themed placeholder
            String placeholderUrl = bookCoverService.getThemedPlaceholder(book.getCategory());
            book.setCoverImageUrl(placeholderUrl);
            bookRepository.save(book);
            
            response.put("message", "No cover found, using themed placeholder");
            response.put("coverUrl", placeholderUrl);
            response.put("source", "Themed Placeholder");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Update book cover URL manually
     */
    @PutMapping("/url/{bookId}")
    public ResponseEntity<?> updateBookCoverUrl(@PathVariable Long bookId, 
                                              @RequestBody Map<String, String> request) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (!bookOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Book book = bookOpt.get();
        String coverUrl = request.get("coverUrl");
        
        if (coverUrl == null || coverUrl.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Cover URL is required");
        }

        book.setCoverImageUrl(coverUrl);
        bookRepository.save(book);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cover URL updated successfully");
        response.put("coverUrl", coverUrl);

        return ResponseEntity.ok(response);
    }

    /**
     * Remove book cover (set to placeholder)
     */
    @DeleteMapping("/{bookId}")
    public ResponseEntity<?> removeBookCover(@PathVariable Long bookId) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (!bookOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Book book = bookOpt.get();
        String placeholderUrl = bookCoverService.getThemedPlaceholder(book.getCategory());
        
        book.setCoverImageUrl(placeholderUrl);
        bookRepository.save(book);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cover removed, using themed placeholder");
        response.put("coverUrl", placeholderUrl);

        return ResponseEntity.ok(response);
    }

    /**
     * Bulk fetch covers for all books without covers
     */
    @PostMapping("/fetch-all")
    public ResponseEntity<?> fetchAllMissingCovers() {
        // Find books with no cover or placeholder covers
        var books = bookRepository.findAll();
        int updated = 0;
        int failed = 0;

        for (Book book : books) {
            String currentCover = book.getCoverImageUrl();
            
            // Skip if book already has a non-placeholder cover
            if (currentCover != null && 
                !currentCover.contains("placeholder") && 
                !currentCover.contains("unsplash.com")) {
                continue;
            }

            Optional<String> coverUrl = bookCoverService.fetchBookCover(
                book.getIsbn(), book.getTitle(), book.getAuthor()
            );

            if (coverUrl.isPresent()) {
                book.setCoverImageUrl(coverUrl.get());
                bookRepository.save(book);
                updated++;
            } else {
                // Use themed placeholder
                String placeholderUrl = bookCoverService.getThemedPlaceholder(book.getCategory());
                book.setCoverImageUrl(placeholderUrl);
                bookRepository.save(book);
                failed++;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bulk cover fetch completed");
        response.put("updated", updated);
        response.put("failed", failed);
        response.put("total", books.size());

        return ResponseEntity.ok(response);
    }
}
