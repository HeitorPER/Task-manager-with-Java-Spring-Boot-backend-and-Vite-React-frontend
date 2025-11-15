package com.catijr.backend_java.services;

import com.catijr.backend_java.dtos.ReorderTasksDTO;
import com.catijr.backend_java.dtos.TaskCreateDTO;
import com.catijr.backend_java.dtos.TaskUpdateDTO;
import com.catijr.backend_java.models.Task;
import com.catijr.backend_java.models.TaskList;
import com.catijr.backend_java.repositories.TaskListRepository;
import com.catijr.backend_java.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskListRepository taskListRepository; 

    //[GET] /tasks/:id
    @Transactional(readOnly = true)
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com ID: " + id)); 
    }

    //[POST] /tasks
    @Transactional
    public Task createTask(TaskCreateDTO dto) {
        TaskList parentList = taskListRepository.findById(dto.listId())
                .orElseThrow(() -> new RuntimeException("Lista não encontrada com ID: " + dto.listId()));

        Task newTask = new Task();
        newTask.setName(dto.name());
        newTask.setDescription(dto.description());
        newTask.setPriority(dto.priority());
        newTask.setExpectedFinishDate(dto.expectedFinishDate());
        
        newTask.setTaskList(parentList);

        Optional<Task> topTask = taskRepository.findFirstByTaskListIdOrderByDisplayOrderDesc(dto.listId());
        
        int newOrder = topTask.map(task -> task.getDisplayOrder() + 1).orElse(0);
        newTask.setDisplayOrder(newOrder);
        
        return taskRepository.save(newTask);
    }

    //[PUT] /tasks/:id
    @Transactional
    public Task updateTask(Long id, TaskUpdateDTO dto) {
        Task task = getTaskById(id); 

        if (dto.name() != null) {
            task.setName(dto.name());
        }
        if (dto.description() != null) {
            task.setDescription(dto.description());
        }
        if (dto.priority() != null) {
            task.setPriority(dto.priority());
        }
        if (dto.expectedFinishDate() != null) {
            task.setExpectedFinishDate(dto.expectedFinishDate());
        }
        if (dto.newfinishDate() != null) {
            task.setFinishDate(dto.newfinishDate());
        }

        if (dto.completed() != null) {
        task.setCompleted(dto.completed());
        }

        if (dto.listId() != null && !dto.listId().equals(task.getTaskList().getId())) {
            TaskList newParentList = taskListRepository.findById(dto.listId())
                    .orElseThrow(() -> new RuntimeException("Nova lista não encontrada com ID: " + dto.listId()));
            task.setTaskList(newParentList);
        }

        if (dto.expectedFinishDate() != null) {
        task.setExpectedFinishDate(dto.expectedFinishDate());
        }

        if (dto.displayOrder() != null) {
            task.setDisplayOrder(dto.displayOrder());
        }

        return taskRepository.save(task);
    }

    //[DELETE] /tasks/:id
    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Tarefa não encontrada com ID: " + id);
        }
        taskRepository.deleteById(id);
    }

    //[POST] /reorder (dnd) 
    @Transactional
    public void reorderTasks(ReorderTasksDTO dto) {
        TaskList newList = taskListRepository.findById(dto.newListId())
                .orElseThrow(() -> new RuntimeException("Lista não encontrada"));

        for (int i = 0; i < dto.taskIds().size(); i++) {
            Long taskId = dto.taskIds().get(i);
            int displayOrder = i;
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Tarefa não encontrada: " + taskId));
            task.setTaskList(newList); 
            task.setDisplayOrder(displayOrder); 
            
            taskRepository.save(task);
        }
    }
}