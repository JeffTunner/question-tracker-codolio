package com.codolio.backend.service;

import com.codolio.backend.entity.*;
import com.codolio.backend.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private SheetRepository sheetRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubTopicRepository subTopicRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (topicRepository.count() > 0) {
            log.info("Database already seeded with {} topics. Skipping seeder.", topicRepository.count());
            return;
        }

        log.info("Seeding sample data from data/sample-data.json...");
        try {
            ClassPathResource resource = new ClassPathResource("data/sample-data.json");
            if (!resource.exists()) {
                log.warn("sample-data.json not found in classpath.");
                return;
            }

            ObjectMapper mapper = new ObjectMapper();
            try (InputStream is = resource.getInputStream()) {
                JsonNode root = mapper.readTree(is);
                JsonNode dataNode = root.has("data") ? root.get("data") : root;
                JsonNode sheetNode = dataNode.get("sheet");

                // 1. Create Sheet
                Sheet sheet = Sheet.builder()
                        .name(sheetNode != null && sheetNode.has("name") ? sheetNode.get("name").asText() : "Striver SDE Sheet")
                        .slug(sheetNode != null && sheetNode.has("slug") ? sheetNode.get("slug").asText() : "striver-sde-sheet")
                        .description(sheetNode != null && sheetNode.has("description") ? sheetNode.get("description").asText() : "")
                        .link(sheetNode != null && sheetNode.has("link") ? sheetNode.get("link").asText() : "")
                        .banner(sheetNode != null && sheetNode.has("banner") ? sheetNode.get("banner").asText() : "")
                        .visibility(sheetNode != null && sheetNode.has("visibility") ? sheetNode.get("visibility").asText() : "public")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                sheet = sheetRepository.save(sheet);

                // 2. Create Topics from topicOrder or questions
                Map<String, Topic> topicMap = new LinkedHashMap<>();
                if (sheetNode != null && sheetNode.has("config") && sheetNode.get("config").has("topicOrder")) {
                    JsonNode topicOrder = sheetNode.get("config").get("topicOrder");
                    int order = 0;
                    for (JsonNode tNode : topicOrder) {
                        String topicName = tNode.asText().trim();
                        if (!topicName.isEmpty() && !topicMap.containsKey(topicName)) {
                            Topic topic = Topic.builder()
                                    .name(topicName)
                                    .displayOrder(order++)
                                    .sheet(sheet)
                                    .build();
                            topic = topicRepository.save(topic);
                            topicMap.put(topicName, topic);
                        }
                    }
                }

                // 3. Process Questions & SubTopics
                JsonNode questionsNode = dataNode.get("questions");
                if (questionsNode != null && questionsNode.isArray()) {
                    Map<String, SubTopic> subTopicMap = new HashMap<>();
                    int qDisplayOrder = 0;

                    for (JsonNode qNode : questionsNode) {
                        String topicName = qNode.has("topic") ? qNode.get("topic").asText() : "General";
                        Topic topic = topicMap.get(topicName);
                        if (topic == null) {
                            topic = Topic.builder()
                                    .name(topicName)
                                    .displayOrder(topicMap.size())
                                    .sheet(sheet)
                                    .build();
                            topic = topicRepository.save(topic);
                            topicMap.put(topicName, topic);
                        }

                        SubTopic subTopic = null;
                        if (qNode.hasNonNull("subTopic") && !qNode.get("subTopic").asText().trim().isEmpty()) {
                            String subTopicName = qNode.get("subTopic").asText().trim();
                            String subTopicKey = topic.getId() + "_" + subTopicName;
                            subTopic = subTopicMap.get(subTopicKey);
                            if (subTopic == null) {
                                subTopic = SubTopic.builder()
                                        .name(subTopicName)
                                        .displayOrder(subTopicMap.size())
                                        .topic(topic)
                                        .build();
                                subTopic = subTopicRepository.save(subTopic);
                                subTopicMap.put(subTopicKey, subTopic);
                            }
                        }

                        // Problem metadata
                        JsonNode probNode = qNode.get("questionId");
                        Problem problem = null;
                        if (probNode != null && probNode.isObject()) {
                            String diffStr = probNode.has("difficulty") ? probNode.get("difficulty").asText() : "Medium";
                            Difficulty difficulty = Difficulty.MEDIUM;
                            if (diffStr.equalsIgnoreCase("Easy")) difficulty = Difficulty.EASY;
                            else if (diffStr.equalsIgnoreCase("Hard")) difficulty = Difficulty.HARD;

                            String platformStr = probNode.has("platform") ? probNode.get("platform").asText() : "LEETCODE";
                            Platform platform = Platform.LEETCODE;
                            if (platformStr.equalsIgnoreCase("gfg")) platform = Platform.GFG;
                            else if (platformStr.equalsIgnoreCase("interviewbit")) platform = Platform.INTERVIEWBIT;
                            else if (platformStr.equalsIgnoreCase("hackerrank")) platform = Platform.HACKERRANK;
                            else if (platformStr.equalsIgnoreCase("codechef")) platform = Platform.CODECHEF;
                            else if (platformStr.equalsIgnoreCase("codeforces")) platform = Platform.CODEFORCES;
                            else if (platformStr.equalsIgnoreCase("tuf")) platform = Platform.TUF;
                            else if (platformStr.equalsIgnoreCase("spoj")) platform = Platform.SPOJ;
                            else if (platformStr.equalsIgnoreCase("leetcode")) platform = Platform.LEETCODE;
                            else platform = Platform.OTHER;

                            problem = Problem.builder()
                                    .name(probNode.has("name") ? probNode.get("name").asText() : qNode.get("title").asText())
                                    .externalId(probNode.has("id") ? probNode.get("id").asText() : null)
                                    .platform(platform)
                                    .slug(probNode.has("slug") ? probNode.get("slug").asText() : null)
                                    .difficulty(difficulty)
                                    .problemUrl(probNode.has("problemUrl") ? probNode.get("problemUrl").asText() : null)
                                    .verified(probNode.has("verified") && probNode.get("verified").asBoolean())
                                    .build();
                            problem = problemRepository.save(problem);
                        }

                        boolean isSolved = qNode.has("isSolved") && qNode.get("isSolved").asBoolean();
                        String title = qNode.has("title") ? qNode.get("title").asText() : (problem != null ? problem.getName() : "Untitled");
                        String resourceUrl = qNode.has("resource") ? qNode.get("resource").asText() : null;

                        Question question = Question.builder()
                                .title(title)
                                .resource(resourceUrl)
                                .solved(isSolved)
                                .displayOrder(qDisplayOrder++)
                                .topic(topic)
                                .subTopic(subTopic)
                                .problem(problem)
                                .build();
                        questionRepository.save(question);
                    }
                }

                log.info("Successfully seeded database! Topics: {}, Questions: {}", topicRepository.count(), questionRepository.count());
            }
        } catch (Exception e) {
            log.error("Failed to seed initial data: {}", e.getMessage(), e);
        }
    }
}
