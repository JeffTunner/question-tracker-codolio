package com.codolio.backend.service;

import com.codolio.backend.dto.SheetDto;
import com.codolio.backend.entity.Sheet;
import com.codolio.backend.repository.SheetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SheetService {

    @Autowired
    private SheetRepository sheetRepository;

    public List<SheetDto> getAllSheets() {
        return sheetRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public SheetDto getSheetById(Long id) {
        Sheet sheet = sheetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sheet with id " + id + " not found"));
        return toDto(sheet);
    }

    public Sheet getOrCreateDefaultSheet() {
        return sheetRepository.findAll().stream().findFirst().orElseGet(() -> {
            Sheet defaultSheet = Sheet.builder()
                    .name("Striver SDE Sheet")
                    .slug("striver-sde-sheet")
                    .description("Top coding interview questions from TakeUForward")
                    .visibility("public")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            return sheetRepository.save(defaultSheet);
        });
    }

    public SheetDto createSheet(SheetDto dto) {
        Sheet sheet = Sheet.builder()
                .name(dto.getName())
                .slug(dto.getSlug() != null ? dto.getSlug() : dto.getName().toLowerCase().replace(" ", "-"))
                .description(dto.getDescription())
                .link(dto.getLink())
                .banner(dto.getBanner())
                .visibility(dto.getVisibility() != null ? dto.getVisibility() : "public")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return toDto(sheetRepository.save(sheet));
    }

    public SheetDto toDto(Sheet sheet) {
        if (sheet == null) return null;
        return SheetDto.builder()
                .id(sheet.getId())
                .name(sheet.getName())
                .slug(sheet.getSlug())
                .description(sheet.getDescription())
                .link(sheet.getLink())
                .banner(sheet.getBanner())
                .visibility(sheet.getVisibility())
                .createdAt(sheet.getCreatedAt())
                .updatedAt(sheet.getUpdatedAt())
                .build();
    }
}
