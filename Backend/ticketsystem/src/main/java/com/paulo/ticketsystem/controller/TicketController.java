package com.paulo.ticketsystem.controller;

import com.paulo.ticketsystem.dto.TicketCreateRequest;
import com.paulo.ticketsystem.dto.TicketResponse;
import com.paulo.ticketsystem.dto.TicketUpdateRequest;
import com.paulo.ticketsystem.model.TicketStatus;
import com.paulo.ticketsystem.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Tickets", description = "Endpoints para gestión de tickets (CRUD + filtros + paginación)")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @Operation(summary = "Listar tickets", description = "Devuelve tickets con paginación. Permite filtrar por status y por texto en title.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    })
    @GetMapping
    public Page<TicketResponse> getAllTickets(
            @ParameterObject
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable,

            @Parameter(description = "Filtrar por estado del ticket (OPEN, IN_PROGRESS, CLOSED)")
            @RequestParam(required = false) TicketStatus status,

            @Parameter(description = "Filtrar por texto contenido en el título (no sensible a mayúsculas)")
            @RequestParam(required = false) String title
    ) {
        return ticketService.getTickets(pageable, status, title);
    }

    @Operation(summary = "Obtener ticket por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ticket encontrado"),
            @ApiResponse(responseCode = "404", description = "Ticket no encontrado")
    })
    @GetMapping("/{id}")
    public TicketResponse getTicketById(
            @Parameter(description = "ID del ticket") @PathVariable Long id
    ) {
        return ticketService.getTicketById(id);
    }

    @Operation(summary = "Crear ticket")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Ticket creado"),
            @ApiResponse(responseCode = "400", description = "Validación fallida")
    })
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketCreateRequest req) {
        return ResponseEntity.status(201).body(ticketService.createTicket(req));
    }

    @Operation(summary = "Actualizar ticket")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ticket actualizado"),
            @ApiResponse(responseCode = "400", description = "Validación fallida"),
            @ApiResponse(responseCode = "404", description = "Ticket no encontrado")
    })
    @PutMapping("/{id}")
    public TicketResponse updateTicket(
            @Parameter(description = "ID del ticket") @PathVariable Long id,
            @Valid @RequestBody TicketUpdateRequest req
    ) {
        return ticketService.updateTicket(id, req);
    }

    @Operation(summary = "Eliminar ticket")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Ticket eliminado"),
            @ApiResponse(responseCode = "404", description = "Ticket no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @Parameter(description = "ID del ticket") @PathVariable Long id
    ) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
    
}