package com.urbana.service;

import com.urbana.exception.BusinessException;
import com.urbana.exception.ResourceNotFoundException;
import com.urbana.mapper.UsuarioMapper;
import com.urbana.model.dto.UsuarioCreateDTO;
import com.urbana.model.dto.UsuarioDTO;
import com.urbana.model.dto.UsuarioUpdateDTO;
import com.urbana.model.entity.Usuario;
import com.urbana.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return UsuarioMapper.toDTOList(usuarios);
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarAtivos() {
        List<Usuario> usuarios = usuarioRepository.findAllAtivos();
        return UsuarioMapper.toDTOList(usuarios);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", id));
        return UsuarioMapper.toDTO(usuario);
    }

    @Transactional
    public UsuarioDTO criar(UsuarioCreateDTO dto) {
        // Validar se email já existe
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Email já cadastrado no sistema");
        }

        // Criptografar senha
        String senhaCriptografada = passwordEncoder.encode(dto.getSenha());

        // Criar usuário
        Usuario usuario = UsuarioMapper.toEntity(dto, senhaCriptografada);
        usuario = usuarioRepository.save(usuario);

        return UsuarioMapper.toDTO(usuario);
    }

    @Transactional
    public UsuarioDTO atualizar(Long id, UsuarioUpdateDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", id));

        // Atualizar campos se fornecidos
        if (dto.getNome() != null && !dto.getNome().isEmpty()) {
            usuario.setNome(dto.getNome());
        }

        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            // Validar se email já existe em outro usuário
            Long count = usuarioRepository.countByEmailAndIdNot(dto.getEmail(), id);
            if (count > 0) {
                throw new BusinessException("Email já cadastrado para outro usuário");
            }
            usuario.setEmail(dto.getEmail());
        }

        if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
            String senhaCriptografada = passwordEncoder.encode(dto.getSenha());
            usuario.setSenha(senhaCriptografada);
        }

        usuario.setDataAtualizacao(LocalDateTime.now());
        usuario = usuarioRepository.save(usuario);

        return UsuarioMapper.toDTO(usuario);
    }

    @Transactional
    public void deletar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", id));

        // Inativar ao invés de deletar (soft delete)
        usuario.setAtivo(false);
        usuario.setDataAtualizacao(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void deletarPermanente(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário", "id", id);
        }
        usuarioRepository.deleteById(id);
    }
}
