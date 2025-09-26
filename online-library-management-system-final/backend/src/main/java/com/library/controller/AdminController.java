package com.library.controller;

import com.library.dto.AdminReportResponse;
import com.library.entity.BorrowRecord;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/reports")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminReportResponse> getReports() {
        // Basic statistics
        long totalBooks = bookRepository.count();
        long totalUsers = userRepository.count();
        long totalBorrowed = borrowRecordRepository.count();
        long totalReturned = 0; // We'll calculate this differently
        long overdueBooks = 0; // We'll calculate this differently
        
        // Calculate available books (simplified)
        long totalAvailable = totalBooks - totalBorrowed;

        // Most borrowed books
        List<Object[]> mostBorrowedBooks = borrowRecordRepository.findMostBorrowedBooks();

        AdminReportResponse response = new AdminReportResponse();
        response.setTotalBooks(totalBooks);
        response.setTotalUsers(totalUsers);
        response.setTotalBorrowed(totalBorrowed);
        response.setTotalReturned(totalReturned);
        response.setTotalAvailable(totalAvailable);
        response.setOverdueBooks(overdueBooks);
        response.setMostBorrowedBooks(mostBorrowedBooks);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Quick stats for dashboard cards
        stats.put("totalBooks", bookRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("activeBorrows", borrowRecordRepository.count());
        stats.put("overdueBooks", 0L);
        
        return ResponseEntity.ok(stats);
    }
}
