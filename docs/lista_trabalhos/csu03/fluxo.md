# SGES
## CSU03 (RF03) — Encerrar sessão

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Encerrar de forma segura a sessão ativa do usuário para impedir acessos não autorizados subsequentes.

### Ator principal:
Usuário

### Atores secundários:
Nenhum

### Pré-condições:
O usuário deve estar devidamente autenticado e possuir uma sessão ativa.

### Fluxo principal:
1. O usuário solicita o encerramento da sessão. (FA-1-A)
2. O sistema invalida a sessão ativa do usuário e remove as informações de autenticação do dispositivo de acesso. (FE-2-A)
3. O sistema redireciona o usuário para a tela de login do SGES.

### Fluxos alternativos:
#### FA-1-A — Encerramento por Inatividade
Este fluxo inicia antes do passo 1 do fluxo principal, quando o sistema detecta 15 minutos consecutivos de inatividade do usuário a sessão ativa é invalidada automaticamente e redireciona o usuário para a interface de login, exibindo um alerta informando que a sessão expirou. (RNF06)

### Fluxos de exceção:

#### FE-2-A — Falha de Comunicação / Persistência

Este fluxo inicia no passo 2 do fluxo principal. Se ocorrer uma falha ao tentar se comunicar com o servidor para registrar a requisição de logout, as credenciais e dados locais são removidos de qualquer forma para garantir a segurança do terminal local. O caso de uso é encerrado.

### Requisitos não funcionais:
#### RNF06 — Prevenção de Inatividade
A sessão do usuário deve expirar automaticamente após 15 minutos de inatividade, exigindo novo login.

### Pós-condições:
A sessão de acesso é invalidada e requisições subsequentes com as credenciais antigas retornam erro de não autorizado (HTTP 401).
