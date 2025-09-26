package com.library.service;

import com.library.entity.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Book create(Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new RuntimeException("ISBN already exists");
        }
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        return bookRepository.save(book);
    }

    public Book update(Long id, Book updated) {
        return bookRepository.findById(id).map(b -> {
            b.setTitle(updated.getTitle());
            b.setAuthor(updated.getAuthor());
            b.setIsbn(updated.getIsbn());
            b.setCategory(updated.getCategory());
            b.setTotalCopies(updated.getTotalCopies());
            // Ensure availableCopies is not greater than totalCopies
            int available = updated.getAvailableCopies() != null ? updated.getAvailableCopies() : b.getAvailableCopies();
            b.setAvailableCopies(Math.min(available, updated.getTotalCopies()));
            return bookRepository.save(b);
        }).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public void delete(Long id) {
        bookRepository.deleteById(id);
    }

    public Optional<Book> getById(Long id) {
        return bookRepository.findById(id);
    }

    public List<Book> getAll() {
        return bookRepository.findAll();
    }

    public List<Book> search(String keyword) {
        return bookRepository.searchBooks(keyword);
    }

    public List<String> categories() {
        return bookRepository.findAllCategories();
    }

    public boolean isAvailable(Book book) {
        return book.getAvailableCopies() != null && book.getAvailableCopies() > 0;
    }

    public void decrementAvailability(Book book) {
        if (!isAvailable(book)) {
            throw new RuntimeException("No available copies");
        }
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);
    }

    public void incrementAvailability(Book book) {
        if (book.getAvailableCopies() < book.getTotalCopies()) {
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
        }
    }
}
