# REQ-2026.1-T01-SGES
Repositório de projeto da disciplina de REQ-T1, 2026.1

## Desenvolvimento Local

Para rodar a documentação localmente, siga os passos abaixo:

1. **Criar o ambiente virtual:**
   ```bash
   python3 -m venv venv
   ```

2. **Ativar o ambiente virtual:**
   - No Linux/macOS: `source venv/bin/activate`
   - No Windows: `venv\Scripts\activate`

3. **Instalar as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Rodar o MkDocs:**
   ```bash
   ./docs_start.sh
   ```
   Ou manualmente: `mkdocs serve`
