# SGES
## Especificação de Caso de Uso: CSU02 (RF02) - Redefinir senha de acesso

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)

---

### 1. Breve Descrição
Permitir ao usuário a recuperação do acesso ao sistema mediante o envio de um link seguro com token temporário de redefinição de senha.

---

### 2. Fluxo Básico de Eventos
1. O usuário acessa a página de login do SGES e clica em 'Esqueci minha senha'.
2. O sistema solicita o e-mail cadastrado do usuário.
3. O usuário informa o e-mail e clica em 'Enviar'.
4. O sistema valida se o e-mail informado pertence a uma conta ativa. [[FE-4-A](#fe-4-a-e-mail-nao-cadastrado)]
5. O sistema gera um token temporário com validade de 15 minutos.
6. O sistema envia um e-mail contendo o link seguro de redefinição com o token em até 1 minuto.
7. O usuário acessa o link seguro através do e-mail recebido e é direcionado para a tela de criação de nova senha. [[FE-7-A](#fe-7-a-linktoken-expirado-ou-invalido)]
8. O usuário insere a nova senha, confirma e clica em 'Salvar'.
9. O sistema valida as diretrizes de segurança da nova senha e a armazena de forma criptografada.
10. O sistema invalida o token de redefinição e redireciona o usuário para a tela de login.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
#### FE-4-A - E-mail não Cadastrado
No passo 4, se o e-mail não estiver cadastrado no sistema, para evitar a varredura e descoberta de usuários legítimos, o sistema exibe a mesma mensagem de sucesso padrão (que um link foi enviado se o e-mail existir), mas não dispara nenhuma mensagem eletrônica.

#### FE-7-A - Link/Token Expirado ou Inválido
No passo 7, se o usuário tentar redefinir a senha utilizando um link cujo token já expirou (mais de 15 minutos desde o envio) ou é inválido, o sistema impede a ação e exibe uma mensagem de erro orientando a realizar uma nova solicitação.

---

### 5. Pré-Condições
* O usuário deve possuir uma conta ativa associada ao e-mail informado.

---

### 6. Pós-Condições
* A senha do usuário é atualizada de forma segura no banco de dados e o token temporário utilizado é invalidado.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* RNF01 - Criptografia Sensível: A nova senha deve ser hasheada de forma segura antes de ser persistida no banco de dados.
* Envio do e-mail em até 1 minuto após a solicitação.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
