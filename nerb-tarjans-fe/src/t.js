// GraphViz.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function GraphViz({ sccs }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear previous graph (if any)
    svg.selectAll('*').remove();

    // Create a new force simulation
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));

    // Create links and nodes data from SCCs
    const links = [];
    const nodes = [];
    // let xPosition = 100;
    // const nodeSpacing = 15; // Adjust the spacing between nodes
    // const sscSpacing = 2; // Adjust the spacing between SCCs
    const arrowLength = 17; // Adjust the length of the arrow
    const distance_nodes = 80 

    sccs.forEach(scc => {
      let prevNode;
      scc.forEach((node, index) => {
        const newNode = { id: node }; //  x: xPosition + index * nodeSpacing
        nodes.push(newNode);

        if (prevNode) {
          links.push({ source: prevNode, target: newNode });
        }
        prevNode = newNode;
      });
      // xPosition += scc.length * nodeSpacing + sscSpacing;
    });

    // Create links with arrow
    svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#007bff')
      .style('stroke-width', '2')
      .attr('marker-end', 'url(#arrowhead)')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.source.x) // Atur koordinat awal garis sama dengan koordinat node awal
      .attr('y2', d => d.source.y) // Atur koordinat awal garis sama dengan koordinat node awal
      .attr('x2', d => d.target.x) // Atur koordinat akhir garis sama dengan koordinat node akhir
      .attr('y2', d => d.target.y); // Atur koordinat akhir garis sama dengan koordinat node akhir

    // Add arrowhead to the line
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', arrowLength) // Adjust the arrowhead position here
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .style('fill', '#007bff')
      .style('stroke', 'none');

    // Create nodes (circles)
    const node = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 20)
      .style('fill', '#000');

    // Create node labels (text)
    const label = svg.selectAll('.label')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .style('fill', '#fff')
      .style('font-size', '14px')
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .text(d => d.id);

    // Set up the simulation
    simulation.nodes(nodes).on('tick', () => {
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      svg.selectAll('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    simulation.force('link').links(links).distance(distance_nodes);
    
    // Clean up the simulation when the component is unmounted
    return () => simulation.stop();
  }, [sccs]);

  return (
    <svg ref={svgRef} width={window.innerWidth} height={window.innerHeight}>
      {/* Add any additional components or elements as needed */}
    </svg>
  );
}

export default GraphViz;