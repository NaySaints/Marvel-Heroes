import React from 'react';

function Header({ setSearchQuery }) {
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  return (
    <header>
      <div className='app-logo'>
        <img src="Group.png" alt="Logo" />
      </div>
      <div className='app-slogan'>
        <h1>EXPLORE O UNIVERSO</h1>
        <p>Mergulhe no domínio deslumbrante de todos os personagens clássicos que você ama - e aqueles que você descobrirá em breve</p>
      </div>
      <div className='search-input'>
        <input 
          type="text" 
          placeholder="Procure por heróis" 
          onChange={handleSearchChange} 
        />
      </div>
    </header>
  );
}

export default Header;