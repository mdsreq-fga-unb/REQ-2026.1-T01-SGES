# SGES
## Especificação de Caso de Uso: CSU01 (RF01) - Autenticar usuário

---

### 1. Breve Descrição
Validar as credenciais para o controle de acesso primário ao sistema, bloqueando a conta temporariamente após 5 tentativas de login incorretas consecutivas.

---

### 2. Fluxo Básico de Eventos
1. O usuário acessa a página de login do SGES.
2. O sistema solicita o e-mail e a senha do usuário.
3. O usuário insere suas credenciais e clica em 'Entrar'.
4. O sistema valida as credenciais informadas no banco de dados.
5. O sistema gera um token JWT válido e inicia a sessão do usuário.
6. O sistema redireciona o usuário para a página inicial (Dashboard) correspondente ao seu perfil de acesso.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
#### FE1 - Credenciais Inválidas
No passo 4, se as credenciais (e-mail ou senha) estiverem incorretas, o sistema incrementa o contador de tentativas de login falhas do usuário, exibe uma mensagem de erro indicando login inválido e solicita novas credenciais.

#### FE2 - Bloqueio de Conta
No passo 4, se o número de tentativas consecutivas falhas atingir 5, o sistema altera o status da conta para 'Bloqueada', registra a ocorrência na trilha de auditoria (segurança) e exibe uma mensagem informando que a conta foi temporariamente bloqueada por segurança.

---

### 5. Pré-Condições
* O usuário deve possuir uma conta cadastrada e ativa no sistema.

---

### 6. Pós-Condições
* O usuário obtém acesso às funcionalidades do sistema correspondentes ao seu perfil de acesso através de um token JWT válido.

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* RNF06 - Prevenção de Inatividade: O token de sessão expira automaticamente após 15 minutos de inatividade, exigindo novo login.
* RNF02 - Trilha de Auditoria: Tentativas de acesso malsucedidas devem registrar logs contendo timestamp, e-mail e endereço IP.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
