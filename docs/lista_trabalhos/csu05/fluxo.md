# SGES
## Especificação de Caso de Uso: CSU05 (RF05) - Editar perfil do instrutor

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)

---

### 1. Breve Descrição
Permitir a edição das informações de contato e a atualização das permissões de acesso associadas ao instrutor.

---

### 2. Fluxo Básico de Eventos
1. O Gestor acessa a lista de instrutores e seleciona o instrutor que deseja editar.
2. O sistema exibe os dados atuais do instrutor no formulário (Foto, Nome Completo, CPF, E-mail, Telefone, Endereço, Profissão, Perfil de Acesso, Contato de Emergência [Nome/Telefone] e Atividades de semestres anteriores).
3. O Gestor edita os campos necessários e clica em 'Salvar Alterações'.
4. O sistema valida a conformidade dos dados e a unicidade do CPF/E-mail (se alterados). [[FE-4-A](#fe-4-a-formato-de-dados-invalido), [FE-4-B](#fe-4-b-e-mail-ja-em-uso), [FE-4-C](#fe-4-c-cpf-ja-em-uso)]
5. O sistema salva as atualizações no banco de dados.
6. O sistema exibe uma mensagem de sucesso e atualiza imediatamente as permissões ativas do instrutor.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
#### FE-4-A - Formato de Dados Inválido
No passo 4, se os dados inseridos violarem as regras de formato do sistema, o sistema exibe mensagens de erro de validação e mantém as informações anteriores.

#### FE-4-B - E-mail já em Uso
No passo 4, se o e-mail informado já estiver cadastrado para outro usuário, o sistema impede o salvamento, exibe mensagem de erro de duplicidade e mantém as informações anteriores.

#### FE-4-C - CPF já em Uso
No passo 4, se o CPF informado já estiver cadastrado para outro instrutor, o sistema impede o salvamento, exibe mensagem de erro de duplicidade e mantém as informações anteriores.

---

### 5. Pré-Condições
* O Gestor está autenticado e o instrutor a ser editado já existe no sistema.

---

### 6. Pós-Condições
* As alterações cadastrais e as novas permissões do instrutor são salvas no banco de dados e entram em vigor imediatamente.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* RNF02 - Trilha de Auditoria: Modificações de dados de perfis de instrutores devem ser registradas na tabela de logs para fins de auditoria.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
