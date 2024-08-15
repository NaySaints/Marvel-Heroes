import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import MarvelData from './components/MarvelData';
import DetailHero from './components/DetailHero';
import { useState } from 'react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Header setSearchQuery={setSearchQuery} />
        </header>
        <Routes>
          <Route path="/" element={<MarvelData searchQuery={searchQuery} />} />
          <Route path="/hero/:id" element={<DetailHero />} />
        </Routes>
        <footer>
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;