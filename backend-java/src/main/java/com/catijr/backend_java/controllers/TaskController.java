package com.catijr.backend_java.controllers;

import com.catijr.backend_java.dtos.ReorderTasksDTO;
import com.catijr.backend_java.dtos.TaskCreateDTO;
import com.catijr.backend_java.dtos.TaskUpdateDTO;
import com.catijr.backend_java.models.Task;
import com.catijr.backend_java.services.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks") // Rota base para tarefas
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService taskService;

    //[POST] /tasks 
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskCreateDTO dto) {
        Task newTask = taskService.createTask(dto);
        return new ResponseEntity<>(newTask, HttpStatus.CREATED);
    }

    //[GET] /tasks/:id
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    //[PUT] /tasks/:id
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskUpdateDTO dto) {
        return ResponseEntity.ok(taskService.updateTask(id, dto));
    }

    //[DELETE] /tasks/:id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    //[POST] /reorder (uso do dnd)
    @PostMapping("/reorder")
    public ResponseEntity<Void> reorderTasks(@RequestBody ReorderTasksDTO dto) {
        taskService.reorderTasks(dto);
        return ResponseEntity.ok().build();
    }
}
