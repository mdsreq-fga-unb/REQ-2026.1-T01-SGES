# Estrutura do Projeto — Contexto para IA

Resumo curto:
- Arquitetura: Hexagonal (Ports & Adapters). O núcleo da aplicação contém a *domain* (modelo e regras) e *application* (casos de uso). Todas as dependências externas (HTTP, BD, logger, config, infra) são implementadas como *adapters* na camada de *infra* e expostas via *ports*.

Princípios principais:
- `domain`: regras e entidades puras, sem dependências de frameworks.
- `application`: casos de uso e interfaces de serviços (services/interactors) que orquestram `domain` via interfaces (ports).
- `api` / `adapters/http`: adaptadores de entrada (HTTP/REST), traduzem requests para chamadas aos casos de uso.
- `infra` / `adapters/*`: adaptadores de saída (ORM, logger, envio de e-mail, repositórios), implementam as interfaces (ports) exigidas pelos casos de uso.
- `config` / `env`: configurações e mapeamentos de implantação mantidos separados e injetados pelas camadas externas.

Diagrama de módulos (resumo de pastas):

backend/
- src/
	- domain/                # Entidades, Value Objects, regras do domínio
	- application/           # Casos de uso (services, ports interfaces)
	- api/                   # Adaptador de entrada: rotas, controllers, middleware
		- routes/
			- health.ts
			- index.ts
		- index.ts
	- infra/                 # Adaptadores de saída (adapters)
		- orm/                 # datasource, repositórios concretos
		- logger/              # implementação do logger
		- postgres/            # scripts/fixtures/dump (se aplicável)
	- env/                   # carregamento/valores de ambiente
	- build/                 # artefatos de build/entrypoints (p.ex. server.mjs)
	- tests/                 # testes de integração/unidade (organizados por módulo)

Outras pastas relevantes:
- docker-compose*.yml      # orquestração para dev/test
- scripts (run-tests.sh)   # comandos utilitários
- .context/                # arquivos de contexto (este arquivo)

Como usar este arquivo (para IA):
- Mapear perguntas para camadas: dúvidas sobre regras → `domain`; sobre fluxos e orquestração → `application`; sobre endpoints/contratos HTTP → `api`; sobre persistência ou integrações externas → `infra`.
- Identificar ports (interfaces) na `application` e procurar implementações correspondentes em `infra`.

Breve nota: adote injeção de dependências simples (construtores/factories) para conectar `application` ↔ `infra` no início da aplicação (`src/index` / `build/server.mjs`).

