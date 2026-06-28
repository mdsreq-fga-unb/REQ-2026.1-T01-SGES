# SGES
## Especificação de Caso de Uso: CSU03 (RF03) - Encerrar sessão

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Andamento](../andamento.md) <br>
[Cronograma e Planejamento](../../cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)

---

### 1. Breve Descrição
Invalidar o token JWT do usuário ativo, finalizando de forma segura a sua sessão no navegador para impedir acessos não autorizados subsequentes.

---

### 2. Fluxo Básico de Eventos
1. O usuário clica na opção 'Sair' ou 'Logout' no menu do sistema. [[FE-1-A](#fe-1-a-sessao-expirada-por-inatividade)]
2. O sistema recebe a requisição de finalização de sessão.
3. O sistema remove o token JWT armazenado localmente no navegador (LocalStorage/Cookies).
4. O sistema invalida o token no servidor, se aplicável, e encerra a sessão ativa do usuário.
5. O sistema redireciona o usuário para a tela de login do SGES.

---

### 3. Fluxos Alternativos
Não há fluxos alternativos identificados.

---

### 4. Fluxos de Exceção
#### FE-1-A - Sessão Expirada por Inatividade
Se o token JWT expirar no navegador por inatividade (após 15 minutos), o sistema realiza o fluxo de logout automaticamente, limpando os dados locais e exigindo nova autenticação no próximo clique do usuário.

---

### 5. Pré-Condições
* O usuário deve estar devidamente autenticado e possuir uma sessão ativa.

---

### 6. Pós-Condições
* O token de acesso é invalidado e requisições subsequentes com este token retornam erro de não autorizado (HTTP 401).

---

### 7. Pontos de Extensão
Nenhum ponto de extensão identificado.

---

### 8. Requisitos Especiais
* Garantir a limpeza completa de dados sensíveis da sessão do cliente na memória do navegador.

---

### 9. Informações Adicionais
Não há informações adicionais neste momento.
