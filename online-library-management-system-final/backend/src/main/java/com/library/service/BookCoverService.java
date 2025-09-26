package com.library.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@Service
public class BookCoverService {
    
    private static final Logger logger = LoggerFactory.getLogger(BookCoverService.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    // Open Library API endpoints
    private static final String OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
    private static final String OPEN_LIBRARY_COVER_URL = "https://covers.openlibrary.org/b";
    
    public BookCoverService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Fetch book cover URL from Open Library API based on ISBN, title, or author
     */
    public Optional<String> fetchBookCover(String isbn, String title, String author) {
        try {
            // First try to get cover by ISBN if available
            if (isbn != null && !isbn.trim().isEmpty()) {
                Optional<String> coverByIsbn = fetchCoverByIsbn(isbn);
                if (coverByIsbn.isPresent()) {
                    return coverByIsbn;
                }
            }
            
            // If ISBN doesn't work, try by title and author
            return fetchCoverByTitleAndAuthor(title, author);
            
        } catch (Exception e) {
            logger.error("Error fetching book cover for ISBN: {}, Title: {}, Author: {}", 
                        isbn, title, author, e);
            return Optional.empty();
        }
    }
    
    /**
     * Fetch cover by ISBN
     */
    private Optional<String> fetchCoverByIsbn(String isbn) {
        try {
            String cleanIsbn = isbn.replaceAll("[^0-9X]", "");
            String coverUrl = OPEN_LIBRARY_COVER_URL + "/isbn/" + cleanIsbn + "-L.jpg";
            
            // Check if the cover exists by making a HEAD request
            if (checkImageExists(coverUrl)) {
                return Optional.of(coverUrl);
            }
            
        } catch (Exception e) {
            logger.warn("Failed to fetch cover by ISBN: {}", isbn, e);
        }
        return Optional.empty();
    }
    
    /**
     * Fetch cover by title and author using search API
     */
    private Optional<String> fetchCoverByTitleAndAuthor(String title, String author) {
        try {
            String searchQuery = title;
            if (author != null && !author.trim().isEmpty()) {
                searchQuery += " " + author;
            }
            
            String searchUrl = OPEN_LIBRARY_SEARCH_URL + "?q=" + 
                             java.net.URLEncoder.encode(searchQuery, "UTF-8") + "&limit=1";
            
            String response = restTemplate.getForObject(searchUrl, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            
            if (jsonNode.has("docs") && jsonNode.get("docs").size() > 0) {
                JsonNode firstBook = jsonNode.get("docs").get(0);
                
                // Try to get cover_i (cover ID)
                if (firstBook.has("cover_i")) {
                    long coverId = firstBook.get("cover_i").asLong();
                    String coverUrl = OPEN_LIBRARY_COVER_URL + "/id/" + coverId + "-L.jpg";
                    return Optional.of(coverUrl);
                }
                
                // Try to get ISBN from search result
                if (firstBook.has("isbn")) {
                    JsonNode isbnArray = firstBook.get("isbn");
                    if (isbnArray.isArray() && isbnArray.size() > 0) {
                        String isbn = isbnArray.get(0).asText();
                        return fetchCoverByIsbn(isbn);
                    }
                }
            }
            
        } catch (Exception e) {
            logger.warn("Failed to fetch cover by title and author: {} - {}", title, author, e);
        }
        return Optional.empty();
    }
    
    /**
     * Check if an image URL exists
     */
    private boolean checkImageExists(String imageUrl) {
        try {
            restTemplate.headForHeaders(imageUrl);
            return true;
        } catch (RestClientException e) {
            return false;
        }
    }
    
    /**
     * Get fallback placeholder image URL
     */
    public String getFallbackCoverUrl() {
        return "https://via.placeholder.com/300x400/e5e7eb/6b7280?text=No+Cover+Available";
    }
    
    /**
     * Get a themed placeholder based on category
     */
    public String getThemedPlaceholder(String category) {
        if (category == null) {
            return getFallbackCoverUrl();
        }
        
        String lowerCategory = category.toLowerCase();
        
        if (lowerCategory.contains("children")) {
            return "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop&auto=format&q=80";
        } else if (lowerCategory.contains("science")) {
            return "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop&auto=format&q=80";
        } else if (lowerCategory.contains("history")) {
            return "https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=300&h=400&fit=crop&auto=format&q=80";
        } else if (lowerCategory.contains("poetry")) {
            return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop&auto=format&q=80";
        } else if (lowerCategory.contains("philosophy")) {
            return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop&auto=format&q=80";
        } else if (lowerCategory.contains("fiction")) {
            return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80";
        } else if (lowerCategory.contains("biography")) {
            return "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=400&fit=crop&auto=format&q=80";
        } else {
            return "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&auto=format&q=80";
        }
    }
}
