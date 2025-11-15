package com.catijr.backend_java.dtos;

import com.catijr.backend_java.models.Priority;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record TaskCreateDTO(
    @NotBlank String name,
    String description,
    @NotNull Priority priority,
    @Future(message = "A data esperada deve ser futura") // Requisito
    LocalDate expectedFinishDate,
    @NotNull Long listId
) {}