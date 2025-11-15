package com.catijr.backend_java.dtos;

import java.util.List;

public record ReorderTasksDTO(
    Long newListId,
    List<Long> taskIds
) {}
