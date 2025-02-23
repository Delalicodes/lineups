'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  picture: string;
}

interface Team {
  id: string;
  name: string;
  players: Player[];
}

interface PlayerPosition {
  x: number;
  y: number;
}

export default function MatchLineup() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const defaultFormation = '4-4-2';
  const [homeFormation, setHomeFormation] = useState(defaultFormation);
  const [awayFormation, setAwayFormation] = useState(defaultFormation);
  const [homePlayerPositions, setHomePlayerPositions] = useState<{[key: string]: PlayerPosition}>({});
  const [awayPlayerPositions, setAwayPlayerPositions] = useState<{[key: string]: PlayerPosition}>({});

  // Load teams from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      const parsedTeams = JSON.parse(savedTeams);
      setTeams(parsedTeams);
    }
  }, []);

  // Formation definitions
  const formations: { [key: string]: { name: string; positions: { id: string; name: string; x: number; y: number; }[]; } } = {
    '4-4-2': {
      name: '4-4-2',
      positions: [
        { id: 'gk', name: 'Goalkeeper', x: 10, y: 50 },
        { id: 'rb', name: 'Right Back', x: 15, y: 10 },
        { id: 'cb1', name: 'Center Back', x: 15, y: 30 },
        { id: 'cb2', name: 'Center Back', x: 15, y: 70 },
        { id: 'lb', name: 'Left Back', x: 15, y: 90 },
        { id: 'rm', name: 'Right Mid', x: 25, y: 10 },
        { id: 'cm1', name: 'Center Mid', x: 25, y: 35 },
        { id: 'cm2', name: 'Center Mid', x: 25, y: 65 },
        { id: 'lm', name: 'Left Mid', x: 25, y: 90 },
        { id: 'st1', name: 'Striker', x: 35, y: 30 },
        { id: 'st2', name: 'Striker', x: 35, y: 70 }
      ]
    },
    '4-3-3': {
      name: '4-3-3',
      positions: [
        { id: 'gk', name: 'Goalkeeper', x: 10, y: 50 },
        { id: 'rb', name: 'Right Back', x: 15, y: 10 },
        { id: 'cb1', name: 'Center Back', x: 15, y: 35 },
        { id: 'cb2', name: 'Center Back', x: 15, y: 65 },
        { id: 'lb', name: 'Left Back', x: 15, y: 90 },
        { id: 'dm', name: 'Defensive Mid', x: 25, y: 50 },
        { id: 'cm1', name: 'Center Mid', x: 30, y: 20 },
        { id: 'cm2', name: 'Center Mid', x: 30, y: 80 },
        { id: 'rw', name: 'Right Wing', x: 35, y: 10 },
        { id: 'st', name: 'Striker', x: 35, y: 50 },
        { id: 'lw', name: 'Left Wing', x: 35, y: 90 }
      ]
    },
    '4-2-3-1': {
      name: '4-2-3-1',
      positions: [
        { id: 'gk', name: 'Goalkeeper', x: 10, y: 50 },
        { id: 'rb', name: 'Right Back', x: 15, y: 10 },
        { id: 'cb1', name: 'Center Back', x: 15, y: 35 },
        { id: 'cb2', name: 'Center Back', x: 15, y: 65 },
        { id: 'lb', name: 'Left Back', x: 15, y: 90 },
        { id: 'dm1', name: 'Defensive Mid', x: 25, y: 30 },
        { id: 'dm2', name: 'Defensive Mid', x: 25, y: 70 },
        { id: 'ram', name: 'Right Attack Mid', x: 30, y: 15 },
        { id: 'cam', name: 'Center Attack Mid', x: 30, y: 50 },
        { id: 'lam', name: 'Left Attack Mid', x: 30, y: 85 },
        { id: 'st', name: 'Striker', x: 35, y: 50 }
      ]
    }
  };

  // Auto-position players when teams are selected
  useEffect(() => {
    if (homeTeam) {
      const initialPositions: {[key: string]: PlayerPosition} = {};
      const formation = formations[homeFormation];
      
      // Ensure we process exactly 11 players if available
      const startingPlayers = homeTeam.players.slice(0, Math.min(11, homeTeam.players.length));
      startingPlayers.forEach((player, index) => {
        // Ensure we have a valid position for each player
        if (index < formation.positions.length) {
          initialPositions[player.id] = {
            x: formation.positions[index].x,
            y: formation.positions[index].y
          };
        }
      });
      
      setHomePlayerPositions(initialPositions);
    }
  }, [homeTeam, homeFormation]);

  useEffect(() => {
    if (awayTeam) {
      const initialPositions: {[key: string]: PlayerPosition} = {};
      const formation = formations[awayFormation];
      
      awayTeam.players.slice(0, 11).forEach((player, index) => {
        if (index < formation.positions.length) {
          initialPositions[player.id] = {
            // Mirror the x-position for away team
            x: 100 - formation.positions[index].x,
            y: formation.positions[index].y
          };
        }
      });
      
      setAwayPlayerPositions(initialPositions);
    }
  }, [awayTeam, awayFormation]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-green-100/30">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-800 mb-8 sm:mb-12 text-center bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent drop-shadow-sm">
          Match Lineup
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Home Team Selection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Home Team</h2>
            <div className="space-y-4">
              <select
                value={homeTeam?.id || ''}
                onChange={(e) => {
                  const team = teams.find(t => t.id === e.target.value);
                  setHomeTeam(team || null);
                }}
                className="w-full p-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-800 font-medium shadow-sm"
              >
                <option value="">Select Home Team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>

              <select
                value={homeFormation}
                onChange={(e) => setHomeFormation(e.target.value)}
                className="w-full p-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-800 font-medium shadow-sm"
              >
                {Object.keys(formations).map(formation => (
                  <option key={formation} value={formation}>
                    {formations[formation].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Away Team Selection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Away Team</h2>
            <div className="space-y-4">
              <select
                value={awayTeam?.id || ''}
                onChange={(e) => {
                  const team = teams.find(t => t.id === e.target.value);
                  setAwayTeam(team || null);
                }}
                className="w-full p-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-800 font-medium shadow-sm"
              >
                <option value="">Select Away Team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>

              <select
                value={awayFormation}
                onChange={(e) => setAwayFormation(e.target.value)}
                className="w-full p-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-800 font-medium shadow-sm"
              >
                {Object.keys(formations).map(formation => (
                  <option key={formation} value={formation}>
                    {formations[formation].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Football Pitch */}
        <div 
          className="aspect-[16/9] bg-gradient-to-b from-green-600 to-green-700 rounded-3xl relative overflow-hidden shadow-2xl border border-green-500/30"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(47, 158, 68, 0.95) 0%, rgba(43, 138, 62, 0.95) 100%),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10%),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10%)
            `,
            backgroundBlendMode: 'normal, overlay, overlay'
          }}
        >
          {/* Field Markings */}
          <div className="absolute inset-0">
            {/* Center Circle */}
            <div className="absolute left-1/2 top-1/2 w-[20%] h-[35%] border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white/40 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/40 -translate-x-1/2" />
            
            {/* Penalty Areas */}
            <div className="absolute left-0 top-1/2 w-[15%] h-[45%] border-2 border-white/40 -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 w-[15%] h-[45%] border-2 border-white/40 -translate-y-1/2" />
            
            {/* Goal Areas */}
            <div className="absolute left-0 top-1/2 w-[5%] h-[25%] border-2 border-white/40 -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 w-[5%] h-[25%] border-2 border-white/40 -translate-y-1/2" />
            
            {/* Goals */}
            <div className="absolute left-0 top-1/2 w-1 h-[15%] bg-white/60 -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 w-1 h-[15%] bg-white/60 -translate-y-1/2" />
          </div>

          {/* Home Team Players */}
          {homeTeam && (
            <div className="absolute inset-0 pointer-events-none">
              {homeTeam.players.map((player, index) => {
                const position = homePlayerPositions[player.id];
                // For first 11 players, use formation positions
                if (index < 11 && position) {
                  return (
                    <div
                      key={player.id}
                      className="absolute p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 hover:bg-white transition-all duration-300 group border-2 border-green-200/70 hover:border-green-300/80 pointer-events-auto hover:z-[100]"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        width: '70px',
                        zIndex: 10 + index
                      }}
                    >
                      <div className="relative w-8 h-8 mx-auto mb-1">
                        <img
                          src={player.picture}
                          alt={player.name}
                          className="w-full h-full rounded-full object-cover ring-3 ring-blue-400 group-hover:ring-blue-500 transition-all duration-300 shadow-lg"
                        />
                      </div>
                      <div className="text-[10px] font-semibold text-blue-800 group-hover:text-blue-600 transition-all duration-300 text-center truncate w-full">
                        {player.name}
                      </div>
                    </div>
                  );
                }
                // For substitutes, position them on the left sideline with increased spacing
                return (
                  <div
                    key={player.id}
                    className="absolute p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:bg-white transition-all duration-300 group border-2 border-blue-200/50 hover:border-blue-300/60 pointer-events-auto"
                    style={{
                      left: '2%',
                      top: `${5 + ((index - 11) * 10)}%`, // Increased spacing between substitute cards
                      width: '70px',
                      zIndex: 10 + index // Ensure consistent stacking order
                    }}
                  >
                    <div className="relative w-8 h-8 mx-auto mb-1">
                      <img
                        src={player.picture}
                        alt={player.name}
                        className="w-full h-full rounded-full object-cover ring-2 ring-blue-300 group-hover:ring-blue-400 transition-all duration-300 shadow-md"
                      />
                    </div>
                    <div className="text-[10px] font-medium text-blue-700 group-hover:text-blue-500 transition-all duration-300 text-center truncate w-full">
                      {player.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Away Team Players */}
          {awayTeam && (
            <div className="absolute inset-0 pointer-events-none">
              {awayTeam.players.map((player, index) => {
                const position = awayPlayerPositions[player.id];
                // For first 11 players, use formation positions
                if (index < 11 && position) {
                  return (
                    <div
                      key={player.id}
                      className="absolute p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 hover:bg-white transition-all duration-300 group border-2 border-red-200/70 hover:border-red-300/80 pointer-events-auto hover:z-[100]"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        width: '70px',
                        zIndex: 10 + index
                      }}
                    >
                      <div className="relative w-8 h-8 mx-auto mb-1">
                        <img
                          src={player.picture}
                          alt={player.name}
                          className="w-full h-full rounded-full object-cover ring-3 ring-red-400 group-hover:ring-red-500 transition-all duration-300 shadow-lg"
                        />
                      </div>
                      <div className="text-[10px] font-semibold text-red-800 group-hover:text-red-600 transition-all duration-300 text-center truncate w-full">
                        {player.name}
                      </div>
                    </div>
                  );
                }
                // For substitutes, position them on the right sideline with increased spacing
                return (
                  <div
                    key={player.id}
                    className="absolute p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:bg-white transition-all duration-300 group border-2 border-red-200/50 hover:border-red-300/60 pointer-events-auto"
                    style={{
                      left: '98%',
                      top: `${5 + ((index - 11) * 10)}%`, // Increased spacing between substitute cards
                      width: '70px',
                      zIndex: 10 + index // Ensure consistent stacking order
                    }}
                  >
                    <div className="relative w-8 h-8 mx-auto mb-1">
                      <img
                        src={player.picture}
                        alt={player.name}
                        className="w-full h-full rounded-full object-cover ring-2 ring-red-300 group-hover:ring-red-400 transition-all duration-300 shadow-md"
                      />
                    </div>
                    <div className="text-[10px] font-medium text-red-700 group-hover:text-red-500 transition-all duration-300 text-center truncate w-full">
                      {player.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Display message when no teams are selected */}
          {!homeTeam && !awayTeam && (
            <div className="flex items-center justify-center h-full text-white/90 text-xl font-medium">
              Select teams to view match lineup
            </div>
          )}
        </div>
      </div>
    </main>
  );
}