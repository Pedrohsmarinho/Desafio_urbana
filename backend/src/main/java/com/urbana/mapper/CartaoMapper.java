package com.urbana.mapper;

import com.urbana.model.dto.CartaoDTO;
import com.urbana.model.entity.Cartao;

import java.util.List;
import java.util.stream.Collectors;

public class CartaoMapper {

    public static CartaoDTO toDTO(Cartao cartao) {
        if (cartao == null) {
            return null;
        }

        CartaoDTO dto = new CartaoDTO();
        dto.setId(cartao.getId());
        dto.setNumeroCartao(cartao.getNumeroCartao());
        dto.setNome(cartao.getNome());
        dto.setStatus(cartao.getStatus());
        dto.setTipoCartao(cartao.getTipoCartao());
        dto.setDataCriacao(cartao.getDataCriacao());
        dto.setDataAtualizacao(cartao.getDataAtualizacao());

        if (cartao.getUsuario() != null) {
            dto.setUsuarioId(cartao.getUsuario().getId());
            dto.setUsuarioNome(cartao.getUsuario().getNome());
        }

        return dto;
    }

    public static Cartao toEntity(CartaoDTO dto) {
        if (dto == null) {
            return null;
        }

        Cartao cartao = new Cartao();
        cartao.setId(dto.getId());
        cartao.setNumeroCartao(dto.getNumeroCartao());
        cartao.setNome(dto.getNome());
        cartao.setStatus(dto.getStatus() != null ? dto.getStatus() : true);
        cartao.setTipoCartao(dto.getTipoCartao());

        return cartao;
    }

    public static List<CartaoDTO> toDTOList(List<Cartao> cartoes) {
        return cartoes.stream()
                .map(CartaoMapper::toDTO)
                .collect(Collectors.toList());
    }
}
