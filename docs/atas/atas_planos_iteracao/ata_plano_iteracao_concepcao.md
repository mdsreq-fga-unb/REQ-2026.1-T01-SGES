# **ATA DE PLANEJAMENTO DA ITERAÇÃO – FASE DE CONCEPÇÃO (ITERACAO 1)**

> **Rastreabilidade:** Esta ata documenta a execução da cerimônia **Plan Iteration (Planejamento da Iteração)** do processo OpenUP, correspondente ao marco inicial da Unidade 1.

**Data:** 23 de março de 2026  
**Local:** *Chamada de Áudio e Vídeo via Discord* **Pauta Principal:** Alinhamento de objetivos da iteração, avaliação de riscos iniciais e distribuição de Itens de Trabalho.

---

### **1. OBJETIVOS DA ITERAÇÃO**
A equipe avaliou o estado atual do projeto e definiu os seguintes objetivos de alto nível para serem alcançados até o fim desta janela de tempo:
1. Mapear o ecossistema e as partes interessadas do sistema SGES.
2. Identificar e documentar as restrições arquiteturais e de negócio iniciais.
3. Consolidar os requisitos elicitados em um Documento de Visão inicial estável.

---

### **2. AVALIAÇÃO E MITIGAÇÃO DE RISCOS**
Seguindo as diretrizes do OpenUP para gerenciamento focado em riscos, mapeamos os seguintes pontos críticos para esta iteração:

* **Risco 01: Escopo inflado ou desalinhado com o tempo da disciplina.**
    * *Ação de Mitigação:* Restringir as primeiras entrevistas apenas à diretoria (Jussara) para entender o "core" do problema social antes de expandir para os voluntários.
* **Risco 02: Curva de aprendizado com as ferramentas de documentação (MkDocs/Git Pages).**
    * *Ação de Mitigação:* Dedicar os primeiros dias à configuração local do ambiente de desenvolvimento por todos os membros da equipe.

---

### **3. DISTRIBUIÇÃO DOS ITENS DE TRABALHO (WORK ITEMS)**
Os micro-incrementos e tarefas necessários para atingir o objetivo foram priorizados e atribuídos aos membros do grupo:

| Item de Trabalho (Tarefa) | Responsável Principal | Artefato Gerado / Destino |
| :--- | :--- | :--- |
| Configuração e deploy do ambiente MkDocs local | Vinícius | Repositório GitHub (`mkdocs.yml`) |
| Elaboração do questionário e roteiro de entrevista | Equipe V | Canal de comunicação interno |
| Redação das seções de "Cenário Atual" e "Negócio" | Equipe V | `docs/cenario_atual_e_negocio.md` |
| Criação e refinamento do "Documento de Visão" | Vinícius | `docs/visao_projeto.md` |

---

### **4. CRITÉRIOS DE ACEITAÇÃO DA ITERAÇÃO (DoD Preliminar)**
Para que esta iteração seja considerada concluída e avaliada com sucesso (*Assess Iteration*), os seguintes critérios devem ser atendidos:
* [ ] Todos os documentos Markdown criados revisados e sem links quebrados (erros 404).
* [ ] Pipeline de deploy do Git Pages executando com sucesso em ambiente de produção.
* [ ] Escopo macro aceito de forma inequívoca pela cliente em ata de validação.

### **Evidência Visual do Quadro de Tarefas / Alinhamento**
![Quadro de Tarefas Inicial da Iteração](images/img_plano_iteracao1.png){width="500px"}