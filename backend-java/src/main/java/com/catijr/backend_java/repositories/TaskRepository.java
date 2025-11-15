package com.catijr.backend_java.repositories;

import com.catijr.backend_java.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Optional<Task> findFirstByTaskListIdOrderByDisplayOrderDesc(Long listId);
}