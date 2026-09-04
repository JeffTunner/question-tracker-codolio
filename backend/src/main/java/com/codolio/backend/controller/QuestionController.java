package com.codolio.backend.controller;

import com.codolio.backend.dto.QuestionDto;
import com.codolio.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<QuestionDto>> getAllQuestions(
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) Long subTopicId) {
        if (subTopicId != null) {
            return ResponseEntity.ok(questionService.getQuestionsBySubTopic(subTopicId));
        }
        if (topicId != null) {
            return ResponseEntity.ok(questionService.getQuestionsByTopic(topicId));
        }
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping
    public ResponseEntity<QuestionDto> createQuestion(@RequestBody QuestionDto dto) {
        return ResponseEntity.ok(questionService.createQuestion(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(@PathVariable Long id, @RequestBody QuestionDto dto) {
        return ResponseEntity.ok(questionService.updateQuestion(id, dto));
    }

    @PatchMapping("/{id}/solved")
    public ResponseEntity<QuestionDto> toggleSolved(@PathVariable Long id, @RequestParam(required = false) Boolean solved) {
        return ResponseEntity.ok(questionService.toggleSolved(id, solved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<QuestionDto>> reorderQuestions(@RequestBody List<QuestionDto> questionList) {
        return ResponseEntity.ok(questionService.reorderQuestions(questionList));
    }
}
