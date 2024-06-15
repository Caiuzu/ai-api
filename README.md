# AI API : Gerando texto com o modelo Gemini

Esta API Node.js usa o modelo Gemini do Google Cloud para gerar texto baseado em prompts, oferecendo personalização e controle sobre o processo de geração.

## **Funcionalidades:**

- **Geração de texto:** Permite gerar texto com base em um prompt fornecido pelo usuário.
- **Personalização da geração:** Permite ajustar a criatividade, variedade e tamanho do texto usando a configuração `generationConfig`.
- **Logs com Winston:** Implementa logs coloridos e personalizados com o Winston, similar ao estilo do NestJS, proporcionando informações detalhadas sobre a execução da API.
- **Documentação do Swagger:** Fornece documentação interativa da API usando o Swagger, facilitando a compreensão e o uso da API.

## **Requisitos:**

* Node.js (versão 16 ou superior)
* npm (ou yarn)
* Uma conta no Google Cloud
* Uma chave da API do Google Cloud para o serviço "Generative Language"

## **Configuração:**

1. **Criar uma conta no Google Cloud:** Acesse o site do Google Cloud e crie uma conta gratuita.
2. **Criar um projeto no Google Cloud:** Acesse o Google Cloud Console e crie um novo projeto.
3. **Habilitar o serviço "Generative Language":** No console do projeto, habilite o serviço "Generative Language".
4. **Criar uma chave da API:** No console do projeto, acesse a seção "APIs e serviços" -> "Credenciais" e crie uma chave da API com as permissões necessárias para usar o modelo Gemini.
5. **Configurar o arquivo `.env`:** Crie um arquivo `.env` na raiz do projeto e adicione a seguinte linha, substituindo `sua_chave_api` pela sua chave da API real:
   ```
   API_KEY=sua_chave_api
   ```
6. **Instalar as dependências:** Execute o seguinte comando no terminal:
   ```bash
   npm install
   ```

## **Início:**

1. **Executar o servidor:** Execute o seguinte comando no terminal:
   ```bash
   npm run start:dev
   ```
2. **Acessar a API:** A API estará disponível em `http://localhost:3000/`.
3. **Acessar a documentação do Swagger:** Acesse `http://localhost:3000/api-docs` para visualizar a documentação da API.

## **Uso:**

Para usar a API, faça uma requisição `POST` para `/generate` com o seguinte corpo JSON:

```json
{
  "prompt": "Escreva um conto sobre um gato que viaja no tempo."
}
```

**Exemplo de requisição `curl`:**

```bash
curl -X 'POST' \
  'http://localhost:3000/generate' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "prompt": "Escreva um conto sobre um gato que viaja no tempo."
}'
```

## **Personalização da Geração:**

A API permite personalizar a geração de texto usando a configuração `generationConfig`, que controla diversos parâmetros:

* **`temperature`:** Controla a criatividade do modelo. 
    * **Valores mais altos (próximos a 1):** Resultam em texto mais criativo e imprevisível, com maior probabilidade de frases inusitadas e ideias originais.
    * **Valores mais baixos (próximos a 0):** Resultam em texto mais previsível e semelhante ao prompt, com menos chance de frases surpreendentes.

* **`topP` e `topK`:**  Controlam a variedade de palavras. Ambos os parâmetros funcionam de forma semelhante, mas com nuances:
    * `topP` seleciona um conjunto de palavras com uma determinada probabilidade cumulativa. Valores mais altos permitem uma variedade maior de palavras, incluindo palavras menos frequentes.
    * `topK` seleciona as `K` palavras com maior probabilidade. Valores mais altos também permitem uma variedade maior de palavras.

* **`maxOutputTokens`:**  Define o tamanho máximo do texto gerado em tokens. 
    * **Um token corresponde aproximadamente a uma palavra:** Um texto com 100 tokens terá cerca de 100 palavras. 
    * Aumente esse valor para gerar textos mais longos.

* **`responseMimeType`:** Define o tipo de resposta. 
    * **"text/plain"** gera texto puro, sem formatação adicional.
    * **"text/html"** gera texto com formatação HTML.
    * **"text/markdown"** gera texto com formatação Markdown.

**Exemplo de requisição `curl` com personalização:**

```bash
curl -X 'POST' \
  'http://localhost:3000/generate' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "prompt": "Escreva um conto sobre um gato que viaja no tempo.",
  "temperature": 0.5,
  "topP": 0.8,
  "maxOutputTokens": 200,
  "responseMimeType": "text/markdown"
}'
```

**Resposta:**

A API retornará uma resposta JSON com o texto gerado pelo modelo Gemini.

## **Logs:**

Os logs da API serão gravados no console e em um arquivo chamado `logs/combined.log`.

## **Contribuições:**

Contribuições são bem-vindas! Você pode abrir uma issue ou enviar um pull request no GitHub.

## **Licença:**

Este projeto é licenciado sob a licença MIT.
