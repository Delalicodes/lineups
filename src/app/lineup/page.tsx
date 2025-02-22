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

export default function Lineup() {
  const [teams, setTeams] = useState<Team[]>([]);
  const defaultFormation = '4-4-2';
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [playerPositions, setPlayerPositions] = useState<{[key: string]: {x: number, y: number}}>({});
  const [selectedFormation, setSelectedFormation] = useState(defaultFormation);

  // Get available players (those not yet placed on the field)
  const getAvailablePlayers = () => {
    if (!selectedTeam) return [];
    return selectedTeam.players.filter(player => !playerPositions[player.id]);
  };

  // Get placed players (those already on the field)
  const getPlacedPlayers = () => {
    if (!selectedTeam) return [];
    return selectedTeam.players.filter(player => playerPositions[player.id]);
  };

  // Load teams from localStorage on component mount
  useEffect(() => {
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      const parsedTeams = JSON.parse(savedTeams);
      setTeams(parsedTeams);
    }
  }, []);

  // Auto-position players when team is selected
  useEffect(() => {
    if (selectedTeam && selectedTeam.players.length > 0) {
      const initialPositions: {[key: string]: {x: number, y: number}} = {};
      const formation = formations[selectedFormation];
      
      // Take first 11 players and assign them to formation positions
      selectedTeam.players.slice(0, 11).forEach((player, index) => {
        if (index < formation.positions.length) {
          initialPositions[player.id] = {
            x: formation.positions[index].x,
            y: formation.positions[index].y
          };
        }
      });
      
      setPlayerPositions(initialPositions);
    }
  }, [selectedTeam, selectedFormation]);

  const handleDragStart = (player: Player) => {
    setDraggedPlayer(player);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  interface Position {
    id: string;
    name: string;
    x: number;
    y: number;
  }

  interface Formation {
    name: string;
    positions: Position[];
  }

  const formations: { [key: string]: Formation } = {
    '4-4-2': {
      name: '4-4-2',
      positions: [
        { id: 'gk', name: 'Goalkeeper', x: 8, y: 50 },
        { id: 'rb', name: 'Right Back', x: 25, y: 15 },
        { id: 'cb1', name: 'Center Back', x: 25, y: 35 },
        { id: 'cb2', name: 'Center Back', x: 25, y: 65 },
        { id: 'lb', name: 'Left Back', x: 25, y: 85 },
        { id: 'rm', name: 'Right Mid', x: 50, y: 15 },
        { id: 'cm1', name: 'Center Mid', x: 50, y: 35 },
        { id: 'cm2', name: 'Center Mid', x: 50, y: 65 },
        { id: 'lm', name: 'Left Mid', x: 50, y: 85 },
        { id: 'st1', name: 'Striker', x: 75, y: 35 },
        { id: 'st2', name: 'Striker', x: 75, y: 65 }
      ]
    },
    '4-3-3': {
      name: '4-3-3',
      positions: [
        { id: 'gk', name: 'Goalkeeper', x: 8, y: 50 },
        { id: 'rb', name: 'Right Back', x: 25, y: 15 },
        { id: 'cb1', name: 'Center Back', x: 25, y: 35 },
        { id: 'cb2', name: 'Center Back', x: 25, y: 65 },
        { id: 'lb', name: 'Left Back', x: 25, y: 85 },
        { id: 'dm', name: 'Defensive Mid', x: 45, y: 50 },
        { id: 'cm1', name: 'Center Mid', x: 60, y: 35 },
        { id: 'cm2', name: 'Center Mid', x: 60, y: 65 },
        { id: 'rw', name: 'Right Wing', x: 75, y: 15 },
        { id: 'st', name: 'Striker', x: 75, y: 50 },
        { id: 'lw', name: 'Left Wing', x: 75, y: 85 }
      ]
    },
    '4-2-3-1': {
      name: '4-2-3-1',
      positions: [
        { id: 'gk', name: 'Goalkeeper', x: 8, y: 50 },
        { id: 'rb', name: 'Right Back', x: 25, y: 15 },
        { id: 'cb1', name: 'Center Back', x: 25, y: 35 },
        { id: 'cb2', name: 'Center Back', x: 25, y: 65 },
        { id: 'lb', name: 'Left Back', x: 25, y: 85 },
        { id: 'dm1', name: 'Defensive Mid', x: 40, y: 35 },
        { id: 'dm2', name: 'Defensive Mid', x: 40, y: 65 },
        { id: 'ram', name: 'Right Attack Mid', x: 65, y: 15 },
        { id: 'cam', name: 'Center Attack Mid', x: 65, y: 50 },
        { id: 'lam', name: 'Left Attack Mid', x: 65, y: 85 },
        { id: 'st', name: 'Striker', x: 80, y: 50 }
      ]
    }
  };

  const formationPositions = formations[selectedFormation].positions;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPlayer) {
      const fieldRect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - fieldRect.left) / fieldRect.width) * 100;
      const y = ((e.clientY - fieldRect.top) / fieldRect.height) * 100;
      
      // Find the closest formation position
      const closestPosition = formationPositions.reduce((closest, position) => {
        const distance = Math.sqrt(
          Math.pow(position.x - x, 2) + Math.pow(position.y - y, 2)
        );
        if (distance < closest.distance) {
          return { position, distance };
        }
        return closest;
      }, { position: formationPositions[0], distance: Infinity });

      setPlayerPositions(prev => ({
        ...prev,
        [draggedPlayer.id]: { 
          x: closestPosition.position.x,
          y: closestPosition.position.y
        }
      }));
      setDraggedPlayer(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Team Lineup</h1>

        <div className="flex gap-8">
          <div className="w-1/4">
            <h2 className="text-xl font-semibold mb-4">Select Team</h2>
            <div className="mb-6">
              <label htmlFor="formation" className="block text-sm font-medium text-gray-700 mb-2">
                Formation
              </label>
              <select
                id="formation"
                value={selectedFormation}
                onChange={(e) => {
                  const newFormation = e.target.value;
                  setSelectedFormation(newFormation);
                  
                  // Remap players to new formation positions
                  const newPositions: {[key: string]: {x: number, y: number}} = {};
                  const placedPlayers = getPlacedPlayers();
                  const newFormationPositions = formations[newFormation].positions;
                  
                  // Try to maintain relative positions (e.g., forwards stay as forwards)
                  placedPlayers.forEach((player, index) => {
                    const currentPos = playerPositions[player.id];
                    if (currentPos) {
                      // Find similar position in new formation based on x,y coordinates
                      const similarPosition = newFormationPositions.reduce((closest, position) => {
                        const distance = Math.sqrt(
                          Math.pow(position.x - currentPos.x, 2) + 
                          Math.pow(position.y - currentPos.y, 2)
                        );
                        if (distance < closest.distance) {
                          return { position, distance };
                        }
                        return closest;
                      }, { position: newFormationPositions[0], distance: Infinity });

                      newPositions[player.id] = {
                        x: similarPosition.position.x,
                        y: similarPosition.position.y
                      };
                    }
                  });
                  
                  setPlayerPositions(newPositions);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.keys(formations).map(formation => (
                  <option key={formation} value={formation}>
                    {formations[formation].name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              {teams.map(team => (
                <div
                  key={team.id}
                  onClick={() => {
                    setSelectedTeam(team);
                    setPlayerPositions({});
                  }}
                  className={`p-3 rounded cursor-pointer ${selectedTeam?.id === team.id ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  {team.name}
                </div>
              ))}
            </div>

            {selectedTeam && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Available Players</h3>
                <div className="space-y-2">
                  {getAvailablePlayers().map(player => (
                    <div
                      key={player.id}
                      draggable
                      onDragStart={() => handleDragStart(player)}
                      className="p-2 bg-white rounded-lg shadow cursor-move hover:shadow-md transition-shadow flex items-center gap-2 hover:bg-green-50 group"
                    >
                      <img
                        src={player.picture}
                        alt={player.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-green-400 group-hover:ring-green-500 transition-all"
                      />
                      <span className="font-medium group-hover:text-green-700 transition-colors">{player.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-3/4">
            <div 
              className="aspect-[16/9] bg-green-600 rounded-lg relative overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                backgroundImage: `
                  linear-gradient(to bottom, #2f9e44 0%, #2b8a3e 100%),
                  repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10%),
                  repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10%)
                `,
                backgroundBlendMode: 'normal, overlay, overlay'
              }}
            >
              {/* Field Markings */}
              <div className="absolute inset-0">
                {/* Center Circle */}
                <div className="absolute left-1/2 top-1/2 w-[20%] h-[35%] border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute left-1/2 top-1/2 w-1 h-1 bg-white/30 -translate-x-1/2 -translate-y-1/2" />
                
                {/* Center Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 -translate-x-1/2" />
                
                {/* Penalty Areas */}
                <div className="absolute left-0 top-1/2 w-[15%] h-[45%] border-2 border-white/30 -translate-y-1/2" />
                <div className="absolute right-0 top-1/2 w-[15%] h-[45%] border-2 border-white/30 -translate-y-1/2" />
                
                {/* Goal Areas */}
                <div className="absolute left-0 top-1/2 w-[5%] h-[25%] border-2 border-white/30 -translate-y-1/2" />
                <div className="absolute right-0 top-1/2 w-[5%] h-[25%] border-2 border-white/30 -translate-y-1/2" />
                
                {/* Goals */}
                <div className="absolute left-0 top-1/2 w-1 h-[15%] bg-white/50 -translate-y-1/2" />
                <div className="absolute right-0 top-1/2 w-1 h-[15%] bg-white/50 -translate-y-1/2" />
              </div>
              
              {selectedTeam ? (
                <div className="absolute inset-0">
                  {getPlacedPlayers().map(player => {
                    const position = playerPositions[player.id];
                    if (!position) return null;

                    return (
                      <div
                        key={player.id}
                        draggable
                        onDragStart={() => handleDragStart(player)}
                        className="absolute p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:bg-white transition-colors group cursor-move hover:shadow-xl border border-green-100/50"
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}%`,
                          width: '70px',
                          zIndex: isDragging && draggedPlayer?.id === player.id ? 50 : 1
                        }}
                      >
                        <div className="relative w-8 h-8 mx-auto">
                          <img
                            src={player.picture}
                            alt={player.name}
                            className="w-full h-full rounded-full object-cover ring-2 ring-green-400 group-hover:ring-green-500 transition-colors shadow-md"
                          />
                        </div>
                        <div className="text-[10px] font-medium text-gray-700 group-hover:text-green-700 transition-colors text-center mt-0.5 truncate w-full">
                          {player.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white text-lg">
                  Select a team to view lineup
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}