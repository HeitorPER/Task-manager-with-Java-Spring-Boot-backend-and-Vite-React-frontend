package com.catijr.backend_java.services;

import com.catijr.backend_java.dtos.ListCreateDTO;
import com.catijr.backend_java.models.TaskList;
import com.catijr.backend_java.repositories.TaskListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.catijr.backend_java.exceptions.BusinessRuleException;

@Service
public class TaskListService {

    @Autowired
    private TaskListRepository listRepository;

    // [GET] /lists
    public List<TaskList> getAllLists() {
        return listRepository.findAll();
    }

    // [GET] /lists/:id
    public TaskList getListById(Long id) {
        return listRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Lista não encontrada"));
    }

   // [POST] /lists
    public TaskList createList(ListCreateDTO dto) {
        if (listRepository.existsByName(dto.name())) {
            throw new BusinessRuleException("Uma lista com este nome já existe");
        }
        TaskList newList = new TaskList();
        newList.setName(dto.name());
        return listRepository.save(newList);
    }

    // [PUT] /lists/:id
    public TaskList updateList(Long id, ListCreateDTO dto) {
        TaskList list = getListById(id); 
        
        if (!list.getName().equals(dto.name()) && listRepository.existsByName(dto.name())) {
            throw new BusinessRuleException("Uma lista com este nome já existe");
        }
        
        list.setName(dto.name());
        return listRepository.save(list);
    }

    // [DELETE] /lists/:id
    public void deleteList(Long id) {
        TaskList list = getListById(id);
        
        listRepository.delete(list);
    }

    
}
