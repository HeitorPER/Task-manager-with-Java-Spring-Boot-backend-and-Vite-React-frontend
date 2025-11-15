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

// 1. Diz ao JUnit para usar a extensão do Mockito
@ExtendWith(MockitoExtension.class)
class TaskListServiceTest {

    // 2. Crie um "Mock" (Falso) do repositório.
    @Mock
    private TaskListRepository listRepository;

    // 3. Crie uma instância REAL do service, e injete os Mocks (listRepository) nele.
    @InjectMocks
    private TaskListService taskListService;

    // --- Variáveis de Teste ---
    private TaskList sampleList;
    private ListCreateDTO createDTO;

    // 4. (Opcional) Este método roda ANTES de cada @Test
    @BeforeEach
    void setUp() {
        // "Arruma" uma lista de exemplo
        sampleList = new TaskList();
        sampleList.setId(1L);
        sampleList.setName("A Fazer");
        sampleList.setTasks(Collections.emptyList()); // Lista vazia

        // "Arruma" um DTO de exemplo
        createDTO = new ListCreateDTO("A Fazer");
    }

    // --- Testando o CRUD ---

    /**
     * Testa [GET] /lists
     */
    @Test
    void testGetAllLists() {
        // Arrange (Arrumar)
        when(listRepository.findAll()).thenReturn(List.of(sampleList));

        // Act (Agir)
        List<TaskList> result = taskListService.getAllLists();

        // Assert (Afirmar)
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("A Fazer", result.get(0).getName());
    }

    /**
     * Testa [GET] /lists/:id - Sucesso
     */
    @Test
    void testGetListById_Success() {
        // Arrange
        when(listRepository.findById(1L)).thenReturn(Optional.of(sampleList));

        // Act
        TaskList result = taskListService.getListById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("A Fazer", result.getName());
    }

    /**
     * Testa [GET] /lists/:id - Não Encontrado
     */
    @Test
    void testGetListById_NotFound() {
        // Arrange
        when(listRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        // Afirma que uma RuntimeException será lançada
        assertThrows(RuntimeException.class, () -> {
            taskListService.getListById(99L);
        }, "Deveria lançar exceção se a lista não for encontrada");
    }

    /**
     * Testa [POST] /lists - Sucesso
     */
    @Test
    void testCreateList_Success() {
        // Arrange
        ListCreateDTO newDto = new ListCreateDTO("Nova Lista");
        TaskList savedList = new TaskList();
        savedList.setId(2L);
        savedList.setName("Nova Lista");
        
        when(listRepository.existsByName("Nova Lista")).thenReturn(false);
        when(listRepository.save(any(TaskList.class))).thenReturn(savedList);

        // Act
        TaskList result = taskListService.createList(newDto);

        // Assert
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Nova Lista", result.getName());
        verify(listRepository, times(1)).save(any(TaskList.class)); // Verifica se o save foi chamado
    }

    /**
     * Testa [POST] /lists - Nome Duplicado (Requisito de negócio)
     */
    @Test
    void testCreateList_DuplicateName() {
        // Arrange
        when(listRepository.existsByName("A Fazer")).thenReturn(true);
        
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            taskListService.createList(createDTO); // Tenta criar com o nome "A Fazer"
        }, "Deveria lançar exceção se o nome for duplicado");

        // (Opcional) Verifique se o repository.save NUNCA foi chamado
        verify(listRepository, never()).save(any(TaskList.class));
    }

    /**
     * Testa [PUT] /lists/:id - Sucesso
     */
    @Test
    void testUpdateList_Success() {
        // Arrange
        ListCreateDTO updateDto = new ListCreateDTO("Lista Atualizada");
        // O findById(1L) retorna a lista original ("A Fazer")
        when(listRepository.findById(1L)).thenReturn(Optional.of(sampleList));
        // O existsByName verifica o novo nome ("Lista Atualizada") e retorna falso
        when(listRepository.existsByName("Lista Atualizada")).thenReturn(false);
        
        // Quando salvar, apenas atualize o nome no objeto 'sampleList'
        when(listRepository.save(any(TaskList.class))).thenAnswer(invocation -> {
            TaskList list = invocation.getArgument(0);
            list.setName("Lista Atualizada"); // Simula a atualização
            return list;
        });

        // Act
        TaskList result = taskListService.updateList(1L, updateDto);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Lista Atualizada", result.getName());
    }

    /**
     * Testa [DELETE] /lists/:id - Sucesso (Lista Vazia)
     */
    @Test
    void testDeleteList_Success() {
        // Arrange
        // (sampleList do setUp está com tasks vazias, como manda o requisito)
        when(listRepository.findById(1L)).thenReturn(Optional.of(sampleList));
        doNothing().when(listRepository).delete(sampleList);

        // Act
        taskListService.deleteList(1L);

        // Assert
        // Verifique se o método listRepository.delete(sampleList) foi chamado 1 vez.
        verify(listRepository, times(1)).delete(sampleList);
    }
}