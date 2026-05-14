# 5. Lista de Requisitos

| ID       | Nome do Requisito (Verbo Infinitivo \+ Objeto) |
| :------- | :--------------------------------------------- |
| **RF01** | Cadastrar aluno                                |
| **RF02** | Editar aluno                                   |
| **RF03** | Consultar aluno                                |
| **RF04** | Excluir aluno                                  |
| **RF05** | Cadastrar voluntário                           |
| **RF06** | Editar voluntário                              |
| **RF07** | Consultar voluntário                           |
| **RF08** | Excluir voluntário                             |
| **RF09** | Criar turma                                    |
| **RF10** | Editar turma                                   |
| **RF11** | Excluir turma                                  |
| **RF12** | Vincular instrutor à turma                     |
| **RF13** | Matricular aluno em turma                      |
| **RF14** | Registrar presença de alunos na chamada        |
| **RF15** | Gerar relatório de evasão de alunos            |
| **RF16** | Exportar relatórios em PDF ou Excel            |
| **RF17** | Visualizar indicadores no Dashboard            |
| **RF18** | Emitir alertas de baixa frequência.            |
| **RF19** | Autenticar usuário no Login                    |
| **RF20** | Gerenciar permissões de acesso                 |
| **RF21** | Emitir alerta de aniversariante                |
| **RF22** | Remover matrícula de aluno                     |
| **RF23** | Remover voluntário de uma turma                |
| **RF24** | Consultar histórico de presença                |

| ID        | Nome                               | Descrição                                                                                                                                                                                                                      | Classificação (FURPS+)   | Classificação (Sommerville)             |
| :-------- | :--------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :-------------------------------------- |
| **RNF01** | **Facilidade de Aprendizado**      | Um usuário com perfil administrativo deve ser capaz de realizar o fluxo completo de "Matricular aluno em turma" (RF13) em **no máximo 10 minutos** na primeira tentativa, utilizando apenas o guia de ajuda rápida do sistema. | Usabilidade              | Requisito de Produto (Usabilidade)      |
| **RNF02** | **Segurança de Dados**             | O sistema deve criptografar senhas e restringir acesso a dados sensíveis conforme a LGPD.                                                                                                                                      | Suportabilidade          | Requisito Externo (Segurança)           |
| **RNF03** | **Tempo de Resposta**              | O carregamento de páginas e consultas deve ocorrer em no máximo 2 segundos.                                                                                                                                                    | Desempenho               | Requisito de Produto (Eficiência)       |
| **RNF04** | **Responsividade**                 | A interface deve ser adaptável para uso em dispositivos móveis e tablets.                                                                                                                                                      | Usabilidade              | Requisito de Produto (Portabilidade)    |
| **RNF05** | **Disponibilidade**                | O sistema deve estar operacional durante 99% do horário comercial.                                                                                                                                                             | Confiabilidade           | Requisito de Produto (Disponibilidade)  |
| **RNF06** | **Baixo Custo**                    | A solução deve priorizar tecnologias de baixo custo para manter a viabilidade financeira.                                                                                                                                      | \+ (Restrição Econômica) | Requisito Organizacional                |
| **RNF07** | **Manutenibilidade**               | O sistema deve ser desenvolvido de forma modular para facilitar correções e evolução futura.                                                                                                                                   | Suportabilidade          | Requisito de Produto (Manutenibilidade) |
| **RNF08** | **Confiabilidade das Informações** | O sistema deve garantir integridade e consistência dos dados cadastrados e registrados.                                                                                                                                        | Reliability              | Requisito de Produto (Confiabilidade)   |
| **RNF09** | **Escalabilidade**                 | O sistema deve suportar aumento gradual no número de usuários, turmas e registros sem perda significativa de desempenho.                                                                                                       | Performance              | Requisito de Produto (Escalabilidade)   |

# Tabela nova com a rastreabilidade:

##

