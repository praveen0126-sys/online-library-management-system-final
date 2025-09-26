package com.library.repository;

import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUserOrderByBorrowDateDesc(User user);
    List<BorrowRecord> findByBookOrderByBorrowDateDesc(Book book);
    List<BorrowRecord> findByStatus(BorrowRecord.Status status);
    
    Optional<BorrowRecord> findByUserAndBookAndStatus(User user, Book book, BorrowRecord.Status status);
    
    @Query("SELECT br FROM BorrowRecord br WHERE br.status = 'BORROWED' AND br.borrowDate <= :overdueDate")
    List<BorrowRecord> findOverdueRecords(@Param("overdueDate") LocalDate overdueDate);
    
    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.status = 'BORROWED'")
    Long countBorrowedBooks();
    
    @Query("SELECT br.book.title, COUNT(br) as borrowCount FROM BorrowRecord br " +
           "GROUP BY br.book.id, br.book.title ORDER BY borrowCount DESC")
    List<Object[]> findMostBorrowedBooks();
    
    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.user = :user AND br.status = 'BORROWED'")
    Long countActiveBooksByUser(@Param("user") User user);
}
