package com.paulo.ticketsystem.repository;

import com.paulo.ticketsystem.model.Ticket;
import com.paulo.ticketsystem.model.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);

    Page<Ticket> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Ticket> findByStatusAndTitleContainingIgnoreCase(TicketStatus status, String title, Pageable pageable);
}
