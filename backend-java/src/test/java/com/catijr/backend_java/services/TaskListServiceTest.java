package com.catijr.backend_java.services;

import com.catijr.backend_java.dtos.ListCreateDTO;
import com.catijr.backend_java.models.TaskList;
import com.catijr.backend_java.repositories.TaskListRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class TaskListServiceTest {

    @Mock
    private TaskListRepository listRepository;

    @InjectMocks
    private TaskListService taskListService;

    private TaskList sampleList;
    private ListCreateDTO createDTO;

    @BeforeEach
    void setUp() {
        sampleList = new TaskList();
        sampleList.setId(1L);
        sampleList.setName("A Fazer");
        sampleList.setTasks(Collections.emptyList());

        createDTO = new ListCreateDTO("A Fazer");
    }

    @Test
    void testGetAllLists() {

        when(listRepository.findAll()).thenReturn(List.of(sampleList));

        List<TaskList> result = taskListService.getAllLists();

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("A Fazer", result.get(0).getName());
    }

    @Test
    void testGetListById_Success() {

        when(listRepository.findById(1L)).thenReturn(Optional.of(sampleList));

        TaskList result = taskListService.getListById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("A Fazer", result.getName());
    }

    @Test
    void testGetListById_NotFound() {
        when(listRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            taskListService.getListById(99L);
        }, "Deveria lançar exceção se a lista não for encontrada");
    }

    @Test
    void testCreateList_Success() {

        ListCreateDTO newDto = new ListCreateDTO("Nova Lista");
        TaskList savedList = new TaskList();
        savedList.setId(2L);
        savedList.setName("Nova Lista");
        
        when(listRepository.existsByName("Nova Lista")).thenReturn(false);
        when(listRepository.save(any(TaskList.class))).thenReturn(savedList);

        TaskList result = taskListService.createList(newDto);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Nova Lista", result.getName());
        verify(listRepository, times(1)).save(any(TaskList.class));
    }

    @Test
    void testCreateList_DuplicateName() {
        when(listRepository.existsByName("A Fazer")).thenReturn(true);
        
        assertThrows(RuntimeException.class, () -> {
            taskListService.createList(createDTO); 
        }, "Deveria lançar exceção se o nome for duplicado");

        verify(listRepository, never()).save(any(TaskList.class));
    }

    @Test
    void testUpdateList_Success() {
        ListCreateDTO updateDto = new ListCreateDTO("Lista Atualizada");
        when(listRepository.findById(1L)).thenReturn(Optional.of(sampleList));
        when(listRepository.existsByName("Lista Atualizada")).thenReturn(false);
        
        when(listRepository.save(any(TaskList.class))).thenAnswer(invocation -> {
            TaskList list = invocation.getArgument(0);
            list.setName("Lista Atualizada"); 
            return list;
        });

        TaskList result = taskListService.updateList(1L, updateDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Lista Atualizada", result.getName());
    }

    @Test
    void testDeleteList_Success() {
        when(listRepository.findById(1L)).thenReturn(Optional.of(sampleList));
        doNothing().when(listRepository).delete(sampleList);

        taskListService.deleteList(1L);

        verify(listRepository, times(1)).delete(sampleList);
    }
}