# SGES
## Especificação de Caso de Uso: CSU06 (RF07) - Cadastrar beneficiário

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)

---

### 1. Breve Descrição
Registrar um novo beneficiário informando seus dados sociodemográficos de forma a viabilizar o acompanhamento longitudinal pela instituição.

---

### 2. Fluxo Básico de Eventos
1. O usuário acessa o menu de beneficiários e clica em 'Cadastrar Beneficiário'.
2. O sistema apresenta o formulário sociodemográfico solicitando dados obrigatórios (Nome, Data de Nascimento, Renda Familiar, Escolaridade) e opcionais (CPF, E-mail, Contato Responsável).
3. O usuário insere as informações requeridas e clica em 'Salvar'.
4. O sistema valida o formato dos dados preenchidos e a unicidade do CPF (se fornecido). [[FE-4-A](#fe-4-a-dados-sociodemograficos-invalidos), [FE-4-B](#fe-4-b-cpf-de-beneficiario-ja-cadastrado)]
5. O sistema armazena o cadastro com o status de beneficiário ativo e gera um identificador único (ID).
6. O sistema exibe uma mensagem de confirmação de cadastro bem-sucedido.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
#### FE-4-A - Dados Sociodemográficos Inválidos
No passo 4, se os dados obrigatórios não forem preenchidos ou o CPF fornecido estiver no formato incorreto, o sistema cancela a operação, indica os erros na tela e solicita a correção.

#### FE-4-B - CPF de Beneficiário já Cadastrado
No passo 4, se o CPF digitado já estiver cadastrado para outro beneficiário, o sistema bloqueia o registro e apresenta um aviso informando a duplicidade.

---

### 5. Pré-Condições
* O usuário (Gestor ou Instrutor) deve estar autenticado no sistema.

---

### 6. Pós-Condições
* O beneficiário é adicionado de forma ativa ao cadastro sociodemográfico do sistema, habilitando-o para matrícula em oficinas.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* RNF01 - Criptografia Sensível: Os dados de identificação pessoal e sensível dos beneficiários devem ser hasheados ou criptografados na base de dados.
* Adequação às diretrizes da LGPD com relação à coleta de dados sociodemográficos de menores.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
