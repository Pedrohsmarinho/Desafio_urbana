package com.urbana.service;

import com.urbana.exception.BusinessException;
import com.urbana.exception.ResourceNotFoundException;
import com.urbana.mapper.CartaoMapper;
import com.urbana.model.dto.CartaoDTO;
import com.urbana.model.entity.Cartao;
import com.urbana.model.entity.Usuario;
import com.urbana.repository.CartaoRepository;
import com.urbana.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartaoService {

    private final CartaoRepository cartaoRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public CartaoService(CartaoRepository cartaoRepository, UsuarioRepository usuarioRepository) {
        this.cartaoRepository = cartaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<CartaoDTO> listarTodos() {
        List<Cartao> cartoes = cartaoRepository.findAll();
        return CartaoMapper.toDTOList(cartoes);
    }

    @Transactional(readOnly = true)
    public List<CartaoDTO> listarAtivos() {
        List<Cartao> cartoes = cartaoRepository.findAllAtivos();
        return CartaoMapper.toDTOList(cartoes);
    }

    @Transactional(readOnly = true)
    public List<CartaoDTO> listarPorUsuario(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ResourceNotFoundException("Usuário", "id", usuarioId);
        }
        List<Cartao> cartoes = cartaoRepository.findByUsuarioId(usuarioId);
        return CartaoMapper.toDTOList(cartoes);
    }

    @Transactional(readOnly = true)
    public CartaoDTO buscarPorId(Long id) {
        Cartao cartao = cartaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cartão", "id", id));
        return CartaoMapper.toDTO(cartao);
    }

    @Transactional
    public CartaoDTO adicionarCartaoAoUsuario(Long usuarioId, CartaoDTO dto) {
        // Buscar usuário
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", usuarioId));

        // Validar se número do cartão já existe
        if (cartaoRepository.existsByNumeroCartao(dto.getNumeroCartao())) {
            throw new BusinessException("Número do cartão já cadastrado no sistema");
        }

        // Criar cartão
        Cartao cartao = CartaoMapper.toEntity(dto);
        usuario.addCartao(cartao);

        cartao = cartaoRepository.save(cartao);
        return CartaoMapper.toDTO(cartao);
    }

    @Transactional
    public CartaoDTO atualizar(Long id, CartaoDTO dto) {
        Cartao cartao = cartaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cartão", "id", id));

        // Atualizar campos
        if (dto.getNumeroCartao() != null) {
            // Validar se número já existe em outro cartão
            Long count = cartaoRepository.countByNumeroCartaoAndIdNot(dto.getNumeroCartao(), id);
            if (count > 0) {
                throw new BusinessException("Número do cartão já cadastrado para outro cartão");
            }
            cartao.setNumeroCartao(dto.getNumeroCartao());
        }

        if (dto.getNome() != null && !dto.getNome().isEmpty()) {
            cartao.setNome(dto.getNome());
        }

        if (dto.getTipoCartao() != null) {
            cartao.setTipoCartao(dto.getTipoCartao());
        }

        cartao.setDataAtualizacao(LocalDateTime.now());
        cartao = cartaoRepository.save(cartao);

        return CartaoMapper.toDTO(cartao);
    }

    @Transactional
    public CartaoDTO ativarOuDesativar(Long id, Boolean status) {
        Cartao cartao = cartaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cartão", "id", id));

        cartao.setStatus(status);
        cartao.setDataAtualizacao(LocalDateTime.now());
        cartao = cartaoRepository.save(cartao);

        return CartaoMapper.toDTO(cartao);
    }

    @Transactional
    public void removerCartaoDoUsuario(Long usuarioId, Long cartaoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", usuarioId));

        Cartao cartao = cartaoRepository.findById(cartaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Cartão", "id", cartaoId));

        // Validar se o cartão pertence ao usuário
        if (!cartao.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("Cartão não pertence ao usuário informado");
        }

        usuario.removeCartao(cartao);
        cartaoRepository.delete(cartao);
    }

    @Transactional
    public void deletar(Long id) {
        if (!cartaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cartão", "id", id);
        }
        cartaoRepository.deleteById(id);
    }
}
