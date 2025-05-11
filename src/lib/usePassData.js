import { useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * 自定义 hook：从 public 中加载传球数据 CSV
 * @param {string} path CSV 文件路径（相对 public）
 * @returns {Array|null} 传球数据数组或 null
 */
export default function usePassData(path = '/data/EurosFinal2024-Spain v England.csv') {
  const [data, setData] = useState(null);

  useEffect(() => {
    d3.csv(path).then(raw => {
      const passes = raw.filter(d =>
        d.type === 'Pass' &&
        d.x !== undefined && d.y !== undefined &&
        d.endX !== undefined && d.endY !== undefined
      );

      passes.forEach(d => {
        d.x = parseFloat(d.x);
        d.y = parseFloat(d.y);
        d.endX = parseFloat(d.endX);
        d.endY = parseFloat(d.endY);
        d.name = d.name || 'Unknown';
        d.team = d.teamName || 'Unknown';
        d.outcomeType = d.outcomeType || 'Unknown';
      });

      setData(passes);
    }).catch(err => {
      console.error("Failed to load pass data:", err);
      setData([]);
    });
  }, [path]);

  return data;
}
