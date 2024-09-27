# Fullstack Challenge Angular

Este é um projeto fullstack criado como parte de um desafio de desenvolvimento. A aplicação envolve um frontend desenvolvido em Angular que se comunica com um backend Django para realizar operações CRUD (Criar, Ler, Atualizar, Excluir) sobre uma entidade chamada `Pessoa`. O projeto também inclui uma funcionalidade extra para calcular o peso ideal de uma pessoa com base na altura.

## Estrutura do Projeto

- **Frontend:** Angular 17.1.0

## Funcionalidades

A aplicação permite:
1. **Incluir**: Adicionar novas pessoas ao sistema.
2. **Alterar**: Atualizar as informações de uma pessoa existente.
3. **Excluir**: Remover pessoas cadastradas.
4. **Pesquisar**: Buscar por pessoas já cadastradas.
5. **Calcular Peso Ideal**: Baseado na fórmula do peso ideal para homens e mulheres.

### Fórmula do Peso Ideal:
- Para homens: `(72,7 * altura) - 58`
- Para mulheres: `(62,1 * altura) - 44,7`

## Instalação

Siga as etapas abaixo para configurar e rodar a aplicação localmente:

1. Clone o repositório:
    ```bash
    git clone <git@github.com:GeovanaAugusta/fullstack-challenge-angular.git>
    cd fullstack-challenge-angular
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Execute o servidor de desenvolvimento Angular:
    ```bash
    npm start
    ```

   O frontend estará acessível em `http://localhost:4200`.

4. Certifique-se de que o backend Django está rodando na porta 8000. O frontend se comunicará com o backend através de um proxy configurado em `proxy.conf.json`.

## Arquivo de Proxy

A comunicação entre o frontend e o backend é realizada via proxy. O arquivo `proxy.conf.json` está configurado como abaixo:

```json
{
    "/api/": {
      "target": "http://localhost:8000",
      "secure": false,
      "changeOrigin": true,
      "logLevel": "debug"
    }
}
