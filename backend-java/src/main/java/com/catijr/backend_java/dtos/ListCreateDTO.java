package com.catijr.backend_java.dtos;

import jakarta.validation.constraints.NotBlank;

public record ListCreateDTO(
    @NotBlank(message = "O nome não pode ser vazio")
    String name
) {}