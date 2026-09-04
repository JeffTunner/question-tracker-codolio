package com.codolio.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private Long id;
    private String title;
    private String difficulty;
    private String link;
    private String resource;
    private Boolean solved;
    private Integer position;
    private Long topicId;
    private Long subTopicId;
    private Long problemId;
}
