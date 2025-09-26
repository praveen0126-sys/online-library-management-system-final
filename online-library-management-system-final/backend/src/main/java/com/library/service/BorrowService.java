package com.library.service;

import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.Reservation;
import com.library.entity.User;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowService {

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private BookService bookService;

    public BorrowRecord borrowBook(User user, Book book) {
        if (!bookService.isAvailable(book)) {
            throw new RuntimeException("Book is not available to borrow");
        }

        // Check if user already borrowed this book and not returned
        borrowRecordRepository.findByUserAndBookAndStatus(user, book, BorrowRecord.Status.BORROWED)
                .ifPresent(br -> { throw new RuntimeException("You already borrowed this book"); });

        // If there are reservations for this book, ensure the current user is at top or no reservations
        List<Reservation> queue = reservationRepository.findByBookAndStatusOrderByReservationDateAsc(book, Reservation.Status.ACTIVE);
        if (!queue.isEmpty() && !queue.get(0).getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Book is reserved by another user");
        }

        // If current user had active reservation, mark it fulfilled
        reservationRepository.findByUserAndBookAndStatus(user, book, Reservation.Status.ACTIVE)
                .ifPresent(res -> {
                    res.setStatus(Reservation.Status.FULFILLED);
                    reservationRepository.save(res);
                });

        // decrement availability and create record
        bookService.decrementAvailability(book);

        BorrowRecord record = new BorrowRecord(user, book, LocalDate.now(), BorrowRecord.Status.BORROWED);
        return borrowRecordRepository.save(record);
    }

    public BorrowRecord returnBook(User user, Book book) {
        BorrowRecord record = borrowRecordRepository
                .findByUserAndBookAndStatus(user, book, BorrowRecord.Status.BORROWED)
                .orElseThrow(() -> new RuntimeException("No active borrow record found"));

        record.setStatus(BorrowRecord.Status.RETURNED);
        record.setReturnDate(LocalDate.now());
        BorrowRecord saved = borrowRecordRepository.save(record);

        // increment availability
        bookService.incrementAvailability(book);

        return saved;
    }

    public List<BorrowRecord> history(User user) {
        return borrowRecordRepository.findByUserOrderByBorrowDateDesc(user);
    }

    public List<BorrowRecord> overdueRecords() {
        LocalDate overdueDate = LocalDate.now().minusDays(14);
        return borrowRecordRepository.findOverdueRecords(overdueDate);
    }
}
