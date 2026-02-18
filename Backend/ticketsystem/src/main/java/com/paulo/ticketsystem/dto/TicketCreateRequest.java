package com.paulo.ticketsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
        
public class TicketCreateRequest {
    
    @NotBlank(message = "Title is requiered") 
    @Size(max = 255, message = "Title must be at most 255 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;
    
    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title; }
    
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
}
