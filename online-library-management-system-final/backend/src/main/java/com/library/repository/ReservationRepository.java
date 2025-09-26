package com.library.repository;

import com.library.entity.Reservation;
import com.library.entity.User;
import com.library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserOrderByReservationDateDesc(User user);
    List<Reservation> findByBookOrderByReservationDateAsc(Book book);
    List<Reservation> findByStatus(Reservation.Status status);
    
    Optional<Reservation> findByUserAndBookAndStatus(User user, Book book, Reservation.Status status);
    
    List<Reservation> findByBookAndStatusOrderByReservationDateAsc(Book book, Reservation.Status status);
}
