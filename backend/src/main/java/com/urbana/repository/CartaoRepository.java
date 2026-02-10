package com.urbana.repository;

import com.urbana.model.entity.Cartao;
import com.urbana.model.enums.TipoCartao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartaoRepository extends JpaRepository<Cartao, Long> {

    @Query(value = "SELECT * FROM cartoes WHERE usuario_id = :usuarioId ORDER BY data_criacao DESC", nativeQuery = true)
    List<Cartao> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query(value = "SELECT * FROM cartoes WHERE numero_cartao = :numeroCartao", nativeQuery = true)
    Optional<Cartao> findByNumeroCartao(@Param("numeroCartao") Long numeroCartao);

    boolean existsByNumeroCartao(Long numeroCartao);

    @Query(value = "SELECT * FROM cartoes WHERE status = true ORDER BY nome", nativeQuery = true)
    List<Cartao> findAllAtivos();

    @Query(value = "SELECT * FROM cartoes WHERE tipo_cartao = :tipo ORDER BY nome", nativeQuery = true)
    List<Cartao> findByTipoCartao(@Param("tipo") String tipo);

    @Query(value = "SELECT COUNT(*) FROM cartoes WHERE usuario_id = :usuarioId AND status = true", nativeQuery = true)
    Long countAtivosByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query(value = "SELECT COUNT(*) FROM cartoes WHERE numero_cartao = :numeroCartao AND id != :id", nativeQuery = true)
    Long countByNumeroCartaoAndIdNot(@Param("numeroCartao") Long numeroCartao, @Param("id") Long id);
}
