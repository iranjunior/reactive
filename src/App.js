import React, {useEffect, useState} from 'react';
import * as Rx from 'rxjs';
import * as Operators from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import './App.css';

function App() {
  const [suggestions, setSuggestions] = useState('');
  
  useEffect(() => {
    Rx.fromEvent(document.getElementById('event'), 'keyup').pipe(
      Operators.map(event => event.target.value),
      Operators.debounceTime(400),
      Operators.switchMap(value => 
        ajax({url: `https://api.github.com/search/users?q=${value}`, method: 'GET', crossDomain: true}).pipe(
          Operators.filter(res => !!res),
          Operators.map(({response}) => response.items)
        )
      ),
      Operators.tap(suggestions => setSuggestions(suggestions)),
      Operators.retry(2),
    ).subscribe();

  }, []);

  const RenderItems = () => {
    return (
      <div className="dropbox">
        {
          suggestions.map(user => (
            <a key={user.login} href={`http://concrete-iran-frontend.herokuapp.com/results/${user.login}`}>
              <div className="card">
                <div className="image">
                  <img src={user.avatar_url} alt="photo_user" height="50" width="50"/>
                </div>
                <div className="description">
                  <span>{user.login}</span>
                </div>
              </div>
            </a>
          ))
        }
      </div>
    )
  }
  return (
    <div
    className="App"
    >
      <header>
        <span>
          <strong>GitHub</strong>
        Search
        </span>
        <form autoComplete="off">
          <input 
            id="event" 
            type="text"
          />
          <button type="submit">Pesquisar</button>
        </form>
      </header>
      {
        suggestions && RenderItems()
      }
      
    </div>
  );
}

export default App;
