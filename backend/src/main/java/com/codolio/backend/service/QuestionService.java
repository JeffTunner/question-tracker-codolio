package com.codolio.backend.service;

import com.codolio.backend.dto.QuestionDto;
import com.codolio.backend.entity.*;
import com.codolio.backend.repository.ProblemRepository;
import com.codolio.backend.repository.QuestionRepository;
import com.codolio.backend.repository.SubTopicRepository;
import com.codolio.backend.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubTopicRepository subTopicRepository;

    @Autowired
    private ProblemRepository problemRepository;

    public List<QuestionDto> getAllQuestions() {
        return questionRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<QuestionDto> getQuestionsByTopic(Long topicId) {
        return questionRepository.findByTopicIdOrderByDisplayOrderAsc(topicId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<QuestionDto> getQuestionsBySubTopic(Long subTopicId) {
        return questionRepository.findBySubTopicIdOrderByDisplayOrderAsc(subTopicId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public QuestionDto getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question with id " + id + " not found"));
        return toDto(question);
    }

    @Transactional
    public QuestionDto createQuestion(QuestionDto dto) {
        if (dto.getTopicId() == null) {
            throw new IllegalArgumentException("topicId must not be null when creating question");
        }

        Topic topic = topicRepository.findById(dto.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic with id " + dto.getTopicId() + " not found"));

        SubTopic subTopic = null;
        if (dto.getSubTopicId() != null) {
            subTopic = subTopicRepository.findById(dto.getSubTopicId()).orElse(null);
        }

        Problem problem = null;
        if (dto.getProblemId() != null) {
            problem = problemRepository.findById(dto.getProblemId()).orElse(null);
        } else if (dto.getTitle() != null || dto.getLink() != null) {
            Difficulty difficulty = parseDifficulty(dto.getDifficulty());
            problem = Problem.builder()
                    .name(dto.getTitle() != null ? dto.getTitle() : "Untitled Problem")
                    .difficulty(difficulty)
                    .problemUrl(dto.getLink())
                    .platform(Platform.LEETCODE)
                    .build();
            problem = problemRepository.save(problem);
        }

        int position = dto.getPosition() != null ? dto.getPosition() : (int) questionRepository.count();

        Question question = Question.builder()
                .title(dto.getTitle() != null ? dto.getTitle() : (problem != null ? problem.getName() : "Untitled Question"))
                .resource(dto.getResource() != null ? dto.getResource() : (dto.getLink() != null ? dto.getLink() : null))
                .solved(dto.getSolved() != null ? dto.getSolved() : false)
                .displayOrder(position)
                .topic(topic)
                .subTopic(subTopic)
                .problem(problem)
                .build();

        return toDto(questionRepository.save(question));
    }

    @Transactional
    public QuestionDto updateQuestion(Long id, QuestionDto dto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question with id " + id + " not found"));

        if (dto.getTitle() != null) {
            question.setTitle(dto.getTitle());
        }
        if (dto.getSolved() != null) {
            question.setSolved(dto.getSolved());
        }
        if (dto.getPosition() != null) {
            question.setDisplayOrder(dto.getPosition());
        }
        if (dto.getResource() != null) {
            question.setResource(dto.getResource());
        }
        if (dto.getTopicId() != null && (question.getTopic() == null || !question.getTopic().getId().equals(dto.getTopicId()))) {
            topicRepository.findById(dto.getTopicId()).ifPresent(question::setTopic);
        }
        if (dto.getSubTopicId() != null) {
            subTopicRepository.findById(dto.getSubTopicId()).ifPresent(question::setSubTopic);
        } else if (dto.getSubTopicId() == null && dto.getTopicId() != null) {
            question.setSubTopic(null);
        }

        // Update problem or create if difficulty / link changed
        if (dto.getDifficulty() != null || dto.getLink() != null) {
            Problem problem = question.getProblem();
            if (problem == null) {
                problem = Problem.builder()
                        .name(question.getTitle())
                        .difficulty(parseDifficulty(dto.getDifficulty()))
                        .problemUrl(dto.getLink())
                        .platform(Platform.LEETCODE)
                        .build();
            } else {
                if (dto.getDifficulty() != null) {
                    problem.setDifficulty(parseDifficulty(dto.getDifficulty()));
                }
                if (dto.getLink() != null) {
                    problem.setProblemUrl(dto.getLink());
                }
                if (dto.getTitle() != null) {
                    problem.setName(dto.getTitle());
                }
            }
            question.setProblem(problemRepository.save(problem));
        }

        return toDto(questionRepository.save(question));
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public QuestionDto toggleSolved(Long id, Boolean solved) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question with id " + id + " not found"));
        question.setSolved(solved != null ? solved : !question.getSolved());
        return toDto(questionRepository.save(question));
    }

    @Transactional
    public List<QuestionDto> reorderQuestions(List<QuestionDto> dtoList) {
        for (int i = 0; i < dtoList.size(); i++) {
            QuestionDto dto = dtoList.get(i);
            if (dto.getId() != null) {
                int finalPos = dto.getPosition() != null ? dto.getPosition() : i;
                questionRepository.findById(dto.getId()).ifPresent(question -> {
                    question.setDisplayOrder(finalPos);
                    questionRepository.save(question);
                });
            }
        }
        return getAllQuestions();
    }

    public QuestionDto toDto(Question question) {
        if (question == null) return null;

        String difficultyStr = "Medium";
        String link = question.getResource();

        if (question.getProblem() != null) {
            if (question.getProblem().getDifficulty() != null) {
                difficultyStr = formatDifficulty(question.getProblem().getDifficulty());
            }
            if (question.getProblem().getProblemUrl() != null && !question.getProblem().getProblemUrl().isEmpty()) {
                link = question.getProblem().getProblemUrl();
            }
        }

        return QuestionDto.builder()
                .id(question.getId())
                .title(question.getTitle())
                .difficulty(difficultyStr)
                .link(link)
                .resource(question.getResource())
                .solved(question.getSolved())
                .position(question.getDisplayOrder())
                .topicId(question.getTopic() != null ? question.getTopic().getId() : null)
                .subTopicId(question.getSubTopic() != null ? question.getSubTopic().getId() : null)
                .problemId(question.getProblem() != null ? question.getProblem().getId() : null)
                .build();
    }

    private Difficulty parseDifficulty(String diff) {
        if (diff == null) return Difficulty.MEDIUM;
        String clean = diff.trim().toUpperCase();
        if (clean.contains("EASY")) return Difficulty.EASY;
        if (clean.contains("HARD")) return Difficulty.HARD;
        return Difficulty.MEDIUM;
    }

    private String formatDifficulty(Difficulty diff) {
        if (diff == null) return "Medium";
        return switch (diff) {
            case EASY -> "Easy";
            case MEDIUM -> "Medium";
            case HARD -> "Hard";
        };
    }
}
