import React, { useState } from 'react';
import * as d3 from 'd3';
import usePassData from '@/lib/usePassData';
import PassScatterPlot from '@/components/PassScatterPlot';
import PassBarChart from '@/components/PassBarChart';

export default function PassesPage() {
  const passData = usePassData();
  const [useTimeFilter, setUseTimeFilter] = useState(false); // false = All Time
  const [timeStart, setTimeStart] = useState(0); // only used if filter is on
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  function getZone(x, y) {
    const col = Math.floor(x / 40);
    const row = 3 - Math.floor(y / 20);
    return row * 3 + col;
  }

  if (!passData) return <p>Loading...</p>;

  const allTeams = Array.from(new Set(passData.map(d => d.team))).sort();
  const allPlayers = Array.from(new Set(passData.map(d => d.name))).sort();

  // 🔍 过滤逻辑
  const filteredPassData = passData.filter(d => {
    const minute = parseFloat(d.minute);
    const inTimeRange = !useTimeFilter || (minute >= timeStart && minute < timeStart + 10);
    const inZone = selectedZone === null || getZone(+d.x, +d.y) === selectedZone;
    const inPlayer = selectedPlayer === '' || d.name === selectedPlayer;
    const inTeam = selectedTeam === '' || d.team === selectedTeam;
    return inTimeRange && inZone && inPlayer && inTeam;
  });

  const aggregated = Array.from(
    d3.group(filteredPassData, d => d.name),
    ([name, records]) => ({
      name,
      Successful: records.filter(r => r.outcomeType === 'Successful').length,
      Unsuccessful: records.filter(r => r.outcomeType === 'Unsuccessful').length
    })
  );

  return (
    <div className="p-4">
      <h2>Pass Map & Outcome Summary</h2>

      {/* 🕑 时间模式选择 */}
      <div className="my-4">
        <label>Time Filter Mode: </label>
        <select
          value={useTimeFilter ? 'separate' : 'all'}
          onChange={(e) => {
            setUseTimeFilter(e.target.value === 'separate');
          }}
        >
          <option value="all">Whole Game</option>
          <option value="separate">Specific Period</option>
        </select>
      </div>

      {/* ⏳ 时间滑块（仅在分段模式下显示） */}
      {useTimeFilter && (
        <div className="my-4">
          <label>Time Range: {timeStart} - {timeStart + 10} minutes</label>
          <input
            type="range"
            min="0"
            max="70"
            step="10"
            value={timeStart}
            onChange={(e) => setTimeStart(+e.target.value)}
          />
        </div>
      )}

      {/* ⚽ 队伍筛选 */}
      <div className="my-4">
        <label>Team: </label>
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
          <option value="">Both Teams</option>
          {allTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      {/* 👤 球员筛选 */}
      <div className="my-4">
        <label>Player: </label>
        <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
          <option value="">All Players</option>
          {allPlayers.map(player => (
            <option key={player} value={player}>{player}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <PassScatterPlot
          data={filteredPassData}
          width={800}
          height={533}
          selectedZone={selectedZone}
          onZoneClick={setSelectedZone}
          selectedPlayer={selectedPlayer}
        />
        <PassBarChart
          data={aggregated}
          width={600}
          height={400}
          selectedPlayer={selectedPlayer}
          onPlayerSelect={setSelectedPlayer}
        />
      </div>
    </div>
  );
}
