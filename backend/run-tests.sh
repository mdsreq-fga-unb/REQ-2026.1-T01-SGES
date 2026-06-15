#!/bin/bash
set -euo pipefail

function cleanup {
  echo "Derrubando container de teste..."
  make down-test
}
trap cleanup EXIT

echo "Subindo container de teste do PostgreSQL..."
make up-test

echo "Aguardando o container de teste estar pronto..."
sleep 5

echo "Executando testes..."
make test TEST_ARGS="$@"