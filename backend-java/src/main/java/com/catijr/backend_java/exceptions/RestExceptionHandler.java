package com.catijr.backend_java.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    // ESTE É O NOVO MÉTODO
    @ExceptionHandler(BusinessRuleException.class)
    protected ResponseEntity<Object> handleBusinessRule(BusinessRuleException ex) {
        
        // Retorna um objeto JSON { "error": "mensagem da exceção" }
        Map<String, String> errorBody = Map.of("error", ex.getMessage());
        
        // Retorna o status HTTP 409 (Conflict)
        return new ResponseEntity<>(errorBody, HttpStatus.CONFLICT);
    }

    // MANTENHA ESTE AQUI (por segurança, caso o banco pegue)
    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        
        String errorMessage = "Operação falhou: Violação de integridade no banco de dados (ex: nome duplicado).";
        Map<String, String> errorBody = Map.of("error", errorMessage);
        
        return new ResponseEntity<>(errorBody, HttpStatus.CONFLICT);
    }
}