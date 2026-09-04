package com.codolio.backend.service;

import com.codolio.backend.dto.SubTopicDto;
import com.codolio.backend.entity.SubTopic;
import com.codolio.backend.entity.Topic;
import com.codolio.backend.repository.SubTopicRepository;
import com.codolio.backend.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubTopicService {

    @Autowired
    private SubTopicRepository subTopicRepository;

    @Autowired
    private TopicRepository topicRepository;

    public List<SubTopicDto> getAllSubTopics() {
        return subTopicRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<SubTopicDto> getSubTopicsByTopic(Long topicId) {
        return subTopicRepository.findByTopicIdOrderByDisplayOrderAsc(topicId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public SubTopicDto getSubTopicById(Long id) {
        SubTopic subTopic = subTopicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubTopic with id " + id + " not found"));
        return toDto(subTopic);
    }

    public SubTopicDto createSubTopic(SubTopicDto dto) {
        if (dto.getTopicId() == null) {
            throw new IllegalArgumentException("topicId must not be null when creating subtopic");
        }
        Topic topic = topicRepository.findById(dto.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic with id " + dto.getTopicId() + " not found"));

        int position = dto.getPosition() != null ? dto.getPosition() : subTopicRepository.findByTopicIdOrderByDisplayOrderAsc(dto.getTopicId()).size();

        SubTopic subTopic = SubTopic.builder()
                .name(dto.getName())
                .displayOrder(position)
                .topic(topic)
                .build();

        return toDto(subTopicRepository.save(subTopic));
    }

    public SubTopicDto updateSubTopic(Long id, SubTopicDto dto) {
        SubTopic subTopic = subTopicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubTopic with id " + id + " not found"));
        if (dto.getName() != null) {
            subTopic.setName(dto.getName());
        }
        if (dto.getPosition() != null) {
            subTopic.setDisplayOrder(dto.getPosition());
        }
        return toDto(subTopicRepository.save(subTopic));
    }

    public void deleteSubTopic(Long id) {
        subTopicRepository.deleteById(id);
    }

    @Transactional
    public List<SubTopicDto> reorderSubTopics(List<SubTopicDto> dtoList) {
        for (int i = 0; i < dtoList.size(); i++) {
            SubTopicDto dto = dtoList.get(i);
            if (dto.getId() != null) {
                int finalPos = dto.getPosition() != null ? dto.getPosition() : i;
                subTopicRepository.findById(dto.getId()).ifPresent(subTopic -> {
                    subTopic.setDisplayOrder(finalPos);
                    subTopicRepository.save(subTopic);
                });
            }
        }
        return getAllSubTopics();
    }

    public SubTopicDto toDto(SubTopic subTopic) {
        if (subTopic == null) return null;
        return SubTopicDto.builder()
                .id(subTopic.getId())
                .name(subTopic.getName())
                .position(subTopic.getDisplayOrder())
                .topicId(subTopic.getTopic() != null ? subTopic.getTopic().getId() : null)
                .build();
    }
}
