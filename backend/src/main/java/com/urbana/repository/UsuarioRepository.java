package com.urbana.repository;

import com.urbana.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query(value = "SELECT * FROM usuarios WHERE ativo = true ORDER BY nome", nativeQuery = true)
    List<Usuario> findAllAtivos();

    @Query(value = "SELECT COUNT(*) FROM usuarios WHERE email = :email AND id != :id", nativeQuery = true)
    Long countByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);

    @Query(value = "SELECT u.* FROM usuarios u " +
           "LEFT JOIN cartoes c ON u.id = c.usuario_id " +
           "WHERE u.id = :usuarioId", nativeQuery = true)
    Optional<Usuario> findByIdWithCartoes(@Param("usuarioId") Long usuarioId);
}
