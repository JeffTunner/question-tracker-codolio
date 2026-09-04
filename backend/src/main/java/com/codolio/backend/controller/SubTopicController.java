package com.codolio.backend.controller;

import com.codolio.backend.dto.SubTopicDto;
import com.codolio.backend.service.SubTopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtopics")
public class SubTopicController {

    @Autowired
    private SubTopicService subTopicService;

    @GetMapping
    public ResponseEntity<List<SubTopicDto>> getAllSubTopics(@RequestParam(required = false) Long topicId) {
        if (topicId != null) {
            return ResponseEntity.ok(subTopicService.getSubTopicsByTopic(topicId));
        }
        return ResponseEntity.ok(subTopicService.getAllSubTopics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubTopicDto> getSubTopicById(@PathVariable Long id) {
        return ResponseEntity.ok(subTopicService.getSubTopicById(id));
    }

    @PostMapping
    public ResponseEntity<SubTopicDto> createSubTopic(@RequestBody SubTopicDto dto) {
        return ResponseEntity.ok(subTopicService.createSubTopic(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubTopicDto> updateSubTopic(@PathVariable Long id, @RequestBody SubTopicDto dto) {
        return ResponseEntity.ok(subTopicService.updateSubTopic(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubTopic(@PathVariable Long id) {
        subTopicService.deleteSubTopic(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<SubTopicDto>> reorderSubTopics(@RequestBody List<SubTopicDto> subTopicList) {
        return ResponseEntity.ok(subTopicService.reorderSubTopics(subTopicList));
    }
}
