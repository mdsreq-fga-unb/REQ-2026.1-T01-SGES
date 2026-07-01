# SGES
## CSU08 (RF09) — Cadastrar Turma

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Registrar uma nova turma, definindo dias da semana, horários, limite de vagas, livros estudados e o instrutor responsável.

### Ator principal:
Gestor

### Atores secundários:
Nenhum

### Pré-condições:
O Gestor deve estar autenticado e os instrutores que serão alocados devem estar cadastrados e ativos.

### Fluxo principal:
1. O Gestor acessa a seção de turmas e solicita o cadastro de uma nova turma.
2. O sistema exibe o formulário solicitando: Nome, Dias da Semana, Horário, Limite de Vagas, Livros Estudados (opcional) e Instrutor Responsável.
3. O Gestor preenche as informações e confirma a operação.
4. O sistema realiza as validações de consistência e alocação. (RN08-01; RN08-02; RN08-03; FE-4-A; FE-4-B; FE-4-C)
5. O sistema salva a nova turma na base de dados. (FE-5-A)
6. O sistema exibe mensagem de confirmação de cadastro e a disponibiliza no catálogo.

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:

#### FE-4-A — Limite de Vagas Inválido

Este fluxo inicia no passo 4 do fluxo principal. Se o limite de vagas informado não for um número inteiro positivo, o sistema emite um erro e impede o cadastro. O fluxo retorna ao passo 3 do fluxo principal.

#### FE-4-B — Instrutor Inativo

Este fluxo inicia no passo 4 do fluxo principal. Se o instrutor escolhido não estiver ativo, o sistema emite um alerta e solicita a escolha de outro profissional. O fluxo retorna ao passo 3 do fluxo principal.

#### FE-4-C — Conflito de Agenda do Instrutor

Este fluxo inicia no passo 4 do fluxo principal. Se o instrutor escolhido já estiver alocado em outra turma ativa no mesmo dia e faixa de horário, o sistema emite um alerta e solicita a escolha de outro profissional ou horário. O fluxo retorna ao passo 3 do fluxo principal.

#### FE-5-A — Falha de Persistência

Este fluxo inicia no passo 5 do fluxo principal. Se houver falha de infraestrutura ao tentar salvar a turma no banco, a transação é revertida, exibindo erro ao Gestor. O caso de uso é encerrado.

### Regras de negócio:
#### RN08-01 — Validade do Limite de Vagas
O limite máximo de vagas deve ser definido como um número inteiro estritamente positivo.

#### RN08-02 — Status do Instrutor Alocado
O instrutor responsável pela turma deve estar cadastrado e com status ativo no sistema.

#### RN08-03 — Prevenção de Conflito de Horário
O sistema deve impedir a alocação de um instrutor em turmas distintas que ocorram no mesmo dia e horário.

### Pós-condições:
A nova turma é cadastrada com sucesso e está apta a receber matrículas de beneficiários.
