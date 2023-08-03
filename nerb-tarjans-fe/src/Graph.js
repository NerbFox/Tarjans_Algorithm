// GraphVis.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function GraphVis({ sccs }) {
  const svgRef = useRef();
  const heightPercentage = 0.6;
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight * heightPercentage; 
    const nodeSpacing = 80; // Adjust the spacing between nodes
    // const sccSpacing = 200; // Adjust the spacing between SCCs

    // Clear previous graph (if any)
    svg.selectAll('*').remove();

    // Calculate the total number of nodes and SCCs
    // const totalNodes = sccs.reduce((acc, scc) => acc + scc.length, 0);
    // const totalSCCs = sccs.length;

    // Calculate the total width needed for the graph
    // const totalWidth = totalNodes * nodeSpacing + (totalSCCs - 1) * sccSpacing;
    let currentX = width * 0.1;
    let currentY = height / 2 * 0.15;
    let heightCurve = 55

    // Create links and nodes data from SCCs
    const links = [];
    const nodes = [];

    sccs.forEach(scc => {
      // check if the height is enough to draw the graph
      // alert("currentY: " + currentY + " height: " + height + " currentY + nodeSpacing: " + (currentY + nodeSpacing));
      // if ((currentY + nodeSpacing) > height) {
      //   height = height+nodeSpacing+20;
      //   alert("height: " + height);
      // }
      let prevNode;
      let firstNode;
      let lastNode;
      if (scc.length !== 1){
        scc.pop(); // Remove the last element 
      } 
      scc.forEach(node => {
        const newNode = { id: node, x: currentX, y: currentY };
        nodes.push(newNode);

        if (prevNode) {
          links.push({ source: prevNode, target: newNode });
        } else {
          firstNode = newNode;
        }

        prevNode = newNode;
        lastNode = newNode;
        currentX += nodeSpacing;
      });

      // Connect the last node to the first node with a curved path
      if (firstNode && lastNode) {
        const curve = d3.curveBundle.beta(1); // Adjust the curve intensity here
        var pathData;
        if (firstNode.id === lastNode.id) {
          pathData = d3.line()
          .curve(curve)
          .x(d => d.x)
          .y(d => d.y)
          ([lastNode, { x: lastNode.x + 30, y: lastNode.y + heightCurve }, { x: lastNode.x - heightCurve, y: lastNode.y + 40 }, firstNode]);
        }
        else{
          pathData = d3.line()
            .curve(curve)
            .x(d => d.x)
            .y(d => d.y)
            ([lastNode, { x: (firstNode.x + lastNode.x) / 2, y: (firstNode.y + heightCurve) }, firstNode]);
        }
          
        svg.append('path')
          .attr('d', pathData)
          .attr('fill', 'none')
          .attr('stroke', '#007bff')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrowhead)');
      }

      // check if the currentX + total node * node spacing > width then reset currentX to 0
      // and increase currentY by node spacing
      if (currentX + scc.length * nodeSpacing > width * 0.95) {
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
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

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
      // purple darker
      .style('fill', '#351c75')

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
  }, [sccs]);

  return (
    <svg ref={svgRef} width={window.innerWidth} height={window.innerHeight * heightPercentage}>
      {/* Add any additional components or elements as needed */}
    </svg>
  );
}

export default GraphVis;
