package com.library.controller;

import com.library.entity.Book;
import com.library.entity.Reservation;
import com.library.service.AuthContextService;
import com.library.service.BookService;
import com.library.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private BookService bookService;

    @Autowired
    private AuthContextService authContextService;

    @PostMapping("/reserve/{bookId}")
    public ResponseEntity<Reservation> reserve(@PathVariable Long bookId) {
        Book book = bookService.getById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
        var user = authContextService.getCurrentUserOrThrow();
        return ResponseEntity.ok(reservationService.reserve(user, book));
    }

    @PostMapping("/cancel/{bookId}")
    public ResponseEntity<Void> cancel(@PathVariable Long bookId) {
        Book book = bookService.getById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
        var user = authContextService.getCurrentUserOrThrow();
        reservationService.cancel(user, book);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> list() {
        var user = authContextService.getCurrentUserOrThrow();
        return ResponseEntity.ok(reservationService.list(user));
    }
}
