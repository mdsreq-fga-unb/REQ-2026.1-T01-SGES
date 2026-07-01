# SGES
## CSU02 (RF02) — Redefinir senha de acesso

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Permitir ao usuário a recuperação do acesso ao sistema mediante o envio de um código de verificação temporário de redefinição de senha.

### Ator principal:
Usuário

### Atores secundários:
Servidor de E-mail

### Pré-condições:
O usuário deve possuir uma conta ativa associada ao e-mail informado.

### Fluxo principal:
1. O usuário acessa a página de login do SGES e solicita a redefinição de senha.
2. O sistema solicita o e-mail cadastrado do usuário.
3. O usuário informa o e-mail e confirma a operação.
4. O sistema valida se o e-mail informado pertence a uma conta ativa. (RN02-01; RN02-04; FE-4-A)
5. O sistema gera um código de verificação temporário com validade de 30 minutos. (RN02-02)
6. O sistema envia um e-mail contendo o código de verificação em até 1 minuto. (RN02-03)
7. O usuário insere o código de verificação recebido e confirma a operação.
8. O sistema valida o código de verificação e solicita a criação da nova senha. (FE-8-A; FE-8-B)
9. O usuário insere a nova senha, confirma e solicita o salvamento.
10. O sistema valida as diretrizes de segurança da nova senha e a armazena de forma criptografada. (RNF01; FE-10-A; FE-10-B)
11. O sistema invalida o código de redefinição e redireciona o usuário para página login.

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:
#### FE-4-A — E-mail não Cadastrado

Este fluxo inicia no passo 4 do fluxo principal. Se o e-mail não estiver cadastrado no sistema, para evitar a varredura e descoberta de usuários legítimos, o sistema exibe a mesma mensagem de sucesso padrão (que um código foi enviado se o e-mail existir), mas não dispara nenhuma mensagem eletrônica. O caso de uso é encerrado.

#### FE-8-A — Código Expirado

Este fluxo inicia no passo 8 do fluxo principal. Se o usuário tentar redefinir a senha utilizando um código que já expirou (mais de 30 minutos desde o envio), o sistema impede a ação, exibe uma mensagem de erro orientando a realizar uma nova solicitação. O fluxo retorna ao passo 2 do fluxo principal.

#### FE-8-B — Código Inválido

Este fluxo inicia no passo 8 do fluxo principal. Se o usuário tentar redefinir a senha utilizando um código inválido, o sistema impede a ação e exibe uma mensagem de erro orientando a realizar uma nova solicitação. O fluxo retorna ao passo 2 do fluxo principal.

#### FE-10-A — Dados Inválidos

Este fluxo inicia no passo 10 do fluxo principal. Se a nova senha informada não atender aos critérios mínimos de segurança (ex: tamanho mínimo, caracteres obrigatórios), o sistema impede o salvamento e solicita a correção. O fluxo retorna ao passo 9 do fluxo principal.

#### FE-10-B — Falha de Persistência

Este fluxo inicia no passo 10 do fluxo principal. Se ocorrer um erro técnico de gravação no banco de dados, o sistema impede a atualização da senha, exibe um alerta de erro e mantém os dados originais intactos. O caso de uso é encerrado.

### Regras de negócio:
#### RN02-01 — Validação de Conta Ativa
O código de recuperação de senha só é gerado para e-mails associados a contas ativas no sistema.

#### RN02-02 — Tempo de Expiração de Código
O código temporário de redefinição de senha expira automaticamente após 30 minutos de sua geração.

#### RN02-03 — Tempo de Envio de E-mail
O e-mail com o código de redefinição deve ser enviado ao usuário em no máximo 1 minuto.

#### RN02-04 — Prevenção de Descoberta de Usuários
Se o e-mail informado não existir, o sistema exibe a mensagem de sucesso padrão para evitar a varredura de usuários válidos (sem enviar e-mail).

### Requisitos não funcionais:
#### RNF01 — Criptografia Sensível
A nova senha cadastrada deve ser hasheada utilizando algoritmos seguros antes de ser persistida.

### Pós-condições:
A senha do usuário é atualizada de forma segura no banco de dados e o código temporário utilizado é invalidado.

#### Protótipo de Tela (DoR)

![Protótipo - CSU02](CSU02.png){: style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); max-width: 100%; border: 1px solid var(--sges-card-border); margin-top: 1rem;"}
