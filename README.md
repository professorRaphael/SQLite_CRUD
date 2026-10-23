# 🎮 Controle de Jogos — React Native + Expo SQLite

Projeto desenvolvido como **material didático para a disciplina de Programação para Dispositivos Móveis em Android**, dos cursos de graduação da Estácio.

A aplicação permite gerenciar uma coleção de jogos diretamente no dispositivo, utilizando **React Native, TypeScript e SQLite**. O objetivo principal é demonstrar, de maneira prática, como realizar operações de **CRUD** (*Create, Read, Update e Delete*) com persistência local.

> **Importante:** este é um projeto de ensino, não uma aplicação comercial pronta. Sua implementação foi mantida propositalmente enxuta para facilitar o acompanhamento em sala e servir de ponto de partida para melhorias feitas pelos alunos.

## 🎯 Objetivos de aprendizagem

Ao estudar e executar este exemplo, o aluno deverá ser capaz de:

- Entender a diferença entre o estado de um componente e os dados persistidos no dispositivo.
- Inicializar um banco SQLite e criar uma tabela, caso ela ainda não exista.
- Realizar operações de inserção, consulta, atualização e exclusão de registros.
- Executar operações assíncronas utilizando `async` e `await`.
- Usar parâmetros em consultas SQL, em vez de concatenar valores digitados pelo usuário.
- Integrar formulários, listagem e ações do usuário à camada de persistência.
- Identificar possibilidades de evolução e modularização de um aplicativo React Native.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
| --- | --- |
| **React Native** | Construção da interface mobile. |
| **Expo** | Ambiente de desenvolvimento e execução do aplicativo. |
| **TypeScript** | Tipagem dos dados e das funções. |
| **Expo SQLite (`expo-sqlite`)** | Banco de dados relacional local. |
| **React Hooks** | Controle de estado (`useState`) e inicialização (`useEffect`). |
| **React Native Safe Area Context** | Respeito às áreas seguras da tela. |

## ✅ Funcionalidades implementadas

- **Cadastrar jogos:** informar nome, plataforma e nota de 0 a 10.
- **Listar jogos:** exibir os registros salvos em ordem alfabética.
- **Pesquisar:** filtrar jogos pelo nome.
- **Editar:** carregar um jogo no formulário e salvar suas alterações.
- **Excluir:** solicitar confirmação antes de remover um registro.
- **Persistir os dados:** manter os jogos salvos mesmo após fechar e reabrir o aplicativo, enquanto os dados locais forem preservados.
- **Tratar erros básicos:** apresentar mensagens quando uma operação não puder ser concluída.

O exemplo utiliza **uma única tela**, para manter a atenção na persistência de dados. **Não há autenticação, navegação entre telas, API remota ou sincronização com a nuvem** nesta versão.

## 📁 Estrutura do projeto

```text
controle-jogos/
├── App.tsx                # Interface, formulário, listagem e eventos
└── src/
    └── database.ts       # Definição do jogo e operações com SQLite
```

A estrutura é pequena de propósito. Conforme a aplicação crescer, será possível separar telas, componentes, serviços e outras responsabilidades.

## 🚀 Como executar

### Pré-requisitos

- Node.js e npm instalados.
- Um dispositivo Android com **Expo Go** ou um emulador Android configurado para executar o projeto Expo.

### 1. Criar o projeto Expo com TypeScript

```bash
npx create-expo-app controle-jogos --template blank-typescript
cd controle-jogos
```

### 2. Instalar as dependências do exemplo

```bash
npx expo install expo-sqlite react-native-safe-area-context
```

### 3. Copiar os arquivos da aula

Substitua o `App.tsx` criado pelo Expo pelo `App.tsx` deste material. Depois, crie a pasta `src` e coloque nela o arquivo `database.ts`.

### 4. Iniciar o aplicativo

```bash
npx expo start
```

Abra o aplicativo no dispositivo ou emulador disponível no seu ambiente de desenvolvimento.

> **Dica:** se estiver utilizando uma cópia já montada do projeto Expo, instale as dependências com `npm install` antes de iniciar.

