package com.catijr.backend_java.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Esta exceção customizada é para nossas regras de negócio
// (ela é uma RuntimeException, mas com um nome específico)
@ResponseStatus(HttpStatus.CONFLICT) // Diz ao Spring que essa exceção = Erro 409
public class BusinessRuleException extends RuntimeException {
    
    public BusinessRuleException(String message) {
        super(message);
    }
}