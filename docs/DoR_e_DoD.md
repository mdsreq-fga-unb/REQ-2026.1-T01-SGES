# 9. DoR e DoD

## 9.1. Definition of Ready (DoR)

O DoR delimita quando um requisito está preparado para ser trabalhado, permitindo que a equipe avalie o trabalho antes do início do desenvolvimento.

Para que um requisito seja considerado **Ready**, os seguintes critérios devem ser atendidos:

* O requisito está representado por um **Caso de Uso**?

* O requisito possui **Critérios de Aceitação** definidos?

* O requisito está no mesmo grau de abstração dos demais requisitos?

* O requisito foi estimado (uso de valores objetivos)?

* O requisito agrega valor e está associado a algum dos objetivos específicos da solução?

* As dependências do requisito estão devidamente mapeadas(caso existam)?

## 9.2. Definition of Done (DoD)

O DoD define os critérios necessários para que uma funcionalidade seja considerada completa, demonstrando a **qualidade do requisito produzido**.

Para que uma tarefa ou **Caso de Uso** seja considerado **Done**, todas as perguntas a seguir devem ser respondidas afirmativamente.

### 1. Entrega de Valor

* O trabalho realizado entrega um incremento funcional e observável ao produto?

* A entrega está claramente rastreada à sua origem, contendo referência ao Caso de Uso, requisito ou objetivo específico correspondente?

### 2. Cobertura dos Requisitos

* Todos os cenários descritos nos critérios de aceite foram implementados e podem ser demonstrados?

* Os cenários contemplam fluxos de sucesso, falha e alternativas de execução?

### 3. Qualidade de Testes

* Foram criados os testes unitários necessários para a funcionalidade desenvolvida?

* Os fluxos principais foram validados **manualmente** em um ambiente de teste, confirmando o comportamento esperado?

### 4. Revisão por Pares (Code Review)

* O Pull Request (PR) foi revisado e aprovado por pelo menos um outro integrante da equipe?

* A revisão de código validou os seguintes critérios essenciais:

    * **Conformidade:** o código segue os padrões estabelecidos pela equipe?

    * **Lógica:** a implementação atende corretamente aos requisitos definidos?

    * **Legibilidade:** o código está claro, bem nomeado e de fácil manutenção?

    * **Segurança:** não há exposição de dados sensíveis, como senhas ou tokens?

### 5. Documentação

* A **documentação técnica** foi atualizada de acordo com as alterações realizadas no sistema.
