package com.catijr.backend_java.repositories;

import com.catijr.backend_java.models.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {
    boolean existsByName(String name);
}