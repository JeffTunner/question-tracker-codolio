package com.codolio.backend.service;

import com.codolio.backend.entity.Difficulty;
import com.codolio.backend.entity.Platform;
import com.codolio.backend.entity.Problem;
import com.codolio.backend.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {

    @Autowired
    ProblemRepository problemRepository;

    public Problem createProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    public Problem getProblemById(Long id) {
        return problemRepository.findById(id).orElseThrow(() -> new RuntimeException("Problem with id: " +id + "not found!"));
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Problem updateProblem(Long id, Problem updatedProblem) {
        Problem problem = getProblemById(id);
        problem.setName(updatedProblem.getName());
        problem.setExternalId(updatedProblem.getExternalId());
        problem.setPlatform(updatedProblem.getPlatform());
        problem.setSlug(updatedProblem.getSlug());
        problem.setDescription(updatedProblem.getDescription());
        problem.setDifficulty(updatedProblem.getDifficulty());
        problem.setProblemUrl(updatedProblem.getProblemUrl());
        problem.setVerified(updatedProblem.getVerified());
        problem.setTopics(updatedProblem.getTopics());
        problem.setCompanyTags(updatedProblem.getCompanyTags());
        problem.setSimilarQuestions(updatedProblem.getSimilarQuestions());
        return problemRepository.save(problem);
    }

    public void deleteProblem(Long id) {
        problemRepository.deleteById(id);
    }

    public List<Problem> searchProblems(String keyword) {
        return problemRepository.findByNameContainingIgnoreCase(keyword);
    }

    public List<Problem> getProblemsByPlatform(Platform platform) {
        return problemRepository.findByPlatform(platform);
    }

    public List<Problem> getProblemsByDifficulty(Difficulty difficulty) {
        return problemRepository.findByDifficulty(difficulty);
    }
}
