package com.codolio.backend.repository;

import com.codolio.backend.entity.Sheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SheetRepository extends JpaRepository<Sheet, Long> {
    Optional<Sheet> findBySlug(String slug);
}
