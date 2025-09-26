package com.library.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "borrow_records")
public class BorrowRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    @NotNull(message = "Book is required")
    private Book book;

    @Column(nullable = false)
    private LocalDate borrowDate;

    @Column
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.BORROWED;

    @Column(name = "fine_amount", precision = 10, scale = 2)
    private BigDecimal fineAmount = BigDecimal.ZERO;

    @Column(name = "fine_paid", nullable = false)
    private Boolean finePaid = false;

    public enum Status {
        BORROWED, RETURNED, OVERDUE
    }

    // Constructors
    public BorrowRecord() {}

    public BorrowRecord(User user, Book book, LocalDate borrowDate, Status status) {
        this.user = user;
        this.book = book;
        this.borrowDate = borrowDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public LocalDate getBorrowDate() {
        return borrowDate;
    }

    public void setBorrowDate(LocalDate borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public BigDecimal getFineAmount() {
        return fineAmount;
    }

    public void setFineAmount(BigDecimal fineAmount) {
        this.fineAmount = fineAmount;
    }

    public Boolean getFinePaid() {
        return finePaid;
    }

    public void setFinePaid(Boolean finePaid) {
        this.finePaid = finePaid;
    }

    // Helper methods
    public boolean isOverdue() {
        if (status == Status.RETURNED) {
            return false;
        }
        LocalDate dueDate = borrowDate.plusDays(14); // 14 days borrowing period
        return LocalDate.now().isAfter(dueDate);
    }

    public LocalDate getDueDate() {
        return borrowDate.plusDays(14);
    }

    public long getDaysOverdue() {
        if (!isOverdue()) return 0;
        return LocalDate.now().toEpochDay() - getDueDate().toEpochDay();
    }

    public BigDecimal calculateFine() {
        if (!isOverdue()) return BigDecimal.ZERO;
        long daysOverdue = getDaysOverdue();
        // ₹5 per day fine
        return BigDecimal.valueOf(daysOverdue * 5);
    }

    public void updateFine() {
        this.fineAmount = calculateFine();
        if (isOverdue() && status != Status.RETURNED) {
            this.status = Status.OVERDUE;
        }
    }
}
