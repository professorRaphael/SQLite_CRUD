import * as SQLite from 'expo-sqlite';

export type Jogo = {
  id: number;
  nome: string;
  plataforma: string;
  nota: number;
};

export type DadosJogo = Omit<Jogo, 'id'>;

// Uma conexão reutilizada por todas as operações do exemplo.
const bancoPromise = SQLite.openDatabaseAsync('controle-jogos.db');

export async function iniciarBanco(): Promise<void> {
  const banco = await bancoPromise;
  // execAsync é usado somente com SQL fixo (sem texto do usuário).
  await banco.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS jogos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      plataforma TEXT NOT NULL,
      nota REAL NOT NULL CHECK (nota >= 0 AND nota <= 10)
    );
  `);
}

export async function listarJogos(busca = ''): Promise<Jogo[]> {
  const banco = await bancoPromise;
  return banco.getAllAsync<Jogo>(
    `SELECT id, nome, plataforma, nota
     FROM jogos
     WHERE nome LIKE ?
     ORDER BY nome COLLATE NOCASE;`,
    `%${busca.trim()}%`
  );
}

export async function salvarJogo(
  dados: DadosJogo,
  id?: number
): Promise<void> {
  const banco = await bancoPromise;
  if (id !== undefined) {
    await banco.runAsync(
      'UPDATE jogos SET nome = ?, plataforma = ?, nota = ? WHERE id = ?;',
      dados.nome, dados.plataforma, dados.nota, id
    );
  } else {
    await banco.runAsync(
      'INSERT INTO jogos (nome, plataforma, nota) VALUES (?, ?, ?);',
      dados.nome, dados.plataforma, dados.nota
    );
  }
}

export async function excluirJogo(id: number): Promise<void> {
  const banco = await bancoPromise;
  await banco.runAsync('DELETE FROM jogos WHERE id = ?;', id);
}
