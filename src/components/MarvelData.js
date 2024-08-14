import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';

function MarvelData({ searchQuery }) {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [totalResults, setTotalResults] = useState(0); // Novo estado para o número total de resultados
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
      setTotalResults(JSON.parse(cachedCharacters).length); // Total dos resultados retornados pela API
    } else {
      axios.get(baseURL, { // biblioteca axios para requisição HTTP
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
        setTotalResults(response.data.data.total); // Definindo os resultados retornados
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
      setFilteredCharacters(
        characters.filter(character =>
          character.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [showFavorites, characters, favorites, searchQuery]);

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

  const heroPage = (id) => {
    goToHeroPage(`/hero/${id}`);
  };

  return (
    <div className='characters main-content'>
      <div>
      <p>Encontrados {totalResults} heróis</p>
      <button onClick={() => setShowFavorites(!showFavorites)}>
        {showFavorites ? 'Todos os heróis' : 'Somente favoritos'}
      </button>
      </div>
      <ul className='grid'>
        {filteredCharacters.map(character => (
          <li key={character.id} onClick={() => heroPage(character.id)} className='hero-square'>
            <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} className='hero-pic' />
            <div className='grid'>
              <h2 className='h-name'>{character.name}</h2>
              <button onClick={(event) => handleFavoriteClick(event, character.id)}>
                {favorites.includes(character.id) ? (
                  <svg width="30px" height="30px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g transform="translate(-81.000000, -942.000000)" fill="#FF0000" fillRule="nonzero">
                        <path d="M108.381187,958.755575 L96.4472189,971.808913 C96.3331604,971.934324 96.1710677,972 96.0030028,972 C95.8349012,972 95.6728451,971.934324 95.5587866,971.808913 L83.6248195,958.755575 C80.1250602,954.933904 80.1250602,948.717756 83.6248195,944.896085 C85.3296508,943.027053 87.6048113,942 90.0300105,942 C92.2511279,942 94.3521779,942.859874 96.003003,944.442257 C97.6538281,942.859874 99.7488704,942 101.969988,942 C104.395187,942 106.676319,943.027053 108.387196,944.896085 C111.874938,948.717756 111.868929,954.933904 108.381187,958.755575 Z"/>
                      </g>
                    </g>
                  </svg>
                ) : (
                  <svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g transform="translate(-231.000000, -828.000000)" fillRule="nonzero" stroke="#FF0000" strokeWidth="2">
                        <path d="M248.428712,839.053345 L241.268331,846.885348 C241.199896,846.960594 241.102641,847 241.001802,847 C240.900941,847 240.803707,846.960594 240.735272,846.885348 L233.574892,839.053345 C231.475036,836.760342 231.475036,833.030654 233.574892,830.737651 C234.59779,829.616232 235.962887,829 237.418006,829 C238.750677,829 240.011307,829.515925 241.001802,830.465354 C241.992297,829.515925 243.249322,829 244.581993,829 C246.037112,829 247.405792,829.616232 248.432318,830.737651 C250.524963,833.030654 250.521357,836.760342 248.428712,839.053345 Z"/>
                      </g>
                    </g>
                  </svg>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MarvelData;