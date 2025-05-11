import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PassBarChart = ({ data, width = 600, height = 400, selectedPlayer, onPlayerSelect }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 100, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.2);

    const yMax = d3.max(data, d => d.Successful + d.Unsuccessful);
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0])
      .nice();

    g.append('g').call(d3.axisLeft(yScale));
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end');

    // Draw bars: Successful
    g.selectAll('.bar-success')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-success')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.Successful))
      .attr('width', xScale.bandwidth() / 2)
      .attr('height', d => innerHeight - yScale(d.Successful))
      .attr('fill', d => d.name === selectedPlayer ? 'darkgreen' : 'green')
      .style('cursor', 'pointer')
      .on('click', (event, d) => onPlayerSelect(d.name === selectedPlayer ? '' : d.name));

    // Draw bars: Unsuccessful
    g.selectAll('.bar-fail')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-fail')
      .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.Unsuccessful))
      .attr('width', xScale.bandwidth() / 2)
      .attr('height', d => innerHeight - yScale(d.Unsuccessful))
      .attr('fill', d => d.name === selectedPlayer ? 'darkred' : 'red')
      .style('cursor', 'pointer')
      .on('click', (event, d) => onPlayerSelect(d.name === selectedPlayer ? '' : d.name));

    // ✅ 图例 Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 180}, 30)`);

    legend.append('rect')
      .attr('width', 160)
      .attr('height', 50)
      .attr('fill', 'white')
      .attr('stroke', 'black');

    legend.append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 20)
      .attr('height', 10)
      .attr('fill', 'green');

    legend.append('text')
      .attr('x', 40)
      .attr('y', 18)
      .text('Successful Pass')
      .attr('font-size', '12px');

    legend.append('rect')
      .attr('x', 10)
      .attr('y', 30)
      .attr('width', 20)
      .attr('height', 10)
      .attr('fill', 'red');

    legend.append('text')
      .attr('x', 40)
      .attr('y', 38)
      .text('Unsuccessful Pass')
      .attr('font-size', '12px');

  }, [data, width, height, selectedPlayer, onPlayerSelect]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default PassBarChart;
