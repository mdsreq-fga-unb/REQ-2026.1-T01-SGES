# SGES
## Especificação de Caso de Uso: CSU09 (RF10) - Matricular beneficiário

---

### 1. Breve Descrição
Vincular um beneficiário cadastrado e ativo a uma turma específica, realizando o abatimento das vagas disponíveis.

---

### 2. Fluxo Básico de Eventos
1. O usuário seleciona a turma desejada e clica na opção 'Matricular Aluno'.
2. O sistema apresenta um campo de busca para selecionar o beneficiário.
3. O usuário localiza o beneficiário ativo e clica em 'Confirmar Matrícula'.
4. O sistema valida se o beneficiário já possui matrícula na turma e se a turma possui vagas em aberto.
5. O sistema cria o registro de vínculo da matrícula e subtrai uma vaga disponível no limite da turma.
6. O sistema exibe mensagem de confirmação de matrícula efetuada com sucesso.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
#### FE1 - Limite de Vagas Excedido
No passo 4, se a turma não possuir vagas livres, o sistema bloqueia novas matrículas e emite um alerta informando que a turma está lotada.

#### FE2 - Beneficiário já Matriculado
No passo 4, se o beneficiário selecionado já possuir matrícula ativa na turma escolhida, o sistema cancela a operação e informa a duplicidade.

---

### 5. Pré-Condições
* O usuário deve estar autenticado; a turma e o beneficiário devem estar ativos.

---

### 6. Pós-Condições
* O vínculo de matrícula é criado no banco de dados e o saldo de vagas da turma é atualizado.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* Atualização atômica do saldo de vagas para evitar problemas de concorrência caso dois usuários tentem matricular simultaneamente na última vaga.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
