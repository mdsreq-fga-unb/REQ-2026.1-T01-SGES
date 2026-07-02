# **ATA DE PLANEJAMENTO DA ITERAÇÃO – FASE DE ELABORAÇÃO (UNIDADE 2)**

> **Rastreabilidade:** Esta ata documenta a execução da cerimônia **Plan Iteration (Planejamento da Iteração)** do processo OpenUP, correspondente ao marco inicial da Unidade 2.

**Data:** 17 de abril de 2026  
**Local:** *Chamada de Áudio e Vídeo via Discord* **Pauta Principal:** Definição do escopo do MVP, elicitação detalhada de requisitos funcionais e não-funcionais, e estabilização da linha de base da arquitetura.

---

### **1. OBJETIVOS DA ITERAÇÃO**
A equipe avaliou o encerramento da fase de Concepção e estabeleceu as metas cruciais para a consolidação técnica do projeto na Elaboração:</br>
1. **Definição e Alinhamento do MVP:** Elicitar e detalhar as regras de negócio indispensáveis para a primeira entrega funcional do sistema SGES.
</br>
2. **Representação e Organização de Requisitos:** Estruturar a modelagem de Casos de Uso e priorizar os Itens de Trabalho.
</br>
3. **Modelagem de Domínio e Arquitetura:** Mapear a análise de domínio para garantir a centralização segura dos dados e usabilidade voltada para voluntários.

---

### **2. GERENCIAMENTO DE RISCOS DA FASE**
Com base na transição de fase, o gerenciamento de riscos do OpenUP foi atualizado com foco em aspectos técnicos e de requisitos:

* **Risco 03: Ambiguidade ou inconsistência nas regras de negócio da instituição.**
    * *Ação de Mitigação:* Aplicar a técnica de matriz Valor x Esforço de priorização junto aos stakeholders para congelar o escopo do MVP e reduzir o retrabalho na Construção.
* **Risco 04: Falha na usabilidade e acessibilidade das telas pelos voluntários.**
    * *Ação de Mitigação:* Realizar discussões internas em equipe focadas em análise de tarefas, refinando a complexidade dos fluxos antes da codificação.

---

### **3. DISTRIBUIÇÃO DOS ITENS DE TRABALHO (WORK ITEMS)**
Os itens de trabalho para este ciclo foram organizados com foco em Engenharia de Requisitos e Arquitetura:

| Item de Trabalho (Tarefa) | Responsável Principal | Artefato Gerado / Destino |
| :--- | :--- | :--- |
| Aplicação da técnica MoSCoW e refinamento do escopo | Equipe V | `docs/matriz_de_acao_e_priorizacao.md` |
| Detalhamento e modelagem inicial da Lista de Requisitos | Vinícius | `docs/lista_requisitos.md` |
| Estruturação das diretrizes arquiteturais e usabilidade | Equipe V | `docs/arquitetura_do_produto.md` |
| Criação e mapeamento dos esqueletos de Casos de Uso | Vinícius | Pasta `docs/lista_trabalhos/` |
| Definição dos critérios de DoR (*Definition of Ready*) e DoD | Equipe V | `docs/DoR_e_DoD.md` |

---

### **4. CRITÉRIOS DE ACEITAÇÃO DA ITERAÇÃO (Marco da Linha de Base da Arquitetura)**
Para que a fase de Elaboração seja homologada com sucesso na Unidade 2, a equipe deve atingir o seguinte patamar:
</br>
* [x] Lista de requisitos e itens de trabalho priorizados sem ambiguidades.
</br>
* [x] Proposta conceitual do MVP aprovada internamente e metas do produto estabilizadas.
</br>
* [x] Estrutura de navegação dos Casos de Uso mapeada no `mkdocs.yml` (pronta para receber os fluxos na fase de Construção).

### **Evidência Visual do Quadro de Tarefas / Alinhamento Técnico**
![Quadro de Tarefas da Elaboração](images/img_plano_elaboracao.png){width="500px"}