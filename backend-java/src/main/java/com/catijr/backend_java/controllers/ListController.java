package com.catijr.backend_java.controllers;

import com.catijr.backend_java.dtos.ListCreateDTO;
import com.catijr.backend_java.models.TaskList;
import com.catijr.backend_java.services.TaskListService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/lists") 
@CrossOrigin(origins = "http://localhost:5173") 
public class ListController {

    @Autowired
    private TaskListService listService;

    // [POST] /lists
    @PostMapping
    public ResponseEntity<TaskList> createList(@Valid @RequestBody ListCreateDTO dto) {
        TaskList newList = listService.createList(dto);
        return new ResponseEntity<>(newList, HttpStatus.CREATED);
    }

    // [GET] /lists
    @GetMapping
    public ResponseEntity<List<TaskList>> getAllLists() {
        return ResponseEntity.ok(listService.getAllLists());
    }

    // [GET] /lists/:id
    @GetMapping("/{id}")
    public ResponseEntity<TaskList> getListById(@PathVariable Long id) {
        return ResponseEntity.ok(listService.getListById(id));
    }

    // [PUT] /lists/:id
    @PutMapping("/{id}")
    public ResponseEntity<TaskList> updateList(@PathVariable Long id, @Valid @RequestBody ListCreateDTO dto) {
        return ResponseEntity.ok(listService.updateList(id, dto));
    }

    // [DELETE] /lists/:id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable Long id) {
        listService.deleteList(id);
        return ResponseEntity.noContent().build(); 
    }
}
