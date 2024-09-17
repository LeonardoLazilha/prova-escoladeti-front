import React, { useEffect, useState } from "react";
import './ComputadorList.css';
import axios from "axios";

const ComputadorList = () => {
  const [computadores, setComputadores] = useState([]);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("");
  const [perifericos, setPerifericos] = useState([{ nome: "" }]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/computador")
      .then((response) => setComputadores(response.data))
      .catch((error) => console.error("Erro ao buscar computadores:", error));
  }, []);

  const salvarComputador = (e) => {
    e.preventDefault();
    const novoComputador = {
      nome: nome,
      cor: cor,
      dataFabricacao: 2023,
      perifericos: perifericos,
    };

    if (editando) {
      axios
        .put(`http://localhost:8080/computador/${editando.id}`, novoComputador)
        .then((response) => {
          setComputadores(computadores.map(computador => computador.id === editando.id ? response.data : computador));
          cancelarEdicao();
        })
        .catch((error) => console.error("Erro ao editar computador:", error));
    } else {
      axios
        .post("http://localhost:8080/computador", novoComputador)
        .then((response) => {
          setComputadores([...computadores, response.data]);
          resetarCampos();
        })
        .catch((error) => console.error("Erro ao adicionar computador:", error));
    }
  };

  const cancelarEdicao = () => {
    setEditando(null);
    resetarCampos();
  };

  const resetarCampos = () => {
    setNome("");
    setCor("");
    setPerifericos([{ nome: "" }]);
  };

  const handlePerifericoChange = (index, value) => {
    const novosPerifericos = [...perifericos];
    novosPerifericos[index].nome = value;
    setPerifericos(novosPerifericos);
  };

  const adicionarPeriferico = () => {
    if (!editando) {
      setPerifericos([...perifericos, { nome: "" }]);
    }
  };

  const editarComputador = (computador) => {
    setNome(computador.nome);
    setCor(computador.cor);
    setPerifericos(computador.perifericos);
    setEditando(computador);
  };

  const deletarComputador = (id) => {
    axios
      .delete(`http://localhost:8080/computador/${id}`)
      .then(() => {
        setComputadores(computadores.filter(computador => computador.id !== id));
      })
      .catch((error) => console.error("Erro ao deletar computador:", error));
  };

  return (
    <div className="container">
      <h1>Lista de Computadores</h1>
      <h4>Leonardo Lazilha | RA 22003838-2</h4>
      <ul>
        {computadores.map((computador) => (
          <li key={computador.id}> 
           <div><strong>ID: </strong>{computador.id}</div>
           <strong> Nome: </strong>{computador.nome} | <strong> Cor: </strong>{computador.cor} | <strong> Data fabricação: </strong>{computador.dataFabricacao}
            <ul> 
              {computador.perifericos.map((periferico) => (
                <li key={periferico.id}><strong> Nome: </strong>{periferico.nome}</li>
              ))}
            </ul>
            <button className="edit-button" onClick={() => editarComputador(computador)}>Editar</button>
            <button className="delete-button" onClick={() => deletarComputador(computador.id)}>Deletar</button>
          </li>
        ))}
      </ul>

      <h2>{editando ? "Editar Computador" : "Adicionar Computador"}</h2>
      <form onSubmit={salvarComputador}>
        <input
          type="text"
          placeholder="Nome do Computador"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cor do Computador"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
          required
        />
        <h3>Perifericos</h3>
        {perifericos.map((periferico, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Nome do Periferico"
              value={periferico.nome}
              onChange={(e) => handlePerifericoChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        {!editando && (
          <button type="button" className="add-button" onClick={adicionarPeriferico}>
            Adicionar Periferico
          </button>
        )}
        <button type="submit" className="add-button">{editando ? "Salvar" : "Adicionar Computador"}</button>
        {editando && <button type="button" className="cancel-button" onClick={cancelarEdicao}>Cancelar</button>}
      </form>
    </div>
  );
};

export default ComputadorList;
