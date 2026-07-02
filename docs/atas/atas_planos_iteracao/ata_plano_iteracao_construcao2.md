# **ATA DE PLANEJAMENTO DA ITERAÇÃO – FASE DE CONSTRUÇÃO (ITERACAO 2 - UNIDADE 4)**

> **Rastreabilidade:** Esta ata documenta a execução da cerimônia **Plan Iteration (Planejamento da Iteração)** do processo OpenUP, correspondente ao marco unificado da Unidade 4 (Parte 1 e Parte 2).

**Data:** 12 de junho de 2026  
**Local:** *Chamada de Áudio e Vídeo via Discord* **Pauta Principal:** Planejamento do fluxo operacional de chamadas, estruturação de relatórios consolidados e implementação dos mecanismos de inteligência de negócio contra a evasão.

---

### **1. OBJETIVOS DA ITERAÇÃO**
Aproveitando a base operacional segura construída na primeira iteração, a equipe estabeleceu as seguintes metas para a conclusão do desenvolvimento do MVP:
<br/>
1. **Estruturação de Fluxos Críticos:** Mapear e implementar as rotinas de matrículas, tratamento de faltas e exceções do dia a dia da instituição.
<br/>
2. **Módulo de Relatórios Gerenciais:** Desenvolver painéis consolidados para visualização ágil da frequência das turmas por parte dos instrutores voluntários.
<br/>
3. **Inteligência contra Evasão:** Implementar regras de negócio com sinalização visual automática para alertar a diretoria sobre participantes em situação de risco por ausência consecutiva.

---

### **2. GERENCIAMENTO DE RISCOS DA FASE**
Com a proximidade da entrega final e do período de homologação, o mapeamento de riscos focou na facilidade de uso e integridade do produto:

* **Risco 07: Complexidade no registro diário de chamadas pelos instrutores voluntários.**
    * *Ação de Mitigação:* Conduzir simulações práticas de fluxo de uso em ambiente controlado para avaliar a agilidade, clareza e facilidade da interface de chamada.
* **Risco 08: Falhas na integridade dos dados históricos de frequência.**
    * *Ação de Mitigação:* Aplicar inspeções de código rigorosas e testes automatizados de persistência de dados antes de submeter o sistema para a homologação final.

---

### **3. DISTRIBUIÇÃO DOS ITENS DE TRABALHO (WORK ITEMS)**
Os itens de trabalho cobrem o fechamento do escopo dos Casos de Uso finais (CSU12 a CSU16):

| Item de Trabalho (Tarefa) | Responsável Principal | Artefato Gerado / Destino |
| :--- | :--- | :--- |
| Desenvolvimento do módulo de matrícula e tratamento de exceções | Equipe V | Repositório de Código / Fluxos do Sistema |
| Implementação do painel visual de alertas de risco de evasão | Vinícius | Painéis de BI / Interface de Gestão |
| Detalhamento e documentação dos fluxos de Casos de Uso (CSU12 a CSU16) | Vinícius | Pastas específicas em `docs/lista_trabalhos/` |
| Revisão interna completa de requisitos implementados (DoD) | Equipe V | Inspeção de Software / Linha de Base Final |

---

### **4. CRITÉRIOS DE ACEITAÇÃO DA ITERAÇÃO (Marco de Conclusão de Funcionalidades)**
Para que esta iteração seja encerrada em 01/07 e o sistema avance pronto para a fase de Transição, os seguintes critérios são obrigatórios:<br/>
* [X] 100% dos requisitos funcionais previstos implementados, integrados e testados pela equipe.<br/>
* [ ] Ambiente de simulação operacional validado internamente com instrutores fictícios.<br/>
* [X] Todos os links dos casos de uso (CSU01 a CSU16) totalmente funcionais e operando sem erros 404 na tabela de cronograma.

