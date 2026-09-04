package com.codolio.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReorderItemDto {
    private Long id;
    private Integer position;
}
