# 2. Solução Proposta

## 2.1. Objetivo Geral do Produto

Desenvolver uma plataforma de gestão que centralize e organize as informações dos participantes e atividades da instituição, permitindo:

- O acompanhamento da frequência  

- A identificação de evasão  

- A geração de dados confiáveis para apoiar a tomada de decisão  

- O fortalecimento do relacionamento com os beneficiários


## 2.2. Objetivos Específicos do Produto

- **OE1**: Centralizar e estruturar os dados cadastrais das famílias atendidas, alunos, voluntários (instrutores) e diretoria.
- **OE2**: Monitorar a assiduidade e gerenciar a taxa de evasão dos alunos nos cursos e oficinas, permitindo intervenções rápidas.
- **OE3**: Apoiar a tomada de decisão estratégica da diretoria por meio de dados consolidados das ações da instituição.
- **OE4**: Fortalecer os vínculos institucionais, humanizando o relacionamento e o atendimento.

# 2.3 Características de Produto

Esta seção descreve as capacidades estruturais do sistema SGES focadas no valor de negócio e nas necessidades dos usuários, estabelecendo a rastreabilidade direta entre os Objetivos Específicos (OEs) da instituição e o catálogo de requisitos funcionais e não funcionais.

| OE Principal | Contribuição Secundária | ID | Característica | Descrição Resumida | Valor de Negócio Principal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **OE1** | OE3 | CP1 | **Segurança e Controle de Acessos** | Controlar os níveis de permissão de uso conforme o perfil do usuário e resguardar a privacidade das informações gravadas. | Proteção de dados das famílias atendidas e governança sobre quem visualiza ou altera as informações. |
| **OE1** | OE2 | CP2 | **Gestão de Instrutores** | Cadastrar, atualizar e acompanhar as informações da equipe de instrução e dos voluntários. | Organização da oferta de oficinas e controle das atribuições da equipe técnica. |
| **OE1** | OE4 | CP3 | **Cadastro Sociodemográfico** | Centralizar, atualizar e consultar as informações sociais, habitacionais e demográficas das famílias e beneficiários. | Centralização, confiabilidade do histórico das famílias e embasamento para um atendimento humanizado. |
| **OE2** | OE4 | CP4 | **Frequência e Engajamento** | Registrar de forma ágil a assiduidade diária e gerenciar a abertura de turmas, matrículas e limites de vagas. | Acompanhamento contínuo da participação dos alunos e otimização do aproveitamento das vagas abertas. |
| **OE2** | OE4 | CP5 | **Monitoramento de Evasão** | Identificar de forma automática padrões de ausência crônica e documentar os atendimentos de apoio realizados com as famílias. | Atuação preventiva para redução da evasão social e fortalecimento do vínculo protetivo com a comunidade. |
| **OE3** | OE1, OE2 | CP6 | **Relatórios e Transparência** | Consolidar dados estatísticos agregados e permitir a extração de informativos de impacto gerencial, preservando as identidades. | Subsídios para tomadas de decisão da diretoria e facilitação da prestação de contas para parceiros e doadores. |
| **OE3** | OE1 | CP7 | **Arquitetura e Performance** | Prover uma interface simples e de fácil compreensão, assegurando que o sistema permaneça disponível e de fácil manutenção continuada. | Baixa curva de aprendizado para a equipe e garantia de sustentabilidade da ferramenta a longo prazo. |

## 2.4. Tecnologias a Serem Utilizadas

A stack tecnológica foi selecionada para garantir alta produtividade, segurança de tipos e baixo custo de manutenção, atendendo aos desafios de usabilidade e restrição financeira da instituição.

- **Frontend:** React.js (Vite)
  - _Motivação:_ Criação de uma interface modular e reativa, garantindo simplicidade para voluntários e agilidade no carregamento em diferentes dispositivos.

