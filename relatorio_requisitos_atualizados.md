# Relatório de Requisitos a serem Atualizados na Documentação (SGES)

Com base nas decisões e objetivos alinhados com a vice-presidente da SEAS, este relatório apresenta as alterações e inclusões de **Requisitos Funcionais (RF)** e **Requisitos Não Funcionais (RNF)** que devem ser atualizados nos arquivos `docs/lista_requisitos.md` e `Requisitos Estruturados.md`.

---

## 1. Requisitos Funcionais (RF) - Alterados e Novos

A tabela abaixo detalha quais requisitos existentes serão modificados e quais novos requisitos serão adicionados ao backlog.

| ID | Nome do Requisito | Ação | Descrição das Modificações / Detalhes | Métrica de Validação (Critério de Aceite) |
| :--- | :--- | :--- | :--- | :--- |
| **RF01** | Gerenciar perfis de alunos | **Alterar** | Coletar profissão, e-mail e permitir upload de foto de perfil. Usar identificador único combinando UUID + código de matrícula visível para evitar problemas com homônimos. | • **CA01-03:** Campos de profissão, e-mail e upload de foto salvos com sucesso.<br>• **CA01-04:** Registro de alunos com nomes idênticos gera IDs únicos e códigos sequenciais distintos. |
| **RF04** | Cadastrar voluntário / instrutor | **Alterar** | Manter o histórico de alocação de instrutores associados às turmas em semestres anteriores. | • **CA04-03:** Ao desvincular um instrutor ou virar o semestre, o histórico é persistido na tabela histórica. |
| **RF09** | Cadastrar Turma | **Alterar** | Suportar cadastro de nome do curso, livros estudados, dia da semana, horário e alocação de no máximo 2 instrutores simultaneamente. Quantidade de vagas configurável (inicialmente sem limite). | • **CA09-04:** Bloquear a associação de um 3º instrutor na turma.<br>• **CA09-05:** Campos de livros, horário e dia da semana salvos e exibidos na listagem. |
| **RF11** | Registrar presença em lote | **Alterar** | Disponibilizar a opção de marcar falta por trabalho (`FT`) e adicionar um campo de texto compacto para observações diárias na chamada. | • **CA11-03:** Chamada salva com o status `FT` e observações individuais.<br>• **CA11-04:** Lançamento de observação não impede o salvamento em lote. |
| **RF13** | Registrar falta justificada | **Alterar** | Adicionar campo para inclusão de informações adicionais (justificativa detalhada). | • **CA13-03:** Campo de justificativa detalhada preenchido e associado à falta. |
| **RF14** | Emitir alertas de baixa frequência | **Alterar** | Enviar alertas para **Gestores** e **Instrutores** via sistema (sininho/caixa) e e-mail automatizado para os envolvidos (aluno/responsável) ao atingir 2 faltas (ou opcionalmente a cada 1 falta). | • **CA14-04:** Alertas entregues na caixa de entrada dos gestores e instrutores.<br>• **CA14-05:** Envio de e-mail automatizado disparado em até 1 minuto após a chamada. |
| **RF15** | Consultar histórico do beneficiário | **Alterar** | Mostrar o histórico completo incluindo a nova regra de limite de faltas (máximo de 3 faltas no ciclo de 14 aulas no sábado à noite). | • **CA15-04:** Exibição clara de que o aluno atingiu o limite de 3 faltas e precisa refazer o curso. |
| **RF17** | Gerar relatórios de professores | **Novo** | Emitir relatório consolidado de atividades e frequência das turmas de um professor em um ano ou semestre específico. | • **CA17-01:** Exportação de relatório em formato estruturado filtrado por professor e semestre/ano. |
| **RF18** | Visualizar gráficos de ciclo no Dashboard | **Novo** | Exibir gráficos no painel indicando: quantos entraram, quantos desistiram (evadiram) e quantos concluíram o ciclo. | • **CA18-01:** Dashboard renderiza gráficos de barra/funil corretos baseados nos status das matrículas. |
| **RF19** | Gerenciar formulários internos | **Novo** | Permitir que gestores criem formulários/pesquisas (como feedback de fim de curso) para serem respondidos no sistema. | • **CA19-01:** Gestor cria formulário e define as perguntas.<br>• **CA19-02:** Respostas dos alunos são armazenadas e vinculadas à matrícula. |

---

## 2. Requisitos Não Funcionais (RNF) - Alterados e Novos

| ID | Nome do Requisito | Ação | Descrição Técnica e Métrica de Validação | Categoria (FURPS+) |
| :--- | :--- | :--- | :--- | :--- |
| **RNF01** | Criptografia Sensível / LGPD | **Alterar** | Proteção de dados do aluno (profissão e foto de perfil). O acesso às fotos de perfil deve requerer autenticação. | Segurança |
| **RNF12** | Identidade Visual Calma e Suave | **Novo** | A interface do sistema deve utilizar tons claros de azul, azul claro e branco, transmitindo paz e serenidade. | Usabilidade |

---

## 3. Impacto de Arquitetura e Código

Para realizar essas atualizações nos documentos de engenharia do projeto, sugerimos modificar os seguintes arquivos:
1. **`docs/lista_requisitos.md`:** Atualização das tabelas de RF e RNF com as linhas descritas acima.
2. **`Requisitos Estruturados.md`:** Sincronização da tabela de mapeamento inicial.
3. **`docs/solucao_proposta.md`:** Inclusão do tópico de identidade visual e privacidade (LGPD) referente às fotos de perfil e profissão.
