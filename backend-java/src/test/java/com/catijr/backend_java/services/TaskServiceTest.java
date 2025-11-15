package com.catijr.backend_java.services;

import com.catijr.backend_java.dtos.TaskCreateDTO;
import com.catijr.backend_java.dtos.TaskUpdateDTO;
import com.catijr.backend_java.models.Priority;
import com.catijr.backend_java.models.Task;
import com.catijr.backend_java.models.TaskList;
import com.catijr.backend_java.repositories.TaskListRepository;
import com.catijr.backend_java.repositories.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    
    @Mock
    private TaskListRepository taskListRepository; 

    @InjectMocks
    private TaskService taskService;

    private TaskList sampleList;
    private Task sampleTask;
    private TaskCreateDTO createDTO;

    @BeforeEach
    void setUp() {

        sampleList = new TaskList();
        sampleList.setId(1L);
        sampleList.setName("A Fazer");

        sampleTask = new Task();
        sampleTask.setId(100L);
        sampleTask.setName("Tarefa Antiga");
        sampleTask.setDescription("Desc Antiga");
        sampleTask.setPriority(Priority.LOW);
        sampleTask.setTaskList(sampleList); 

        createDTO = new TaskCreateDTO(
            "Tarefa Nova",
            "Desc Nova",
            Priority.HIGH,
            LocalDate.now().plusDays(5), 
            1L 
        );
    }

    @Test
    void testGetTaskById_Success() {
        when(taskRepository.findById(100L)).thenReturn(Optional.of(sampleTask));

        Task result = taskService.getTaskById(100L);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("Tarefa Antiga", result.getName());
    }


    @Test
    void testGetTaskById_NotFound() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            taskService.getTaskById(99L);
        });
    }

    @Test
    void testCreateTask_Success() {

        when(taskListRepository.findById(1L)).thenReturn(Optional.of(sampleList));
        
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task task = invocation.getArgument(0);
            task.setId(101L); 
            return task;
        });


        Task result = taskService.createTask(createDTO);

        assertNotNull(result);
        assertEquals(101L, result.getId()); 
        assertEquals("Tarefa Nova", result.getName());
        assertEquals(Priority.HIGH, result.getPriority());
        assertEquals(sampleList, result.getTaskList()); 
    }

    @Test
    void testCreateTask_ListNotFound() {

        TaskCreateDTO dtoComListaInvalida = new TaskCreateDTO("T", "D", Priority.LOW, null, 99L);

        when(taskListRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            taskService.createTask(dtoComListaInvalida);
        });
    
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void testUpdateTask_PartialUpdate() {

        TaskUpdateDTO updateDto = new TaskUpdateDTO(
            "Nome Atualizado", 
            null, 
            Priority.MEDIUM, 
            null, null, null, false, null
        );

        when(taskRepository.findById(100L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask); 

        Task result = taskService.updateTask(100L, updateDto);

        assertEquals("Nome Atualizado", result.getName()); 
        assertEquals(Priority.MEDIUM, result.getPriority()); 
        assertEquals("Desc Antiga", result.getDescription()); 
    }

    @Test
    void testDeleteTask_Success() {

        when(taskRepository.existsById(100L)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(100L); 

        taskService.deleteTask(100L);
        verify(taskRepository, times(1)).existsById(100L);
        verify(taskRepository, times(1)).deleteById(100L); 
    }
}
