package com.catijr.backend_java.dtos;

import com.catijr.backend_java.models.Priority;
import java.time.LocalDate;

public record TaskUpdateDTO(
    String name,
    String description,
    Priority priority,
    LocalDate expectedFinishDate,
    Long listId,
    LocalDate newfinishDate,
    Boolean completed,
    Integer displayOrder
) {}