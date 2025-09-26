package com.library.service;

import com.library.entity.Book;
import com.library.entity.Reservation;
import com.library.entity.User;
import com.library.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    public Reservation reserve(User user, Book book) {
        // Prevent duplicate active reservation
        reservationRepository.findByUserAndBookAndStatus(user, book, Reservation.Status.ACTIVE)
                .ifPresent(r -> { throw new RuntimeException("You already have an active reservation for this book"); });

        Reservation reservation = new Reservation(user, book, LocalDate.now(), Reservation.Status.ACTIVE);
        return reservationRepository.save(reservation);
    }

    public void cancel(User user, Book book) {
        Reservation res = reservationRepository.findByUserAndBookAndStatus(user, book, Reservation.Status.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Active reservation not found"));
        res.setStatus(Reservation.Status.CANCELLED);
        reservationRepository.save(res);
    }

    public List<Reservation> list(User user) {
        return reservationRepository.findByUserOrderByReservationDateDesc(user);
    }
}