## 🗄️ Como o SQLite é utilizado

Ao iniciar a aplicação, a função `iniciarBanco()` cria a tabela `jogos` se ela ainda não existir:

```sql
CREATE TABLE IF NOT EXISTS jogos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  plataforma TEXT NOT NULL,
  nota REAL NOT NULL CHECK (nota >= 0 AND nota <= 10)
);
```

As principais operações estão concentradas em `src/database.ts`:

| Função | Operação SQL | Responsabilidade |
| --- | --- | --- |
| `iniciarBanco()` | `CREATE TABLE` | Preparar o banco local. |
| `listarJogos(busca)` | `SELECT` | Consultar e filtrar os jogos. |
| `salvarJogo(dados, id?)` | `INSERT` ou `UPDATE` | Cadastrar ou alterar um jogo. |
| `excluirJogo(id)` | `DELETE` | Remover um jogo pelo identificador. |

O arquivo utiliza os métodos assíncronos `openDatabaseAsync()`, `execAsync()`, `getAllAsync()` e `runAsync()` da biblioteca `expo-sqlite`.

**Atenção:** o `execAsync()` recebe apenas comandos SQL fixos nesta implementação. Para valores enviados pelo usuário, as operações usam parâmetros (`?`), evitando montar consultas por concatenação de strings.

## 🧪 Roteiro de testes em sala

1. Inicie o aplicativo e cadastre dois ou três jogos de plataformas diferentes.
2. Faça uma busca pelo nome de um dos jogos.
3. Edite a nota de um jogo e confirme se a alteração aparece na listagem.
4. Exclua um jogo, observando a mensagem de confirmação.
5. Feche e abra novamente o aplicativo e verifique se os registros restantes continuam disponíveis.
6. Tente informar uma nota inválida, como `11`, e observe a validação.

Esses são **testes manuais sugeridos**, não uma suíte automatizada incluída no projeto.

## 📚 Desafios para os alunos

A intenção **não é parar no código entregue**. Depois de compreenderem o exemplo, os alunos deverão propor e implementar melhorias.

### Nível 1 — Evolução do cadastro

- Acrescentar os campos **gênero** e **descrição** (*sobre*) ao cadastro.
- Adicionar um filtro por plataforma.
- Implementar ordenação dos jogos por nota.

### Nível 2 — Organização do projeto

- Separar o formulário e a listagem em componentes reutilizáveis.
- Criar telas independentes para cadastro, consulta e edição.
- Utilizar uma biblioteca de navegação entre telas.

### Nível 3 — Persistência mais robusta

- Planejar uma **migração do esquema** para incluir campos sem perder os jogos já cadastrados.
- Criar testes para as funções da camada de banco de dados.
- Estudar autenticação e associação de jogos a diferentes usuários, respeitando os requisitos de segurança.

> **Desafio principal:** transforme este exemplo de uma tela em um pequeno aplicativo de gerenciamento de coleção, **preservando o funcionamento do CRUD e os dados já armazenados**.

## ⚠️ Limitações e cuidados

- O SQLite armazena os dados **localmente**; não fornece sincronização automática entre dispositivos.
- O projeto não implementa login nem controla o acesso de diferentes usuários aos registros.
- Alterar a estrutura da tabela exige planejamento: `CREATE TABLE IF NOT EXISTS` não migra automaticamente uma tabela existente.
- Para um sistema real com autenticação, **não armazene senhas em texto puro** nem utilize SHA-256 simples como substituto de um mecanismo apropriado de armazenamento de senhas.
- O banco local não substitui uma estratégia de backup ou sincronização quando esses recursos são necessários.

## 🔗 Referências

- [Documentação do Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Documentação do React Native](https://reactnative.dev/)
- [Documentação do SQLite](https://www.sqlite.org/docs.html)
- [React Native Safe Area Context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)

---

**Material para fins educacionais — Programação para Dispositivos Móveis em Android**
**Prof. Raphael M. S. de Jesus — Estácio**
