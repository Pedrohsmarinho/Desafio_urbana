-- Corrigir senha do usuário admin
-- O hash anterior era inválido, agora será "admin123"  
-- Hash BCrypt válido gerado para "admin123"

UPDATE usuarios 
SET senha = '$2a$10$B19Nb7gzCEZbREvoBR9pvumc3QmmqNCuTCcL4DtavFvvl0j2ddH9i'
WHERE email = 'admin@urbana.com';

-- Corrigir também a senha do usuário comum
UPDATE usuarios
SET senha = '$2a$10$2Jng3GSWBL5CVEPnn1fYYuMawdepkyCvjlxcfY11xoB2MGG4Ln4j.'
WHERE email = 'user@urbana.com';
