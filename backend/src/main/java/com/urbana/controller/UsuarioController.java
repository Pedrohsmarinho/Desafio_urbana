package com.urbana.controller;

import com.urbana.exception.BusinessException;
import com.urbana.model.dto.UsuarioCreateDTO;
import com.urbana.model.dto.UsuarioDTO;
import com.urbana.model.dto.UsuarioUpdateDTO;
import com.urbana.security.UserDetailsImpl;
import com.urbana.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Usuários", description = "Endpoints para gerenciamento de usuários")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Operation(summary = "Listar todos os usuários", description = "Retorna lista de todos os usuários")
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        List<UsuarioDTO> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Listar usuários ativos", description = "Retorna lista de usuários ativos")
    @GetMapping("/ativos")
    public ResponseEntity<List<UsuarioDTO>> listarAtivos() {
        List<UsuarioDTO> usuarios = usuarioService.listarAtivos();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Buscar usuário por ID", description = "Retorna um usuário específico pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        UsuarioDTO usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @Operation(summary = "Criar novo usuário", description = "Cria um novo usuário (requer permissão de ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UsuarioDTO> criar(@Valid @RequestBody UsuarioCreateDTO usuarioDTO) {
        UsuarioDTO novoUsuario = usuarioService.criar(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    @Operation(summary = "Atualizar usuário", description = "Atualiza dados de um usuário existente (Admin pode editar qualquer usuário, usuário comum só pode editar a si mesmo)")
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> atualizar(
            @PathVariable Long id, 
            @Valid @RequestBody UsuarioUpdateDTO usuarioDTO) {
        // Verificar permissões
        verificarPermissaoDeEdicao(id);
        
        UsuarioDTO usuarioAtualizado = usuarioService.atualizar(id, usuarioDTO);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @Operation(summary = "Deletar usuário (soft delete)", description = "Inativa um usuário (Admin pode deletar qualquer usuário, usuário comum só pode deletar a si mesmo)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        // Verificar permissões
        verificarPermissaoDeEdicao(id);
        
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Deletar usuário permanentemente", description = "Remove permanentemente um usuário (requer permissão de ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/permanente")
    public ResponseEntity<Void> deletarPermanente(@PathVariable Long id) {
        usuarioService.deletarPermanente(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Verifica se o usuário autenticado tem permissão para editar/deletar o usuário especificado
     * Admin pode editar qualquer usuário, usuário comum só pode editar a si mesmo
     */
    private void verificarPermissaoDeEdicao(Long usuarioId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Verificar se é admin
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        // Se não é admin, só pode editar a si mesmo
        if (!isAdmin && !userDetails.getId().equals(usuarioId)) {
            throw new BusinessException("Você não tem permissão para editar/deletar este usuário");
        }
    }
}
