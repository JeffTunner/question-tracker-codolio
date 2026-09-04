package com.codolio.backend.repository;

import com.codolio.backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findAllByOrderByDisplayOrderAsc();
    List<Topic> findBySheetIdOrderByDisplayOrderAsc(Long sheetId);
    Optional<Topic> findByName(String name);
    Optional<Topic> findBySheetIdAndName(Long sheetId, String name);
}
