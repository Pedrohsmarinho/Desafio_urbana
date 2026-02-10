package com.urbana.mapper;

import com.urbana.model.dto.UsuarioCreateDTO;
import com.urbana.model.dto.UsuarioDTO;
import com.urbana.model.entity.Usuario;
import com.urbana.model.enums.Role;

import java.util.List;
import java.util.stream.Collectors;

public class UsuarioMapper {

    public static UsuarioDTO toDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setRole(usuario.getRole());
        dto.setAtivo(usuario.getAtivo());
        dto.setDataCriacao(usuario.getDataCriacao());
        dto.setDataAtualizacao(usuario.getDataAtualizacao());

        if (usuario.getCartoes() != null && !usuario.getCartoes().isEmpty()) {
            dto.setCartoes(usuario.getCartoes().stream()
                    .map(CartaoMapper::toDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public static Usuario toEntity(UsuarioCreateDTO dto, String senhaCriptografada) {
        if (dto == null) {
            return null;
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(senhaCriptografada);
        usuario.setRole(dto.getRole() != null ? dto.getRole() : Role.ROLE_USER);

        return usuario;
    }

    public static List<UsuarioDTO> toDTOList(List<Usuario> usuarios) {
        return usuarios.stream()
                .map(UsuarioMapper::toDTO)
                .collect(Collectors.toList());
    }
}
