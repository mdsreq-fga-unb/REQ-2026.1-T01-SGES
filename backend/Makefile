up-test:
	docker-compose -f docker-compose.test.yml --project-name req-sges-test up -d

down-test:
	docker-compose -f docker-compose.test.yml --project-name req-sges-test down

test:
	@set -o allexport; \
	. ./env/.env.test > /dev/null 2>&1; \
	export POSTGRES_URL=postgresql://teste:teste@localhost:5432/teste; \
	vitest --max-concurrency=1 --no-cache $(TEST_ARGS)
	