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
  const backendUrl = 'http://localhost:5001';
  //  example edges
  // A B
  // B C
  // C A
  // B D
  // D E
  // E F
  // F E
  const handleGraphSubmit = async (edges) => {
    // dissable the submit button
    // check if the edges are valid (no duplicate edges, no self loops, no formatting errors)
    if (!edges || edges.length === 0) {
      alert('Please enter valid edges, You must enter at least one edge');
      return;
    }
    // remove white spaces from the last 
    edges = edges.trim();
    var arrEdges = edges.split(/\s+/);

    // alert("arrEdges: " + arrEdges + " arrEdges.length: " + arrEdges.length);
    if (arrEdges.length % 2 !== 0) {
      alert('Please enter valid edges, each edge should have two vertices');
      return;
    }
    // make two dimensional array of edges [[A, B], [B, C], [C, A]]
    var arrEdges2D = [];
    var j = 0;
    for (var i = 0; i < arrEdges.length/2; i++) {
      arrEdges2D.push([arrEdges[j], arrEdges[j+1]]);
      if (arrEdges[j] === arrEdges[j+1]) {
        alert('Please enter valid edges, no self loops allowed');
        return;
      }
      j += 2;
    }

    // check for duplicate edges
    var arrEdges2DString = [];
    for (i = 0; i < arrEdges2D.length; i++) {
      arrEdges2DString.push(arrEdges2D[i].join(''));
    }
    var uniqueEdges = [...new Set(arrEdges2DString)];
    if (uniqueEdges.length !== arrEdges2D.length) {
      alert('Please enter valid edges, no duplicate edges allowed');
      return;
    }
    // alert("arrEdges2D: " + arrEdges2D + " arrEdges2D.length: " + arrEdges2D.length);
    // alert(JSON.stringify({edges: arrEdges2D}))
    
    // alert('Please wait while we calculate the SCCs and Bridges');
    try {
      const response = await fetch(`${backendUrl}/api/tarjans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({edges: arrEdges2D}),
      });
      if (!response.ok) {
        alert('Error getting a response from the server');
        return;
      }
      const data = await response.json();
      setSccs(data.sccs);
      setBridges(data.bridges);
    } catch (error) {
      alert('Error ' + error);
      return;
    }

    // fetch(`${backendUrl}/api/something`, {
    //   method: 'GET',
    // }) // the reponse is not json object
    // .then(response => alert('Success:', response))
    //   .catch(error => {
    //     // Handle any errors that occurred during the fetch
    //     console.error('Error fetching data:', error);
    //     alert('Error fetching data:', error);
    //   });
    
    
    // setSccs(arrEdges2D);
    // setBridges(arrEdges2D);

    // fetch(`${backendUrl}/api/`, {
    // setSccs([['A', 'B', 'A'], ['B', 'C', 'A', 'B'], ['B', 'C', 'A', 'B'], ['D', 'E', 'F', 'D'], ['D', 'E', 'F', 'D'], ['B', 'C', 'A', 'B'], ['D', 'E', 'F', 'D'], ['G', 'H', 'I', 'G'], ['J', 'K', 'L', 'M', 'J'], ['R']]); // Dummy data
    // setBridges([['A', 'B'], ['B', 'C'], ['D', 'E']]); // Dummy data
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
