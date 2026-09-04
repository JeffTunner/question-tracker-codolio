package com.codolio.backend.repository;

import com.codolio.backend.entity.Difficulty;
import com.codolio.backend.entity.Platform;
import com.codolio.backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByNameContainingIgnoreCase(String keyword);

    List<Problem> findByPlatform(Platform platform);

    List<Problem> findByDifficulty(Difficulty difficulty);
}
