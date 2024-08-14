import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';

function MarvelData() {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false); 
  const goToHeroPage = useNavigate();
  const publicKey = '6176df027104eb3153c5cdf0573b4147';
  const privateKey = 'e52d26e8ba912a4f0dbfb8a2ce164ed7c6066fea';
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);
  const baseURL = 'https://gateway.marvel.com/v1/public/characters';

  useEffect(() => {
    const cachedCharacters = localStorage.getItem('characters'); //checagem para o cache da API, evitando assim uma nova requisição sempre que a pagina for recarregada.
    const cachedFavorites = localStorage.getItem('favorites');
    if (cachedCharacters) {
      setCharacters(JSON.parse(cachedCharacters));
      setFilteredCharacters(JSON.parse(cachedCharacters));
    } else {
      axios.get(baseURL, {
        params: {
          ts: ts,
          apikey: publicKey,
          hash: hash,
          limit: 20
        }
      })
      .then(response => {
        setCharacters(response.data.data.results);
        setFilteredCharacters(response.data.data.results); 
        localStorage.setItem('characters', JSON.stringify(response.data.data.results)); 
      })
      .catch(error => console.error('Não foi possível obter dados', error));
    }

    if (cachedFavorites) {
      setFavorites(JSON.parse(cachedFavorites));
    }
  }, []);

  useEffect(() => { //favoritos
    if (showFavorites) {
      setFilteredCharacters(characters.filter(character => favorites.includes(character.id)));
    } else {
      setFilteredCharacters(characters);
    }
  }, [showFavorites, characters, favorites]);

  const handleFavoriteClick = (event, id) => {
    event.stopPropagation(); //evitar que a pagina de herói abra ao clicar no botao de favoritos
    const updatedFavorites = [...favorites];
    const index = updatedFavorites.indexOf(id);

    if (index !== -1) { //controle para evitar que sejam favoritados mais de 5 personagens
      updatedFavorites.splice(index, 1);
    } else {
      if (favorites.length >= 5) {
        alert('Você não pode favoritar mais de 5 personagens.');
        return;
      }
      updatedFavorites.push(id);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const heroPage = (id) => { //abrir pagina de herói
    goToHeroPage(`/hero/${id}`);
  };

  return ( //div principal do programa
    <div className='characters'>
      <button onClick={() => setShowFavorites(!showFavorites)}>
        {showFavorites ? 'Mostrar Todos' : 'Mostrar Favoritos'}
      </button>
      <ul>
        {filteredCharacters.map(character => (
          <li key={character.id} onClick={() => heroPage(character.id)}>
            <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} />
            <h2>{character.name}</h2>
            <button onClick={(event) => handleFavoriteClick(event, character.id)}>
              {favorites.includes(character.id) ? 'Desfavoritar' : 'Favoritar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MarvelData;