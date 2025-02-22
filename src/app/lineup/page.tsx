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

  // Save player positions to localStorage when they change
  useEffect(() => {
    if (selectedTeam) {
      const savedPositions = localStorage.getItem(`positions_${selectedTeam.id}`);
      if (savedPositions) {
        setPlayerPositions(JSON.parse(savedPositions));
      }
    }
  }, [selectedTeam]);

  // Save positions when they change
  useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem(`positions_${selectedTeam.id}`, JSON.stringify(playerPositions));
    }
  }, [playerPositions, selectedTeam]);

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
        { id: 'rb', name: 'Right Back', x: 25, y: 20 },
        { id: 'cb1', name: 'Center Back', x: 25, y: 40 },
        { id: 'cb2', name: 'Center Back', x: 25, y: 60 },
        { id: 'lb', name: 'Left Back', x: 25, y: 80 },
        { id: 'rm', name: 'Right Mid', x: 50, y: 20 },
        { id: 'cm1', name: 'Center Mid', x: 50, y: 40 },
        { id: 'cm2', name: 'Center Mid', x: 50, y: 60 },
        { id: 'lm', name: 'Left Mid', x: 50, y: 80 },
        { id: 'st1', name: 'Striker', x: 80, y: 40 },
        { id: 'st2', name: 'Striker', x: 80, y: 60 }
      ]
    },
    '4-3-3': {
      name: '4-3-3',
      positions: [
        { id: 'gk', name: 'Goalkeeper', x: 8, y: 50 },
        { id: 'rb', name: 'Right Back', x: 25, y: 20 },
        { id: 'cb1', name: 'Center Back', x: 25, y: 40 },
        { id: 'cb2', name: 'Center Back', x: 25, y: 60 },
        { id: 'lb', name: 'Left Back', x: 25, y: 80 },
        { id: 'dm', name: 'Defensive Mid', x: 45, y: 50 },
        { id: 'cm1', name: 'Center Mid', x: 60, y: 30 },
        { id: 'cm2', name: 'Center Mid', x: 60, y: 70 },
        { id: 'rw', name: 'Right Wing', x: 80, y: 20 },
        { id: 'st', name: 'Striker', x: 80, y: 50 },
        { id: 'lw', name: 'Left Wing', x: 80, y: 80 }
      ]
    },
    '4-2-3-1': {
      name: '4-2-3-1',
      positions: [
        { id: 'gk', name: 'Goalkeeper', x: 8, y: 50 },
        { id: 'rb', name: 'Right Back', x: 25, y: 20 },
        { id: 'cb1', name: 'Center Back', x: 25, y: 40 },
        { id: 'cb2', name: 'Center Back', x: 25, y: 60 },
        { id: 'lb', name: 'Left Back', x: 25, y: 80 },
        { id: 'dm1', name: 'Defensive Mid', x: 40, y: 35 },
        { id: 'dm2', name: 'Defensive Mid', x: 40, y: 65 },
        { id: 'ram', name: 'Right Attack Mid', x: 65, y: 20 },
        { id: 'cam', name: 'Center Attack Mid', x: 65, y: 50 },
        { id: 'lam', name: 'Left Attack Mid', x: 65, y: 80 },
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
    <main className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-green-100/30">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-800 mb-8 sm:mb-12 text-center bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent drop-shadow-sm">Team Lineup</h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-1/4 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50">
              <h2 className="text-2xl font-semibold text-green-700 mb-4">Formation</h2>
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
                  
                  placedPlayers.forEach((player, index) => {
                    const currentPos = playerPositions[player.id];
                    if (currentPos) {
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
                className="w-full p-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-800 font-medium shadow-sm"
              >
                {Object.keys(formations).map(formation => (
                  <option key={formation} value={formation} className="font-medium">
                    {formations[formation].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border-2 border-green-200/50 hover:border-green-300/50 transition-all duration-300">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent mb-4">Select Team</h2>
              <div className="space-y-3">
                {teams.map(team => (
                  <div
                    key={team.id}
                    onClick={() => {
                      setSelectedTeam(team);
                      setPlayerPositions({});
                    }}
                    className={`p-4 rounded-xl cursor-pointer transform transition-all duration-300 ${selectedTeam?.id === team.id ? 'bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-500 scale-102 shadow-lg' : 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-green-50/50 border-2 border-green-100 hover:border-green-300 hover:scale-101 hover:shadow-lg'}`}
                  >
                    <div className="font-bold text-lg bg-gradient-to-r from-green-800 to-green-700 bg-clip-text text-transparent">{team.name}</div>
                    <div className="text-sm font-medium text-green-600 mt-1">{team.players.length} Players</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedTeam && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50">
                <h3 className="text-2xl font-semibold text-green-700 mb-4">Available Players</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent">
                  {getAvailablePlayers().map(player => (
                    <div
                      key={player.id}
                      draggable
                      onDragStart={() => handleDragStart(player)}
                      className="p-3 bg-white rounded-xl shadow-sm cursor-move hover:shadow-md transition-all duration-300 flex items-center gap-3 hover:bg-green-50 group transform hover:scale-102 border-2 border-green-100 hover:border-green-200"
                    >
                      <img
                        src={player.picture}
                        alt={player.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-green-400 group-hover:ring-green-500 transition-all duration-300 shadow-sm"
                      />
                      <span className="font-medium text-green-800 group-hover:text-green-700 transition-colors">{player.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-3/4">
            <div 
              className="aspect-[16/9] bg-gradient-to-b from-green-600 to-green-700 rounded-3xl relative overflow-hidden shadow-2xl border border-green-500/30"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
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
                        className="absolute p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 hover:bg-white transition-all duration-300 group cursor-move hover:shadow-2xl border-2 border-green-200/70 hover:border-green-300/80"
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}%`,
                          width: '80px',
                          zIndex: isDragging && draggedPlayer?.id === player.id ? 50 : 1
                        }}
                      >
                        <div className="relative w-10 h-10 mx-auto mb-1">
                          <img
                            src={player.picture}
                            alt={player.name}
                            className="w-full h-full rounded-full object-cover ring-3 ring-green-400 group-hover:ring-green-500 transition-all duration-300 shadow-lg"
                          />
                        </div>
                        <div className="text-xs font-semibold text-green-800 group-hover:text-green-600 transition-all duration-300 text-center truncate w-full">
                          {player.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white/90 text-xl font-medium">
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