import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';

function DetailHero() {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const publicKey = '6176df027104eb3153c5cdf0573b4147';
  const privateKey = 'e52d26e8ba912a4f0dbfb8a2ce164ed7c6066fea';
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  useEffect(() => {
    axios.get(`https://gateway.marvel.com/v1/public/characters/${id}`, {
      params: {
        ts: ts,
        apikey: publicKey,
        hash: hash,
      }
    })
    .then(response => {
      setHero(response.data.data.results[0]);
    })
    .catch(error => console.error('Não foi possível carregar o seu herói', error));
  }, [id, ts, publicKey, privateKey, hash]);

  if (!hero) return <div>Carregando os dados...</div>;

  return (
    <div>
      <h1>{hero.name}</h1>
      <img src={`${hero.thumbnail.path}.${hero.thumbnail.extension}`} alt={hero.name} /> 
      <p>{hero.description || "Sem descrição disponível."}</p>
    </div>
  );
}

export default DetailHero;