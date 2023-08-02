// BridgesVis.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BridgesVis({ bridges }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nodeSpacing = 80; // Adjust the spacing between nodes
    const bridgespacing = 200; // Adjust the spacing between bridges

    // Clear previous graph (if any)
    svg.selectAll('*').remove();

    // Calculate the total number of nodes and bridges
    const totalNodes = bridges.reduce((acc, scc) => acc + scc.length, 0);
    const totalbridges = bridges.length;

    // Calculate the total width needed for the graph
    const totalWidth = totalNodes * nodeSpacing + (totalbridges - 1) * bridgespacing;
    let currentX = width * 0.1
    let currentY = height / 2 *0.15
    // Create links and nodes data from bridges
    const links = [];
    const nodes = [];
    
    bridges.forEach(scc => {
      let prevNode;
      let totalNodes = scc.length;
      scc.forEach(node => {
        const newNode = { id: node, x: currentX, y: currentY }; //  x: xPosition + index * nodeSpacing
        nodes.push(newNode);

        if (prevNode) {
          links.push({ source: prevNode, target: newNode });
        }

        prevNode = newNode;
        currentX += nodeSpacing;
        
      });
      // check if the currentX + total node * node spacing > width then reset currentX to 0
      // and increase currentY by node spacing
      if (currentX + totalNodes * nodeSpacing > width * 0.95) {
        currentX = width * 0.1;
        currentY += nodeSpacing;
      }
    });

    // Create links with arrow
    svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
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
      .attr('refX', 18)
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
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
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
  }, [bridges]);

  return (
    <svg ref={svgRef} width={window.innerWidth} height={window.innerHeight}>
      {/* Add any additional components or elements as needed */}
    </svg>
  );
}

export default BridgesVis;
