package com.codolio.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubTopicDto {
    private Long id;
    private String name;
    private Integer position;
    private Long topicId;
}
