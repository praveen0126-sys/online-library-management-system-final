package com.library.controller;

import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.service.AuthContextService;
import com.library.service.BookService;
import com.library.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/borrow")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @Autowired
    private BookService bookService;

    @Autowired
    private AuthContextService authContextService;

    @PostMapping("/borrow/{bookId}")
    public ResponseEntity<BorrowRecord> borrow(@PathVariable Long bookId) {
        Book book = bookService.getById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
        var user = authContextService.getCurrentUserOrThrow();
        return ResponseEntity.ok(borrowService.borrowBook(user, book));
    }

    @PostMapping("/return/{bookId}")
    public ResponseEntity<BorrowRecord> returnBook(@PathVariable Long bookId) {
        Book book = bookService.getById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
        var user = authContextService.getCurrentUserOrThrow();
        return ResponseEntity.ok(borrowService.returnBook(user, book));
    }

    @GetMapping("/history")
    public ResponseEntity<List<BorrowRecord>> history() {
        var user = authContextService.getCurrentUserOrThrow();
        return ResponseEntity.ok(borrowService.history(user));
    }
}
