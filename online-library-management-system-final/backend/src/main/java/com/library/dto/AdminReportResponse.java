package com.library.dto;

import java.util.List;

public class AdminReportResponse {
    private long totalBooks;
    private long totalUsers;
    private long totalBorrowed;
    private long totalReturned;
    private long totalAvailable;
    private long overdueBooks;
    private List<Object[]> mostBorrowedBooks;

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalBorrowed() {
        return totalBorrowed;
    }

    public void setTotalBorrowed(long totalBorrowed) {
        this.totalBorrowed = totalBorrowed;
    }

    public long getTotalReturned() {
        return totalReturned;
    }

    public void setTotalReturned(long totalReturned) {
        this.totalReturned = totalReturned;
    }

    public long getTotalAvailable() {
        return totalAvailable;
    }

    public void setTotalAvailable(long totalAvailable) {
        this.totalAvailable = totalAvailable;
    }

    public long getOverdueBooks() {
        return overdueBooks;
    }

    public void setOverdueBooks(long overdueBooks) {
        this.overdueBooks = overdueBooks;
    }

    public List<Object[]> getMostBorrowedBooks() {
        return mostBorrowedBooks;
    }

    public void setMostBorrowedBooks(List<Object[]> mostBorrowedBooks) {
        this.mostBorrowedBooks = mostBorrowedBooks;
    }
}
