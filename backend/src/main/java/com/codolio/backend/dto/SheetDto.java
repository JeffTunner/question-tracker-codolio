package com.codolio.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SheetDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String link;
    private String banner;
    private String visibility;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
