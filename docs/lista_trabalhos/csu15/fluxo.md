# SGES
## CSU15 (RF16) — Gerar relatório de frequência

[Matriz de Priorização](../../matriz_de_acao_e_priorizacao.md) <br>
[Quadro MVP](../../planejamento_organizacao/quadro_mvp.md) <br>
[Cronograma e Planejamento](../../planejamento_organizacao/cronograma_e_entregas.md#tabela-de-cronograma-e-planejamento)


---

### Objetivo:
Exportar em formato CSV dados consolidados de presença e engajamento dos beneficiários segmentados por turma ou período, bem como gerar relatórios gráficos contendo as métricas de fluxo de ciclo dos alunos.

### Ator principal:
Gestor

### Atores secundários:
Nenhum

### Pré-condições:
O Gestor está autenticado e existem diários de chamadas gravados no período selecionado.

### Fluxo principal:
1. O Gestor acessa a seção de relatórios e solicita a geração do relatório de frequência.
2. O Gestor escolhe os parâmetros de filtragem (ex:Turma, Período Letivo).
3. O Gestor seleciona se deseja 'Gerar Relatório CSV' ou 'Visualizar Relatório de Ciclo'.
4. O sistema consulta os registros de frequência e matrículas com base nos filtros selecionados. (FE-4-A)
5. Se for exportação CSV, o sistema consolida e formata os dados em padrão CSV com dados pessoais mascarados. (RNF03; FE-5-A)
6. Se for relatório de ciclo, o sistema exibe gráficos com as métricas de fluxo de ciclo de alunos. (RN15-01)

### Fluxos alternativos:
Não há fluxos alternativos identificados.

### Fluxos de exceção:

#### FE-4-A — Sem Registros Correspondentes (Filtro Vazio)

Este fluxo inicia no passo 4 do fluxo principal. Se a consulta retornar vazia com os filtros aplicados, o sistema cancela a exportação do arquivo e exibe a mensagem 'Não existem dados de frequência correspondentes aos filtros selecionados'. O caso de uso é encerrado.

#### FE-5-A — Falha de Persistência / Consulta

Este fluxo inicia no passo 5 do fluxo principal. Se ocorrer erro de tempo limite de consulta ou de conexão com o banco de dados, o sistema interrompe a exportação e mostra erro de indisponibilidade. O caso de uso é encerrado.

### Regras de negócio:
#### RN15-01 — Fluxo de Ciclo de Alunos
O relatório visual de ciclo deve computar e exibir graficamente a proporção de alunos inscritos, desistentes e aprovados/concluintes.

### Requisitos não funcionais:
#### RNF03 — Mascaramento em Exportações
Dados de identificação pessoal (como CPF ou contatos de emergência) devem ser exportados de forma ofuscada ou mascarada nos relatórios CSV externos para garantir conformidade com a LGPD.

### Pós-condições:
O arquivo de dados anonimizado é disponibilizado para baixar ou as métricas visuais são geradas e apresentadas.
