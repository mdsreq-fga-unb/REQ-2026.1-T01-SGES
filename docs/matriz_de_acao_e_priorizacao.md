# 4. Matriz de Ação e Priorização

Esta seção consolida a avaliação de todos os requisitos mapeados, cruzando o **Valor de Negócio (1 a 5)** com a **Complexidade Técnica (1 a 5)** para determinar o quadrante de ação estratégico.

## 4.1. Regra dos Quadrantes de Ação

- **Quick Win (Vitória Rápida):** Valor [4-5] e Complexidade [1-2]. Alta prioridade, baixo esforço. Entregas imediatas.
- **Major Project (Projeto Estratégico):** Valor [4-5] e Complexidade [3-5]. Alta prioridade, alto esforço. Requer planejamento estruturado.
- **Fill In (Apoio Operacional):** Valor [1-3] e Complexidade [1-2]. Baixa prioridade, baixo esforço. Encaixes na esteira de desenvolvimento.
- **Time Sink (Reavaliar):** Valor [1-3] e Complexidade [3-5]. Baixa prioridade, alto esforço. Candidatos à despriorização. _(Nota: Atribuído também a itens de valor médio [3] e complexidade média [3] que não são críticos para o lançamento)._

---

## 4.2. Priorização de Requisitos Funcionais (RF)

| ID       | Requisito (Ação)                    | Valor (1-5) | Complexidade (1-5) | Quadrante de Ação |
| :------- | :---------------------------------- | :---------: | :----------------: | :---------------- |
| **RF01** | Autenticar usuário                  |      5      |         2          | **Quick Win**     |
| **RF02** | Redefinir senha de acesso           |      4      |         2          | **Quick Win**     |
| **RF03** | Encerrar sessão                     |      5      |         1          | **Quick Win**     |
| **RF04** | Cadastrar instrutor                 |      4      |         2          | **Quick Win**     |
| **RF05** | Editar perfil do instrutor          |      3      |         1          | **Fill In**       |
| **RF06** | Inativar instrutor                  |      4      |         2          | **Quick Win**     |
| **RF07** | Registrar termo de consentimento    |      5      |         3          | **Major Project** |
| **RF08** | Cadastrar família assistida         |      5      |         2          | **Quick Win**     |
| **RF09** | Editar dados da família             |      4      |         2          | **Quick Win**     |
| **RF10** | Inativar cadastro familiar          |      4      |         2          | **Quick Win**     |
| **RF11** | Cadastrar beneficiário              |      5      |         2          | **Quick Win**     |
| **RF12** | Editar dados do beneficiário        |      3      |         2          | **Fill In**       |
| **RF13** | Cadastrar oficina/atividade         |      4      |         2          | **Quick Win**     |
| **RF14** | Matricular beneficiário             |      4      |         3          | **Major Project** |
| **RF15** | Registrar presença em lote          |      5      |         2          | **Quick Win**     |
| **RF16** | Alterar registro de frequência      |      4      |         3          | **Major Project** |
| **RF17** | Registrar falta justificada         |      4      |         2          | **Quick Win**     |
| **RF18** | Emitir alerta de evasão             |      5      |         4          | **Major Project** |
| **RF19** | Consultar histórico do beneficiário |      4      |         3          | **Major Project** |
| **RF20** | Registrar intervenção social        |      5      |         2          | **Quick Win**     |
| **RF21** | Encerrar alerta de evasão           |      4      |         3          | **Major Project** |
| **RF22** | Gerar relatório de frequência       |      4      |         3          | **Major Project** |
| **RF23** | Gerar relatório de impacto social   |      5      |         4          | **Major Project** |
| **RF24** | Exportar matriz de dados em PDF     |      3      |         3          | **Time Sink**     |
| **RF25** | Configurar parâmetros do sistema    |      3      |         3          | **Time Sink**     |

---

## 4.3. Priorização de Requisitos Não Funcionais (RNF)

| ID        | Nome do Requisito           | Valor (1-5) | Complexidade (1-5) | Quadrante de Ação |
| :-------- | :-------------------------- | :---------: | :----------------: | :---------------- |
| **RNF01** | Criptografia em Repouso     |      5      |         4          | **Major Project** |
| **RNF02** | Trilha de Auditoria (Logs)  |      5      |         3          | **Major Project** |
| **RNF03** | Expiração de Sessão         |      5      |         1          | **Quick Win**     |
| **RNF04** | Mascaramento de Dados       |      5      |         3          | **Major Project** |
| **RNF05** | Responsividade (PWA)        |      4      |         3          | **Major Project** |
| **RNF06** | Acessibilidade Digital      |      3      |         2          | **Fill In**       |
| **RNF07** | Desempenho de Carga Inicial |      4      |         3          | **Major Project** |
| **RNF08** | Desempenho de Gravação      |      4      |         2          | **Quick Win**     |
| **RNF09** | Concorrência de Acessos     |      3      |         3          | **Time Sink**     |
| **RNF10** | Disponibilidade (SLA)       |      4      |         4          | **Major Project** |
| **RNF11** | Rotina de Backup            |      5      |         2          | **Quick Win**     |
| **RNF12** | Documentação de APIs        |      4      |         2          | **Quick Win**     |
