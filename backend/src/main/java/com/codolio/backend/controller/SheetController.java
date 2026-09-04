package com.codolio.backend.controller;

import com.codolio.backend.dto.SheetDto;
import com.codolio.backend.service.SheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sheets")
public class SheetController {

    @Autowired
    private SheetService sheetService;

    @GetMapping
    public ResponseEntity<List<SheetDto>> getAllSheets() {
        return ResponseEntity.ok(sheetService.getAllSheets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SheetDto> getSheetById(@PathVariable Long id) {
        return ResponseEntity.ok(sheetService.getSheetById(id));
    }

    @PostMapping
    public ResponseEntity<SheetDto> createSheet(@RequestBody SheetDto dto) {
        return ResponseEntity.ok(sheetService.createSheet(dto));
    }
}