- **Backend:** Node.js
  - _Motivação:_ Ambiente escalável que permite compartilhamento de lógica com o frontend, acelerando o desenvolvimento de funcionalidades críticas como importação de dados legados.

- **Linguagem:** TypeScript
  - _Motivação:_ Tipagem estática para reduzir erros em tempo de execução e garantir integridade dos dados sensíveis das famílias atendidas.

- **Banco de Dados:** PostgreSQL
  - _Motivação:_ SGBD relacional robusto para centralizar informações antes dispersas em planilhas, permitindo rastreabilidade e geração de relatórios complexos para a diretoria.

## 2.5. Pesquisa de Mercado e Análise Competitiva

Há no mercado softwares que podem agregar na solução dos problemas do cliente. Contudo, não se alinham em alguns interesses dos mesmos ou apresentam outros empecilhos pontuais.



### Salesforce Nonprofit

Plataforma baseada na nuvem projetada para organizações sem fins lucrativos.  

- **Pontos fortes:** Ferramentas para personalização e segmentação de doadores, integração eficaz com outras plataformas de comunicação e captação.  

- **Limitações:** Alto custo total, implementação longa, dependência técnica. Risco de subutilização devido à rotação de voluntários.



### Odoo

Software de gestão empresarial que integra todas as áreas da empresa em uma única plataforma.  

- **Pontos fortes:** Centraliza, automatiza e otimiza processos de negócios.  

- **Limitações:** Implementação longa, necessidade de suporte técnico constante, impacto da rotação de voluntários. Custo pode ser viável dependendo do contexto.



### SurveyCTO

Plataforma para coleta de dados com ferramentas integradas de monitoramento e visualização.  

- **Pontos fortes:** Bom para pesquisas.  

- **Limitações:** Alto custo para uso contínuo, não é sistema de gestão de beneficiários.


---



## SGES como solução



Além de ser financeiramente mais viável em comparação às plataformas citadas, o **SGES** irá centralizar dados que hoje ficam dispersos em cadernos e planilhas individuais, o que dificulta o acompanhamento de frequência dos alunos, evasão e histórico de participantes e voluntários.  



Os exemplos citados não satisfazem totalmente os interesses do cliente, sendo favoráveis apenas em alguns pontos.



### Benefícios práticos do SGES

- Organização dos dados de alunos e voluntários (nome, data de matrícula, frequência).  

- Geração de relatórios simples com esses dados.  

- Solução mais personalizada para o cliente em comparação com os outros softwares.

---

## Estimativa de custos da aplicação (após finalização da disciplina)

- **Backups em DB/VPS:** R$ 10 – 100/mês  

- **Hospedagem + banco gerenciado:** R$ 50 – 800/mês (dependendo do provedor e uso)  

- **SSL:** Certificados pagos variam de R$ 7,50 a 50/mês (dependendo do tipo)  

> ⚠️ Observação: São apenas estimativas. Os valores podem mudar durante o desenvolvimento e evolução da aplicação.

---

## 2.6. Viabilidade da Proposta

A viabilidade técnica do projeto é **média**.

- A maior parte dos membros domina as tecnologias escolhidas.
- Foram criadas funções e alocados responsáveis para auxiliar em dúvidas e evitar falhas de comunicação.
- Prazo estimado: **3 meses** para o desenvolvimento do MVP (Produto Mínimo Viável).
- Possibilidade de ajustes no cronograma devido a imprevistos ou necessidades de qualidade.
- Mão de obra no período da disciplina: custo R$ 0,00 para o cliente, pois o desenvolvimento será realizado por estudantes voluntários até a entrega do MVP.
- Continuidade pós-disciplina: antes do encerramento do projeto, deverá ser alinhado junto ao cliente um plano de continuidade com escopo de manutenção, como hospedagem e evolução da plataforma, além de opções de expansão para decisão formal, esta etapa envolverá custos ao cliente.
- Custos recorrentes mínimos de operação: restritos a registro de domínio e hospedagem e manutenção básica do site após fim da disciplina, a depender da disponibilidade de continuação dos integrantes do grupo.

