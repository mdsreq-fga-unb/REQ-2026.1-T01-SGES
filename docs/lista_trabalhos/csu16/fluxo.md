# SGES
## CSU16 (RF06) — Inativar instrutor

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md)<br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Realizar a inativação lógica (soft delete) do instrutor para revogar seus acessos ao sistema sem comprometer o histórico e a integridade de dados.

### Ator principal:
Gestor

### Atores secundários:
Nenhum

### Pré-condições:
O Gestor está autenticado; o instrutor que sofrerá a ação deve existir no sistema com status ativo.

### Fluxo principal:
1. O Gestor acessa a listagem de instrutores ativos e seleciona o instrutor desejado.
2. O Gestor solicita a inativação do instrutor.
3. O sistema exibe uma mensagem solicitando a confirmação da inativação.
4. O Gestor confirma a operação.
5. O sistema altera o status do instrutor para 'Inativo' no banco de dados. (FE-5-A)
6. O sistema revoga imediatamente qualquer sessão ativa do instrutor e bloqueia novos logins. (RN16-01)
7. O sistema exibe uma mensagem de sucesso e registra a inativação na trilha de auditoria. (RNF02)

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:

#### FE-5-A — Falha de Persistência

Este fluxo inicia no passo 5 do fluxo principal. Se ocorrer falha ao tentar atualizar o banco de dados para inativo, a operação é revertida e o status do instrutor permanece inalterado. O caso de uso é encerrado.

### Regras de negócio:
#### RN16-01 — Revogação de Acessos
A inativação acarreta na invalidação imediata de todas as sessões ativas do instrutor e impede novas autenticações.

### Requisitos não funcionais:
#### RNF02 — Trilha de Auditoria
A inativação deve registrar logs automáticos de segurança na trilha de auditoria.

### Pós-condições:
O status do instrutor é atualizado para inativo no banco de dados e suas credenciais de autenticação são bloqueadas imediatamente.