| ID   | Nome do Requisito (Verbo \+ Objeto)          | Rastreabilidade (Origem)            | Observações para Critérios de Aceite                                                                             | Valor | Complexidade |
| :--- | :------------------------------------------- | :---------------------------------- | :--------------------------------------------------------------------------------------------------------------- | :---- | :----------- |
| RF01 | Gerenciar perfis de alunos                   | CP1 \- Gestão de Cadastros          | Engloba as operações de criar, ler, atualizar e desativar cadastros de alunos. Inclui filtros por nome e status. | Alto  | Baixo        |
| RF02 | Gerenciar perfis de voluntários              | CP1 \- Gestão de Cadastros          | Controle administrativo do corpo voluntário. Parâmetros de busca por área e disponibilidade.                     | Alto  | Baixo        |
| RF03 | Gerenciar turmas de atividades               | CP2 \- Controle de Grupos           | Estruturação de cursos e oficinas. Permite definir horários e capacidades.                                       | Alto  | Baixo        |
| RF04 | Gerenciar alocações em turmas                | CP2 \- Controle de Grupos           | Vinculação de instrutores às turmas e matrícula de alunos.                                                       | Alto  | Baixo        |
| RF05 | Registrar frequência de alunos               | CP3 \- Monitoramento de Assiduidade | Lançamento diário de presença/falta realizado pelos instrutores no sistema.                                      | Alto  | Baixo        |
| RF06 | Consultar histórico de assiduidade           | CP3 \- Monitoramento de Assiduidade | Acesso ao registro histórico. Filtros por aluno, turma ou intervalo de datas.                                    | Baixo | Baixo        |
| RF07 | Emitir alertas de aniversariantes            | CP4 \- Módulo de Relacionamento     | Notificação automática para a equipe interna sobre aniversariantes (alunos) do dia ou mês.                       | Baixo | Baixo        |
| RF08 | Visualizar painel de indicadores (Dashboard) | CP5 \- Visão Analítica              | Exibição de métricas de desempenho organizacional. Parâmetros de recortes temporais.                             | Alto  | Alto         |
| RF09 | Importar base de dados legada                | CP6 \- Integração de Dados Legados  | Capacidade de carregar dados históricos de planilhas externas para o sistema.                                    | Alto  | Alto         |
| RF10 | Consultar trajetória temporal do aluno       | CP7 \- Histórico de Trajetória      | Visualização cronológica consolidada de todas as participações e evoluções de um aluno na instituição.           | Baixo | Baixo        |
| RF11 | Gerar relatórios gerenciais consolidados     | CP8 \- Consolidação de Informações  | Emissão de documentos para prestação de contas. Filtros por evasão, matrículas e frequência.                     | Alto  | Alto         |
| RF12 | Detectar padrão de risco de evasão           | CP9 \- Identificação de Evasão      | Algoritmo que identifica automaticamente alunos com baixa frequência recorrente.                                 | Alto  | Alto         |
| RF13 | Exportar lista de contatos para comunicados  | CP10 \- Comunicação Ativa           | Extração de dados de contato (e-mail/telefone) filtrados por grupos para comunicação externa.                    | Baixo | Alto         |
| RF14 | Autenticar usuário no sistema                | CP11 \- Gestão de Permissões        | Segurança de acesso via login e senha para coordenadores e voluntários.                                          | Alto  | Baixo        |
| RF15 | Gerar níveis de acesso                       | CP11 \- Gestão de Permissões        | Atribuição de papéis (roles) para restringir funcionalidades conforme o perfil administrativo.                   | Baixo | Baixo        |
| RF16 | Exportar dados processados                   | CP12 \- Portabilidade de Dados      | Extração de informações em formatos abertos (CSV, Excel, PDF) para uso em ferramentas externas.                  | Alto  | Alto         |

##

# Matriz de Valor x Complexidade dos Requisitos

Com base nos valores e complexidades avaliados em relação aos requisitos escritos de forma abstraida, foi montado uma matriz de valor e complexidade para guiar o desenvolvimento.

![alt text](images/image4.png)
