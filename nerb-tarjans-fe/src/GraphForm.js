import React, { useState } from 'react';

function GraphForm({ onSubmit }) {
  const [graphInput, setGraphInput] = useState('');

  const handleInputChange = (e) => {
    setGraphInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const edges = graphInput
    onSubmit(edges);
  };

  return (
    <form className="graph-form" onSubmit={handleSubmit}>
      <textarea
        rows="5"
        placeholder="Enter the graph edges (e.g. 
          A B 
          B C 
          C A 
          B D)"
        value={graphInput}
        onChange={handleInputChange}
      />
      <button type="submit">Find SCCS and Bridges</button>
    </form>
  );
}

export default GraphForm;
