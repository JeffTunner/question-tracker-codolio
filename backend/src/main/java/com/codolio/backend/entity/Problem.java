package com.codolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problems")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Enumerated(EnumType.STRING)
    private Platform platform;

    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(length = 5000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private String problemUrl;

    private Boolean verified;

    @ElementCollection
    @CollectionTable(
            name = "problem_topics",
            joinColumns = @JoinColumn(name = "problem_id")
    )
    @Column(name = "topic")
    @Builder.Default
    private List<String> topics = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "problem_company_tags",
            joinColumns = @JoinColumn(name = "problem_id")
    )
    @Column(name = "company")
    @Builder.Default
    private List<String> companyTags = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "problem_similar_questions",
            joinColumns = @JoinColumn(name = "problem_id")
    )
    @Column(name = "similar_question_id")
    @Builder.Default
    private List<String> similarQuestions = new ArrayList<>();
}
