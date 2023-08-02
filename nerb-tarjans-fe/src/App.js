import React, { useState } from 'react';
import GraphForm from './GraphForm';
import GraphVis from './Graph';
import BridgesVis from './Bridges';
// import { Sigma, RandomizeNodePositions } from 'react-sigma';
import './styles.css';

function App() {
  const [sccs, setSccs] = useState([]);
  const [bridges, setBridges] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleGraphSubmit = (edges) => {
    // Perform API call to the backend to calculate SCCs and bridges
    // You can use fetch or axios for the API call
    // Example: 
    // fetch('/api/graph', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ edges }),
    // })
    // .then(response => response.json())
    // .then(data => {
      //   setSccs(data.sccs);
      //   setBridges(data.bridges);
      // })
      // .catch(error => console.error('Error:', error));
      
    setSccs([['A', 'B', 'A'], ['B', 'C', 'A', 'B'], ['B', 'C', 'A', 'B'], ['D', 'E', 'F', 'D'], ['D', 'E', 'F', 'D'], ['B', 'C', 'A', 'B'], ['D', 'E', 'F', 'D'], ['G', 'H', 'I', 'G'], ['J', 'K', 'L', 'M', 'J'], ['R']]); // Dummy data
    setBridges([['A', 'B'], ['B', 'C'], ['D', 'E']]); // Dummy data
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Strongly Connected Components and Bridges</h1>
      <button className="toggle-button" onClick={toggleDarkMode}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <GraphForm onSubmit={handleGraphSubmit} />
      {/* Display SCCs and Bridges here */}
      <div className="results">
        <h2>SCCs:</h2>
        {sccs.map((scc, index) => (
          <div key={index}>{scc.join(' --> ')}</div>
          ))}
        {/* Render the GraphViz component with the SCCs data */}
        <GraphVis sccs={sccs} />

        <h2>Bridges:</h2>
        {bridges.map((bridge, index) => (
          <div key={index}>{bridge[0]} -- {bridge[1]}</div>
        ))}
        {/* Render the BridgesViz component with the bridges data */}
        <BridgesVis bridges={bridges} />
      </div>
    </div>
  );
}

export default App;
