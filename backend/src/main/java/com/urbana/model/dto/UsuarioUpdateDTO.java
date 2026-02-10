package com.urbana.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class UsuarioUpdateDTO {

    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String nome;

    @Email(message = "Email inválido")
    private String email;

    @Size(min = 6, max = 100, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    // Construtores
    public UsuarioUpdateDTO() {
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
