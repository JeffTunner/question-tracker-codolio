package com.codolio.backend.controller;

import com.codolio.backend.dto.TopicDto;
import com.codolio.backend.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping
    public ResponseEntity<List<TopicDto>> getAllTopics() {
        return ResponseEntity.ok(topicService.getAllTopics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TopicDto> getTopicById(@PathVariable Long id) {
        return ResponseEntity.ok(topicService.getTopicById(id));
    }

    @PostMapping
    public ResponseEntity<TopicDto> createTopic(@RequestBody TopicDto dto) {
        return ResponseEntity.ok(topicService.createTopic(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TopicDto> updateTopic(@PathVariable Long id, @RequestBody TopicDto dto) {
        return ResponseEntity.ok(topicService.updateTopic(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<TopicDto>> reorderTopics(@RequestBody List<TopicDto> topicList) {
        return ResponseEntity.ok(topicService.reorderTopics(topicList));
    }
}
