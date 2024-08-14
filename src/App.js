import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MarvelData from './components/MarvelData';
import DetailHero from './components/DetailHero';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <Routes>
          <Route path="/" element={<MarvelData />} />
          <Route path="/hero/:id" element={<DetailHero />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;