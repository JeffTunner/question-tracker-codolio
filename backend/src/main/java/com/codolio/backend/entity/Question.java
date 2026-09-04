package com.codolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String resource;

    @Builder.Default
    @Column(nullable = false)
    private Boolean solved = false;

    @Column(nullable = false)
    private Integer displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_topic_id")
    private SubTopic subTopic;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(name = "problem_id")
    private Problem problem;
}
