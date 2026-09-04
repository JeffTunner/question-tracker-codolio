package com.codolio.backend.repository;

import com.codolio.backend.entity.SubTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubTopicRepository extends JpaRepository<SubTopic, Long> {
    List<SubTopic> findAllByOrderByDisplayOrderAsc();
    List<SubTopic> findByTopicIdOrderByDisplayOrderAsc(Long topicId);
    Optional<SubTopic> findByTopicIdAndName(Long topicId, String name);
}
