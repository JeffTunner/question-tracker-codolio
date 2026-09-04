package com.codolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "sheets")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 5000)
    private String description;

    private String link;

    private String banner;

    private String visibility;

    @OneToMany(
            mappedBy = "sheet",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<Topic> topics = new ArrayList<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
