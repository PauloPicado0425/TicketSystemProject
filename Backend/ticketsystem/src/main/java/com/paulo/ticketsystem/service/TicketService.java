
package com.paulo.ticketsystem.service;

import com.paulo.ticketsystem.dto.TicketCreateRequest;
import com.paulo.ticketsystem.dto.TicketResponse;
import com.paulo.ticketsystem.dto.TicketUpdateRequest;
import com.paulo.ticketsystem.mapper.TicketMapper;
import com.paulo.ticketsystem.model.Ticket;
import com.paulo.ticketsystem.model.TicketStatus;
import com.paulo.ticketsystem.repository.TicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TicketService {
    
    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    public TicketService(TicketRepository ticketRepository, TicketMapper ticketMapper) {
        this.ticketRepository = ticketRepository;
        this.ticketMapper = ticketMapper;
    }

    private Ticket findTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Ticket NOT FOUND with id {}", id);
                    return new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Ticket not found with id: " + id
                    );
                });
    }

    public Page<TicketResponse> getTickets(Pageable pageable, TicketStatus status, String title) {

        boolean hasStatus = (status != null);
        boolean hasTitle = StringUtils.hasText(title);

        logger.info("Listing tickets | page={} size={} status={} title={}",
                pageable.getPageNumber(),
                pageable.getPageSize(),
                status,
                title
        );

        Page<Ticket> page;

        if (hasStatus && hasTitle) {
            page = ticketRepository.findByStatusAndTitleContainingIgnoreCase(status, title, pageable);
        } else if (hasStatus) {
            page = ticketRepository.findByStatus(status, pageable);
        } else if (hasTitle) {
            page = ticketRepository.findByTitleContainingIgnoreCase(title, pageable);
        } else {
            page = ticketRepository.findAll(pageable);
        }

        return page.map(ticketMapper::toResponse);
    }

    public TicketResponse getTicketById(Long id) {
        logger.info("Fetching ticket by id {}", id);
        return ticketMapper.toResponse(findTicketOrThrow(id));
    }

    public TicketResponse createTicket(TicketCreateRequest req) {
        logger.info("Creating ticket | title='{}'", req.getTitle());

        Ticket t = ticketMapper.toEntity(req);
        Ticket saved = ticketRepository.save(t);

        logger.info("Ticket created successfully | id={}", saved.getId());
        return ticketMapper.toResponse(saved);
    }

    public TicketResponse updateTicket(Long id, TicketUpdateRequest req) {
        logger.info("Updating ticket | id={}", id);

        Ticket t = findTicketOrThrow(id);
        ticketMapper.applyUpdate(t, req);
        Ticket saved = ticketRepository.save(t);

        logger.info("Ticket updated successfully | id={}", saved.getId());
        return ticketMapper.toResponse(saved);
    }

    public void deleteTicket(Long id) {
        logger.warn("Deleting ticket | id={}", id);

        Ticket t = findTicketOrThrow(id);
        ticketRepository.delete(t);

        logger.warn("Ticket deleted | id={}", id);
    }
}
