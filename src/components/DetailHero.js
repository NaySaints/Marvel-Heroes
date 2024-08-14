import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';

function DetailHero() {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [comicsData, setComicsData] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const publicKey = '6176df027104eb3153c5cdf0573b4147';
  const privateKey = 'e52d26e8ba912a4f0dbfb8a2ce164ed7c6066fea';
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  useEffect(() => { //principio para manter o cache salvo e evitar uma nova requisição demorada da api

    const cachedHero = localStorage.getItem(`hero_${id}`);
    const cachedComics = localStorage.getItem(`comics_${id}`);
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (cachedHero && cachedComics) {
      setHero(JSON.parse(cachedHero));
      setComicsData(JSON.parse(cachedComics));
      setIsFavorited(favorites.some(favorite => favorite.id === parseInt(id)));
    } else {
      axios.get(`https://gateway.marvel.com/v1/public/characters/${id}`, {
        params: {
          ts: ts,
          apikey: publicKey,
          hash: hash,
        }
      })
      .then(response => { //dados do herói
        const heroData = response.data.data.results[0];
        setHero(heroData);
        localStorage.setItem(`hero_${id}`, JSON.stringify(heroData));
        setIsFavorited(favorites.some(favorite => favorite.id === parseInt(id)));

        return axios.get(`https://gateway.marvel.com/v1/public/characters/${id}/comics`, {
          params: {
            ts: ts,
            apikey: publicKey,
            hash: hash,
          }
        });
      })
      .then(comicsResponse => {
        const comicsData = comicsResponse.data.data.results;
        setComicsData(comicsData);
        localStorage.setItem(`comics_${id}`, JSON.stringify(comicsData));
      })
      .catch(error => console.error('Não foi possível carregar os dados do herói', error));
    }
  }, [id, ts, publicKey, privateKey, hash]);

  const handleFavorite = () => { //favoritos
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (isFavorited) {

      const updatedFavorites = favorites.filter(favorite => favorite.id !== parseInt(id));
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorited(false);
    } else {

      if (favorites.length < 5) { //impedir mais de 5
        favorites.push(hero);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorited(true);
      } else {
        alert('Você só pode favoritar até 5 personagens.');
      }
    }
  };

  if (!hero) return <div>Obtendo os dados do seu herói, só um momento!</div>; //exibido enquanto a pagina carrega

  const lastComics = comicsData.slice(-10); 

  return ( //retorno de todos os itens
    <div className='hero-details main-content'>
      <div className='hero-grid grid'>
      <div className='hero-info'>
        <div className='name-fav grid'>
          <h1>{hero.name}</h1>
          <button onClick={handleFavorite}>
  {isFavorited ? (
    <svg width="30px" height="30px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-81.000000, -942.000000)" fill="#FF0000" fillRule="nonzero">
          <path d="M108.381187,958.755575 L96.4472189,971.808913 C96.3331604,971.934324 96.1710677,972 96.0030028,972 C95.8349012,972 95.6728451,971.934324 95.5587866,971.808913 L83.6248195,958.755575 C80.1250602,954.933904 80.1250602,948.717756 83.6248195,944.896085 C85.3296508,943.027053 87.6048113,942 90.0300105,942 C92.2511279,942 94.3521779,942.859874 96.003003,944.442257 C97.6538281,942.859874 99.7488704,942 101.969988,942 C104.395187,942 106.676319,943.027053 108.387196,944.896085 C111.874938,948.717756 111.868929,954.933904 108.381187,958.755575 Z"/>
        </g>
      </g>
    </svg>
  ) : (
    <svg width="30px" height="30px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-81.000000, -942.000000)" stroke="#FF0000" strokeWidth="2">
          <path d="M108.381187,958.755575 L96.4472189,971.808913 C96.3331604,971.934324 96.1710677,972 96.0030028,972 C95.8349012,972 95.6728451,971.934324 95.5587866,971.808913 L83.6248195,958.755575 C80.1250602,954.933904 80.1250602,948.717756 83.6248195,944.896085 C85.3296508,943.027053 87.6048113,942 90.0300105,942 C92.2511279,942 94.3521779,942.859874 96.003003,944.442257 C97.6538281,942.859874 99.7488704,942 101.969988,942 C104.395187,942 106.676319,943.027053 108.387196,944.896085 C111.874938,948.717756 111.868929,954.933904 108.381187,958.755575 Z"/>
        </g>
      </g>
    </svg>
  )}
</button>
        </div>

        <div className='hero-desc'>
          <p>{hero.description || "Sem descrição disponível."}</p>
        </div>

        <div className='comics-movies grid'>
          <p className='comics grid'><strong>Quadrinhos</strong> <small>{comicsData.length}</small></p>
          <p className='movies grid'><strong>Filmes:</strong> <small>{hero.movies ? hero.movies.length : 'N/A'}</small></p>
        </div>

        <div className='reviews-date'>
        <p className='reviews'><strong>Reviews</strong> </p>
        <p><strong>Último quadrinho:</strong> {lastComics.length > 0 ? new Date(lastComics[lastComics.length - 1].dates.find(date => date.type === 'onsaleDate').date).toLocaleDateString() : 'N/A'}</p>

        </div>

      </div>

      <div>
        <img src={`${hero.thumbnail.path}.${hero.thumbnail.extension}`} alt={hero.name} /> 
      </div>
      
    </div>


      <div className='last-releases'>        
        <h3>Últimos Lançamentos</h3>
        <ul className='grid'>
          {lastComics.map(comic => (
            <li key={comic.id}>
              <img 
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} 
                alt={comic.title} 
                style={{ width: '100px', height: 'auto', marginRight: '10px' }} 
              />
              <p>{comic.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DetailHero;