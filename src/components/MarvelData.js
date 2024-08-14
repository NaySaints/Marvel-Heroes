import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';

function MarvelData() {
  const [characters, setCharacters] = useState([]);
  const goToHeroPage = useNavigate();
  const publicKey = '6176df027104eb3153c5cdf0573b4147';
  const privateKey = 'e52d26e8ba912a4f0dbfb8a2ce164ed7c6066fea';
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);
  const baseURL = 'https://gateway.marvel.com/v1/public/characters';

  useEffect(() => {
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
    })
    .catch(error => console.error('Não foi possível obter dados', error));
  }, [ts, publicKey, privateKey, hash]);

  const heroPage = (id) => {
    goToHeroPage(`/hero/${id}`);
  };

  return (
    <div className='characters'>
      <ul>
        {characters.map(character => (
          <li key={character.id} onClick={() => heroPage(character.id)}>
            <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} />
            <h2>{character.name}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MarvelData;