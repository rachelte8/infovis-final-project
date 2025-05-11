import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PassScatterPlot = ({ data, width = 800, height = 533, onZoneClick, selectedZone, selectedPlayer }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = d3.scaleLinear().domain([0, 120]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 80]).range([height, 0]);

    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', 'black')
      .style('stroke', 'none');

    const g = svg.append('g');

    // Background image
    g.append('image')
      .attr('xlink:href', '/images/pitch2.png')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .lower();

    // Draw passes
    g.selectAll('line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d.x))
      .attr('y1', d => yScale(d.y))
      .attr('x2', d => xScale(d.endX))
      .attr('y2', d => yScale(d.endY))
      .attr('stroke', d => d.outcomeType === 'Successful' ? 'green' : 'red')
      .attr('stroke-width', 2)
      .attr('opacity', d => selectedPlayer && d.name !== selectedPlayer ? 0.1 : 0.8)
      .attr('marker-end', 'url(#arrowhead)');

    // === Draw Zones (with margin) ===
    const leftMargin = 20;
    const rightMargin = 20;
    const topMargin = 10;
    const bottomMargin = 10;

    const zoneWidth = (width - leftMargin - rightMargin) / 3;
    const zoneHeight = (height - topMargin - bottomMargin) / 4;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const zoneId = row * 3 + col;
        g.append('rect')
          .attr('x', leftMargin + col * zoneWidth)
          .attr('y', topMargin + row * zoneHeight)
          .attr('width', zoneWidth)
          .attr('height', zoneHeight)
          .attr('fill', zoneId === selectedZone ? 'rgba(0,0,255,0.2)' : 'transparent')
          .attr('stroke', 'rgba(0,0,0,0.1)')
          .style('cursor', 'pointer')
          .on('click', () => onZoneClick(zoneId === selectedZone ? null : zoneId));
      }
    }
  }, [data, width, height, selectedZone, onZoneClick, selectedPlayer]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default PassScatterPlot;