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

    // --- Mocks ---
    @Mock
    private TaskRepository taskRepository;
    
    @Mock
    private TaskListRepository taskListRepository; // Precisamos dele para criar/atualizar tasks

    // --- Classe sob Teste ---
    @InjectMocks
    private TaskService taskService;

    // --- Dados de Exemplo ---
    private TaskList sampleList;
    private Task sampleTask;
    private TaskCreateDTO createDTO;

    @BeforeEach
    void setUp() {
        // Arruma uma lista pai
        sampleList = new TaskList();
        sampleList.setId(1L);
        sampleList.setName("A Fazer");

        // Arruma uma tarefa de exemplo
        sampleTask = new Task();
        sampleTask.setId(100L);
        sampleTask.setName("Tarefa Antiga");
        sampleTask.setDescription("Desc Antiga");
        sampleTask.setPriority(Priority.LOW);
        sampleTask.setTaskList(sampleList); // Associa à lista

        // Arruma um DTO para criar tarefa
        createDTO = new TaskCreateDTO(
            "Tarefa Nova",
            "Desc Nova",
            Priority.HIGH,
            LocalDate.now().plusDays(5), // Requisito: data futura
            1L // listId
        );
    }

    /**
     * Testa [GET] /tasks/:id - Sucesso
     */
    @Test
    void testGetTaskById_Success() {
        // Arrange
        when(taskRepository.findById(100L)).thenReturn(Optional.of(sampleTask));

        // Act
        Task result = taskService.getTaskById(100L);

        // Assert
        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("Tarefa Antiga", result.getName());
    }

    /**
     * Testa [GET] /tasks/:id - Não Encontrado
     */
    @Test
    void testGetTaskById_NotFound() {
        // Arrange
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            taskService.getTaskById(99L);
        });
    }

    /**
     * Testa [POST] /tasks - Sucesso
     */
    @Test
    void testCreateTask_Success() {
        // Arrange
        // 1. Finja que a lista-pai (ID 1L) foi encontrada
        when(taskListRepository.findById(1L)).thenReturn(Optional.of(sampleList));
        
        // 2. Finja o que o 'save' deve retornar
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task task = invocation.getArgument(0);
            task.setId(101L); // Simula o banco de dados dando um ID novo
            return task;
        });

        // Act
        Task result = taskService.createTask(createDTO);

        // Assert
        assertNotNull(result);
        assertEquals(101L, result.getId()); // ID novo
        assertEquals("Tarefa Nova", result.getName());
        assertEquals(Priority.HIGH, result.getPriority());
        assertEquals(sampleList, result.getTaskList()); // Verificou se associou à lista correta
    }

    /**
     * Testa [POST] /tasks - Lista Pai Não Encontrada
     */
    @Test
    void testCreateTask_ListNotFound() {
        // Arrange
        TaskCreateDTO dtoComListaInvalida = new TaskCreateDTO("T", "D", Priority.LOW, null, 99L);
        // Finja que a lista-pai (ID 99L) NÃO foi encontrada
        when(taskListRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            taskService.createTask(dtoComListaInvalida);
        });
        
        // Garante que a tarefa nunca foi salva
        verify(taskRepository, never()).save(any(Task.class));
    }

    /**
     * Testa [PUT] /tasks/:id - Atualização Parcial
     */
    @Test
    void testUpdateTask_PartialUpdate() {
        // Arrange
        // DTO só com nome e prioridade (description é null)
        TaskUpdateDTO updateDto = new TaskUpdateDTO(
            "Nome Atualizado", 
            null, // Description fica null
            Priority.MEDIUM, 
            null, null, null, 
            false
        );

        when(taskRepository.findById(100L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask); // Retorna a própria instância atualizada

        // Act
        Task result = taskService.updateTask(100L, updateDto);

        // Assert
        assertEquals("Nome Atualizado", result.getName()); // Foi atualizado
        assertEquals(Priority.MEDIUM, result.getPriority()); // Foi atualizado
        assertEquals("Desc Antiga", result.getDescription()); // NÃO foi atualizado (permaneceu o original)
    }

    /**
     * Testa [DELETE] /tasks/:id - Sucesso
     */
    @Test
    void testDeleteTask_Success() {
        // Arrange
        when(taskRepository.existsById(100L)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(100L); // deleteById é void

        // Act
        taskService.deleteTask(100L);

        // Assert
        verify(taskRepository, times(1)).existsById(100L);
        verify(taskRepository, times(1)).deleteById(100L); // Verifica se o 'delete' foi chamado
    }
}
