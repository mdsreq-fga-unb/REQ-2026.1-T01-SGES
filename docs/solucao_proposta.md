# 2. Solução Proposta

## 2.1. Objetivo Geral do Produto

O objetivo geral do produto é focado em uma **visão orientada ao usuário**. A plataforma entregará valor ao focar em "o quê" precisa ser resolvido (centralizar informações e prover rastreabilidade), sem impor restrições de como a solução técnica será implementada prematuramente, permitindo futura evolução tecnológica.

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

Existem softwares no mercado que podem ajudar a resolver os problemas do cliente. Contudo, não se alinham totalmente aos interesses ou apresentam empecilhos específicos.

- **Salesforce Nonprofit:**  
  Plataforma em nuvem para organizações sem fins lucrativos. Oferece personalização e integração com ferramentas de comunicação e captação.  
  _Limitações:_ Alto custo total, implementação longa, dependência técnica e risco de subutilização devido à rotatividade de voluntários.

- **Odoo:**  
  Software de gestão empresarial que integra áreas em uma única plataforma.  
  _Limitações:_ Custo elevado, implementação longa e necessidade de suporte técnico para funcionar bem com voluntários.

- **SurveyCTO:**  
  Plataforma de coleta de dados com ferramentas de monitoramento e visualização.  
  _Limitações:_ Bom para pesquisa, mas caro para uso contínuo e não é sistema de gestão de beneficiários.

➡️ O **SGES** se mostra financeiramente mais viável, centralizando dados que hoje estão dispersos em cadernos e planilhas, o que dificulta o acompanhamento de frequência, evasão e histórico de participantes e voluntários. Já os exemplos citados não satisfazem totalmente os interesses do cliente.

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
