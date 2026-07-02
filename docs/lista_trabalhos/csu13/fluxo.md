# SGES
## CSU13 (RF14) — Emitir alerta de evasão

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Quadro MVP](../../planejamento_organizacao/quadro_mvp.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Monitorar de forma autônoma a frequência dos alunos e sinalizar no painel os beneficiários que apresentam risco de evasão escolar/social.

### Ator principal:
Sistema

### Atores secundários:
Nenhum

### Pré-condições:
O sistema deve possuir registros de chamadas anteriores processados.

### Fluxo principal:
1. O Sistema executa a verificação de faltas.
2. O Sistema analisa o histórico de faltas do beneficiário na turma buscando por ocorrências de 2 ou mais faltas não justificadas. (RN13-01; RN13-02)
3. O Sistema cria/atualiza os Alertas de Evasão correspondentes na base de dados vinculando o beneficiário. (RN13-01; RN13-02; FE-3-A)
4. O Sistema exibe os alertas visuais de risco nos Dashboards de Gestores e Instrutores, e envia notificações automáticas.

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:
#### FE-3-A — Falha de Persistência

Este fluxo inicia no passo 3 do fluxo principal. Se ocorrer erro de persistência ao registrar o alerta de evasão ou ao atualizar o status de matrícula no banco de dados, a transação é abortada e a falha é registrada nos logs de sistema para verificação da administração. O caso de uso é encerrado.

### Regras de negócio:
#### RN13-01 — Alerta de Atenção por Faltas
O sistema emite um alerta de atenção automático no painel do gestor e do instrutor caso o beneficiário atinja 2 faltas não justificadas na mesma turma.

#### RN13-02 — Bloqueio e Evasão por Faltas
O sistema altera automaticamente o status do aluno para 'Evadido' (bloqueio/necessidade de refazer o curso) ao atingir 3 ou mais faltas não justificadas na mesma turma.


### Pós-condições:
O alerta de evasão é gerado de forma ativa e as notificações correspondentes são exibidas nos painéis de controle do sistema.
