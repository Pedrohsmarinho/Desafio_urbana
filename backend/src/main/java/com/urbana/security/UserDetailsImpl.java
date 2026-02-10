package com.urbana.security;

import com.urbana.model.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {

    private final Long id;
    private final String nome;
    private final String email;
    private final String senha;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean ativo;

    public UserDetailsImpl(Long id, String nome, String email, String senha,
                          Collection<? extends GrantedAuthority> authorities, boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.authorities = authorities;
        this.ativo = ativo;
    }

    public static UserDetailsImpl build(Usuario usuario) {
        GrantedAuthority authority = new SimpleGrantedAuthority(usuario.getRole().name());

        return new UserDetailsImpl(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getSenha(),
                Collections.singletonList(authority),
                usuario.getAtivo()
        );
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return ativo;
    }
}
