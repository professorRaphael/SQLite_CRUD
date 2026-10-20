import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  excluirJogo,
  iniciarBanco,
  listarJogos,
  salvarJogo,
} from "./src/database";
import type { Jogo } from "./src/database";

export default function App() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [nome, setNome] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [nota, setNota] = useState("");
  const [busca, setBusca] = useState("");
  const [idEmEdicao, setIdEmEdicao] = useState<number | undefined>();
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);

  async function atualizarLista(termo = busca) {
    const dados = await listarJogos(termo);
    setJogos(dados);
  }

  useEffect(() => {
    async function iniciar() {
      try {
        await iniciarBanco();
        await atualizarLista("");
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível abrir o banco de dados.");
      } finally {
        setCarregando(false);
      }
    }
    void iniciar();
  }, []);

  function limparFormulario() {
    setNome("");
    setPlataforma("");
    setNota("");
    setIdEmEdicao(undefined);
  }

  async function gravar() {
    const notaNumero = Number(nota.replace(",", "."));
    if (
      !nome.trim() ||
      !plataforma.trim() ||
      !nota.trim() ||
      !Number.isFinite(notaNumero) ||
      notaNumero < 0 ||
      notaNumero > 10
    ) {
      Alert.alert(
        "Dados inválidos",
        "Informe nome, plataforma e nota de 0 a 10.",
      );
      return;
    }

    setOcupado(true);
    try {
      await salvarJogo(
        { nome: nome.trim(), plataforma: plataforma.trim(), nota: notaNumero },
        idEmEdicao,
      );
      limparFormulario();
      await atualizarLista();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o jogo.");
    } finally {
      setOcupado(false);
    }
  }

  function editar(jogo: Jogo) {
    setIdEmEdicao(jogo.id);
    setNome(jogo.nome);
    setPlataforma(jogo.plataforma);
    setNota(String(jogo.nota));
  }

  function pedirExclusao(jogo: Jogo) {
    Alert.alert("Excluir jogo", `Excluir "${jogo.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          void remover(jogo.id);
        },
      },
    ]);
  }

  async function remover(id: number) {
    setOcupado(true);
    try {
      await excluirJogo(id);
      if (idEmEdicao === id) limparFormulario();
      await atualizarLista();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível excluir o jogo.");
    } finally {
      setOcupado(false);
    }
  }

  async function pesquisar() {
    try {
      await atualizarLista();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível consultar os jogos.");
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.tela}>
        <FlatList
          data={jogos}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.conteudo}
          ListHeaderComponent={
            <View>
              <Text style={s.titulo}>Minha coleção de jogos</Text>
              <Text style={s.subtitulo}>CRUD local com Expo SQLite</Text>
              <View style={s.cartao}>
                <Text style={s.secao}>
                  {idEmEdicao === undefined
                    ? "Cadastrar jogo"
                    : `Editar jogo #${idEmEdicao}`}
                </Text>
                <TextInput
                  style={s.entrada}
                  placeholder="Nome do jogo"
                  value={nome}
                  onChangeText={setNome}
                  editable={!ocupado}
                />
                <TextInput
                  style={s.entrada}
                  placeholder="Plataforma (PC, Switch...)"
                  value={plataforma}
                  onChangeText={setPlataforma}
                  editable={!ocupado}
                />
                <TextInput
                  style={s.entrada}
                  placeholder="Nota de 0 a 10"
                  keyboardType="decimal-pad"
                  value={nota}
                  onChangeText={setNota}
                  editable={!ocupado}
                />
                <Pressable
                  style={s.botao}
                  onPress={() => {
                    void gravar();
                  }}
                  disabled={ocupado || carregando}
                >
                  <Text style={s.textoBotao}>
                    {idEmEdicao === undefined
                      ? "Adicionar jogo"
                      : "Salvar alterações"}
                  </Text>
                </Pressable>
                {idEmEdicao !== undefined && (
                  <Pressable onPress={limparFormulario} disabled={ocupado}>
                    <Text style={s.link}>Cancelar edição</Text>
                  </Pressable>
                )}
              </View>
              <View style={s.buscaLinha}>
                <TextInput
                  style={[s.entrada, s.busca]}
                  placeholder="Buscar por nome"
                  value={busca}
                  onChangeText={setBusca}
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    void pesquisar();
                  }}
                />
                <Pressable
                  style={s.botaoBusca}
                  onPress={() => {
                    void pesquisar();
                  }}
                >
                  <Text style={s.textoBotao}>Buscar</Text>
                </Pressable>
              </View>
              <Text style={s.secao}>Jogos cadastrados</Text>
              {carregando && <ActivityIndicator size="large" />}
            </View>
          }
          ListEmptyComponent={
            !carregando ? (
              <Text style={s.vazio}>Nenhum jogo encontrado.</Text>
            ) : undefined
          }
          renderItem={({ item }) => (
            <View style={s.jogo}>
              <View style={s.jogoInfo}>
                <Text style={s.nomeJogo}>{item.nome}</Text>
                <Text style={s.detalhe}>
                  {item.plataforma} • Nota {item.nota}
                </Text>
              </View>
              <Pressable onPress={() => editar(item)} disabled={ocupado}>
                <Text style={s.acao}>Editar</Text>
              </Pressable>
              <Pressable onPress={() => pedirExclusao(item)} disabled={ocupado}>
                <Text style={[s.acao, s.excluir]}>Excluir</Text>
              </Pressable>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#f1f5f9" },
  conteudo: { padding: 18, paddingBottom: 40, gap: 10 },
  titulo: { fontSize: 26, fontWeight: "800", color: "#103c62" },
  subtitulo: { color: "#64748b", marginBottom: 16 },
  cartao: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    gap: 10,
    marginBottom: 15,
    elevation: 2,
  },
  secao: { fontSize: 18, fontWeight: "700", color: "#123954", marginBottom: 8 },
  entrada: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    height: 45,
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 9,
  },
  botao: {
    backgroundColor: "#135b91",
    padding: 13,
    borderRadius: 9,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "700" },
  link: { color: "#135b91", textAlign: "center", padding: 6 },
  buscaLinha: { flexDirection: "row", gap: 8 },
  busca: { flex: 1 },
  botaoBusca: {
    backgroundColor: "#135b91",
    borderRadius: 9,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  jogo: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  jogoInfo: { flex: 1 },
  nomeJogo: { fontWeight: "700", fontSize: 16, color: "#0f172a" },
  detalhe: { color: "#64748b", marginTop: 4 },
  acao: { fontWeight: "700", color: "#135b91" },
  excluir: { color: "#b91c1c" },
  vazio: { color: "#64748b", textAlign: "center", padding: 24 },
});
