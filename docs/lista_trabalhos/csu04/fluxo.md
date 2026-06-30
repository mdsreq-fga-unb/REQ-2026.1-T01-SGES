# SGES
## Especificação de Caso de Uso: CSU04 (RF04) - Cadastrar instrutor

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)

---

### 1. Breve Descrição
Permitir o cadastro de novos instrutores vinculando obrigatoriamente um perfil de acesso baseado em papéis (RBAC).

---

### 2. Fluxo Básico de Eventos
1. O Gestor acessa o painel de administração e seleciona 'Cadastrar Instrutor'.
2. O sistema exibe o formulário de cadastro solicitando: Foto de identificação, Nome Completo, CPF, E-mail, Telefone, Endereço, Profissão, Perfil de Acesso, Contato de Emergência (Nome e Telefone) e Atividades de semestres anteriores.
3. O Gestor preenche as informações e seleciona o perfil de acesso apropriado.
4. O Gestor clica em 'Salvar'.
5. O sistema valida a unicidade do CPF e do E-mail, além de garantir o preenchimento de todos os dados obrigatórios. [[FE-5-A](#fe-5-a-campos-obrigatorios-ausentes), [FE-5-B](#fe-5-b-e-mail-ja-cadastrado), [FE-5-C](#fe-5-c-cpf-ja-cadastrado)]
6. O sistema salva o instrutor, gera um identificador único (ID) para ele e o envia à base de dados.
7. O sistema exibe uma mensagem confirmando o cadastro com sucesso.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
#### FE-5-A - Campos Obrigatórios Ausentes
No passo 5, se algum campo obrigatório estiver em branco, o sistema impede a gravação, exibe uma mensagem de alerta e destaca os campos que precisam ser preenchidos.

#### FE-5-B - E-mail já Cadastrado
No passo 5, se o e-mail informado já constar na base de dados de outro instrutor, o sistema bloqueia a gravação e apresenta um alerta informando a duplicidade do e-mail.

#### FE-5-C - CPF já Cadastrado
No passo 5, se o CPF informado já constar na base de dados de outro instrutor, o sistema bloqueia a gravação e apresenta um alerta informando a duplicidade do CPF.

---

### 5. Pré-Condições
* O Gestor deve estar autenticado e possuir perfil de acesso administrador.

---

### 6. Pós-Condições
* O novo instrutor é persistido na base de dados com um identificador exclusivo e o perfil de acesso adequado.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* RNF02 - Trilha de Auditoria: O cadastro de um novo perfil deve registrar logs automáticos contendo ID do Gestor, ação realizada e timestamp.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
