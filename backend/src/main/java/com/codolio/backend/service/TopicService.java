package com.codolio.backend.service;

import com.codolio.backend.dto.TopicDto;
import com.codolio.backend.entity.Sheet;
import com.codolio.backend.entity.Topic;
import com.codolio.backend.repository.SheetRepository;
import com.codolio.backend.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SheetRepository sheetRepository;

    @Autowired
    private SheetService sheetService;

    public List<TopicDto> getAllTopics() {
        return topicRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TopicDto getTopicById(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic with id " + id + " not found"));
        return toDto(topic);
    }

    public TopicDto createTopic(TopicDto dto) {
        Sheet sheet;
        if (dto.getSheetId() != null) {
            sheet = sheetRepository.findById(dto.getSheetId())
                    .orElseGet(() -> sheetService.getOrCreateDefaultSheet());
        } else {
            sheet = sheetService.getOrCreateDefaultSheet();
        }

        int position = dto.getPosition() != null ? dto.getPosition() : (int) topicRepository.count();

        Topic topic = Topic.builder()
                .name(dto.getName())
                .displayOrder(position)
                .sheet(sheet)
                .build();

        return toDto(topicRepository.save(topic));
    }

    public TopicDto updateTopic(Long id, TopicDto dto) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic with id " + id + " not found"));
        if (dto.getName() != null) {
            topic.setName(dto.getName());
        }
        if (dto.getPosition() != null) {
            topic.setDisplayOrder(dto.getPosition());
        }
        return toDto(topicRepository.save(topic));
    }

    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }

    @Transactional
    public List<TopicDto> reorderTopics(List<TopicDto> dtoList) {
        for (int i = 0; i < dtoList.size(); i++) {
            TopicDto dto = dtoList.get(i);
            if (dto.getId() != null) {
                int finalPos = dto.getPosition() != null ? dto.getPosition() : i;
                topicRepository.findById(dto.getId()).ifPresent(topic -> {
                    topic.setDisplayOrder(finalPos);
                    topicRepository.save(topic);
                });
            }
        }
        return getAllTopics();
    }

    public TopicDto toDto(Topic topic) {
        if (topic == null) return null;
        return TopicDto.builder()
                .id(topic.getId())
                .name(topic.getName())
                .position(topic.getDisplayOrder())
                .sheetId(topic.getSheet() != null ? topic.getSheet().getId() : null)
                .build();
    }
}
