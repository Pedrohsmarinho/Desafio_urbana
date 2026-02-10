package com.urbana.controller;

import com.urbana.model.dto.LoginRequestDTO;
import com.urbana.model.dto.LoginResponseDTO;
import com.urbana.model.dto.UsuarioCreateDTO;
import com.urbana.model.dto.UsuarioDTO;
import com.urbana.security.JwtUtils;
import com.urbana.security.UserDetailsImpl;
import com.urbana.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Autenticação", description = "Endpoints para autenticação e registro de usuários")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, 
                         UsuarioService usuarioService, 
                         JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.usuarioService = usuarioService;
        this.jwtUtils = jwtUtils;
    }

    @Operation(summary = "Realizar login", description = "Autentica usuário e retorna token JWT")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        LoginResponseDTO response = new LoginResponseDTO(
                jwt,
                userDetails.getId(),
                userDetails.getNome(),
                userDetails.getUsername(),
                userDetails.getAuthorities().iterator().next().getAuthority()
                        .equals("ROLE_ADMIN") ? 
                        com.urbana.model.enums.Role.ROLE_ADMIN : com.urbana.model.enums.Role.ROLE_USER
        );

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Registrar novo usuário", description = "Cria um novo usuário no sistema")
    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDTO> registrar(@Valid @RequestBody UsuarioCreateDTO usuarioDTO) {
        UsuarioDTO novoUsuario = usuarioService.criar(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }
}
