package com.urbana.controller;

import com.urbana.model.dto.CartaoDTO;
import com.urbana.service.CartaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Cartões", description = "Endpoints para gerenciamento de cartões de ônibus")
@SecurityRequirement(name = "bearerAuth
@RestController
@RequestMapping("/cartoes")
public class CartaoController {

    private final CartaoService cartaoService;

    @Autowired
    public CartaoController(CartaoService cartaoService) {
        this.cartaoService = cartaoService;
    }

    @Operation(summary = "Listar todos os cartões", description = "Retorna lista de todos os cartões")
    @GetMapping
    public ResponseEntity<List<CartaoDTO>> listarTodos() {
        List<CartaoDTO> cartoes = cartaoService.listarTodos();
        return ResponseEntity.ok(cartoes);
    }

    @Operation(summary = "Listar cartões ativos", description = "Retorna lista de cartões ativos")
    @GetMapping("/ativos")
    public ResponseEntity<List<CartaoDTO>> listarAtivos() {
        List<CartaoDTO> cartoes = cartaoService.listarAtivos();
        return ResponseEntity.ok(cartoes);
    }

    @Operation(summary = "Buscar cartão por ID", description = "Retorna um cartão específico pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<CartaoDTO> buscarPorId(@PathVariable Long id) {
        CartaoDTO cartao = cartaoService.buscarPorId(id);
        return ResponseEntity.ok(cartao);
    }

    @Operation(summary = "Listar cartões de um usuário", description = "Retorna todos os cartões de um usuário específico")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<CartaoDTO>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<CartaoDTO> cartoes = cartaoService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(cartoes);
    }

    @Operation(summary = "Adicionar cartão a um usuário", description = "Adiciona um novo cartão a um usuário")
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<CartaoDTO> adicionarCartaoAoUsuario(
            @PathVariable Long usuarioId,
            @Valid @RequestBody CartaoDTO cartaoDTO) {
        CartaoDTO novoCartao = cartaoService.adicionarCartaoAoUsuario(usuarioId, cartaoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCartao);
    }

    @Operation(summary = "Atualizar cartão", description = "Atualiza dados de um cartão existente")
    @PutMapping("/{id}")
    public ResponseEntity<CartaoDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CartaoDTO cartaoDTO) {
        CartaoDTO cartaoAtualizado = cartaoService.atualizar(id, cartaoDTO);
        return ResponseEntity.ok(cartaoAtualizado);
    }

    @Operation(summary = "Ativar ou desativar cartão", description = "Altera o status de ativo/inativo de um cartão (Apenas Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<CartaoDTO> ativarOuDesativar(
            @PathVariable Long id,
            @RequestParam Boolean status) {
        CartaoDTO cartaoAtualizado = cartaoService.ativarOuDesativar(id, status);
        return ResponseEntity.ok(cartaoAtualizado);
    }

    @Operation(summary = "Remover cartão de um usuário", description = "Remove um cartão de um usuário específico (Apenas Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{cartaoId}/usuario/{usuarioId}")
    public ResponseEntity<Void> removerCartaoDoUsuario(
            @PathVariable Long usuarioId,
            @PathVariable Long cartaoId) {
        cartaoService.removerCartaoDoUsuario(usuarioId, cartaoId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Deletar cartão", description = "Remove permanentemente um cartão (Apenas Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        cartaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
