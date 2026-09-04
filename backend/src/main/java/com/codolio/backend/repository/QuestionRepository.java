package com.codolio.backend.repository;

import com.codolio.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAllByOrderByDisplayOrderAsc();
    List<Question> findByTopicIdOrderByDisplayOrderAsc(Long topicId);
    List<Question> findBySubTopicIdOrderByDisplayOrderAsc(Long subTopicId);
    List<Question> findByTopicIdAndSubTopicIsNullOrderByDisplayOrderAsc(Long topicId);
}
