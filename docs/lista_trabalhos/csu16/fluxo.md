# SGES
## Especificação de Caso de Uso: CSU16 (RF06) - Inativar instrutor

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md)<br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)

---

### 1. Breve Descrição
Realizar a inativação lógica (soft delete) do instrutor para revogar seus acessos ao sistema sem comprometer o histórico e a integridade de dados.

---

### 2. Fluxo Básico de Eventos
1. O Gestor acessa a listagem de instrutores ativos e seleciona o instrutor desejado.
2. O Gestor clica no botão 'Inativar'.
3. O sistema exibe uma mensagem solicitando a confirmação da inativação.
4. O Gestor confirma a operação.
5. O sistema altera o status do instrutor para 'Inativo' no banco de dados.
6. O sistema revoga imediatamente qualquer sessão ativa do instrutor e bloqueia novos logins.
7. O sistema exibe uma mensagem de sucesso confirmando a inativação.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
Não há fluxos de exceção identificados.

---

### 5. Pré-Condições
* O Gestor está autenticado; o instrutor que sofrerá a ação deve existir no sistema com status ativo.

---

### 6. Pós-Condições
* O status do instrutor é atualizado para inativo no banco de dados e suas credenciais de autenticação são bloqueadas imediatamente.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* RNF02 - Trilha de Auditoria: A inativação de um perfil deve gerar um log automático de segurança.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