## 2.7. Benefícios Esperados

- **Para alunos e participantes:**  
  Acompanhamento de registros de frequência, histórico de participação e atendimento.

- **Para instrutores:**  
  Maior praticidade e agilidade no uso das ferramentas de gestão.

- **Para gestores:**  
  Acesso a informações consolidadas para tomada de decisão, incluindo relatórios de participação e evasão.

## 2.8. Intervenção Social



O **SGES** não é apenas uma ferramenta de organização de dados. Ao ser introduzido no contexto da **Sociedade Espírita Auta de Souza (SEAS)**, ele se configura como uma intervenção social: uma mudança que tende a reorganizar práticas, relações, fluxos de informação e critérios de decisão dentro da instituição e em sua relação com os beneficiários.  



Os impactos pretendidos são as transformações deliberadamente buscadas pela solução, diretamente alinhadas aos **Objetivos Específicos** definidos na seção 2.2:



## Objetivos Específicos



- **Centralização e confiabilidade da informação (OE1):**  

  O SGES pretende substituir o fluxo descentralizado por um repositório único e consistente. Essa mudança reconfigura a forma como a instituição conhece seus próprios beneficiários e toma decisões baseadas nesse conhecimento.



- **Visibilidade da evasão e intervenção oportuna (OE2):**  

  O SGES pretende tornar mais perceptível o acompanhamento dos alunos, principalmente aqueles que se afastam silenciosamente sem que a instituição perceba a tempo de agir. A aplicação transforma dados de frequência em alertas acionáveis, mudando o papel dos gestores de reativos para proativos.



- **Apoio à decisão estratégica com dados (OE3):**  

  A diretoria atualmente toma decisões com base em percepções fragmentadas. O SGES pretende oferecer dados que sirvam de base para tomadas de decisões mais consistentes.



- **Fortalecimento do vínculo com os beneficiários (OE4):**  

  Ao registrar o histórico de participação e gerar alertas de relacionamento (como aniversários), o sistema busca humanizar o atendimento, transformando uma gestão predominantemente administrativa em uma gestão orientada ao cuidado com a trajetória individual de cada participante.



---



## Efeitos emergentes



Nem todos os impactos de uma intervenção social são pretendidos. Tendo isso em mente, a equipe identificou os seguintes efeitos emergentes que merecem atenção ao longo do desenvolvimento e da implantação:



- **Dependência de voluntários para operar o sistema:**  

  A SEAS depende fortemente de trabalho voluntário, com alta rotatividade. Se o sistema exigir curva de aprendizagem longa ou processos burocráticos, há risco de abandono ou subutilização. Esse risco é abordado pelo **RNF01 (Facilidade de Aprendizado)** e justifica a priorização de usabilidade.



- **Mudança no papel dos instrutores:**  

  Atualmente os instrutores registram presença em papel, de forma autônoma e sem padronização. Com o SGES, passam a operar um sistema digital com campos definidos, regras de acesso e fluxos padronizados. Essa mudança pode gerar resistência, especialmente entre voluntários mais antigos. É necessário considerar capacitação progressiva e adoção gradual.



- **Risco de exclusão digital dos beneficiários:**  

  Embora o sistema seja voltado para uso interno da equipe, funcionalidades futuras (como consulta de frequência pelos próprios alunos) podem esbarrar na vulnerabilidade digital de parte do público atendido.



- **Concentração de informação sensível:**  

  Ao centralizar dados de famílias em situação de vulnerabilidade, o SGES concentra informações sensíveis que, se mal gerenciadas, podem comprometer privacidade e segurança. Esse risco é reconhecido no **RNF02 (Segurança de Dados / LGPD)** e deve ser tratado como requisito de produto, não como detalhe de implementação.
