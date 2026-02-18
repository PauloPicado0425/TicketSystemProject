package com.paulo.ticketsystem.mapper;

import com.paulo.ticketsystem.dto.TicketCreateRequest;
import com.paulo.ticketsystem.dto.TicketResponse;
import com.paulo.ticketsystem.dto.TicketUpdateRequest;
import com.paulo.ticketsystem.model.Ticket;
import com.paulo.ticketsystem.model.TicketStatus;
import org.springframework.stereotype.Component;


@Component
public class TicketMapper {
    
    private TicketMapper(){}
    
    public Ticket toEntity(TicketCreateRequest req){
        Ticket t = new Ticket();
        t.setTitle(req.getTitle());
        t.setDescription(req.getDescription());
        t.setStatus(TicketStatus.OPEN);
        return t; 
    }
    
    public static void applyUpdate(Ticket ticket, TicketUpdateRequest req){ 
        ticket.setTitle(req.getTitle());
        ticket.setDescription(req.getDescription());

        if (req.getStatus() != null) {
            ticket.setStatus(req.getStatus());
        }
        
        
    }
    
    public TicketResponse toResponse(Ticket ticket){
        return new TicketResponse(
            ticket.getId(),
            ticket.getTitle(),
            ticket.getDescription(),
            ticket.getStatus(),
            ticket.getCreatedAt()
        );
    }
    
}
