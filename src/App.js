import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Rx from 'rxjs';
import * as Operators from 'rxjs/operators';
import "./App.css";

function App() {
  const [toDo, setToDo] = useState([]);
  const onDrop = useCallback(acceptedFiles => {
   
    acceptedFiles.forEach(element => {
      const reader = new FileReader();
      reader.readAsText(element);
      Rx.fromEvent(reader, 'load').pipe(
        Operators.map(({currentTarget}) => currentTarget.readyState === 2 && currentTarget.result.trim().split('\n')),
        Operators.tap(todo => setToDo((prev) => [prev, ...todo].flat(Infinity))),
        Operators.tap(() => document.querySelector(".zone").style.display = "none"),
      ).subscribe()
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleCLick = () => {
    setTimeout(
      () => {
        document.querySelector(".zone").style.display = "flex";
      }, 300)
  };
  return (
    <div className="App">
      <header className="header">
        <button onClick={handleCLick}> Adicionar ToDo file</button>
        <div className="zone" {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Solte aqui seus arquivos ...</p>
          ) : (
            <p>Solte aqui seus arquivos, ou click para selecionar arquivos</p>
          )}
        </div>
      </header>
      <div className="content">
        <ul>
          {toDo &&
            toDo.map((todo, index) => (
              <li key={index}>
                <div className="card">{todo}</div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
