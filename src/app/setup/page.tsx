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

export default function Setup() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  useEffect(() => {
    localStorage.clear(); // Clear existing data to ensure dummy data loads
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      const parsedTeams = JSON.parse(savedTeams);
      setTeams(parsedTeams);
    } else {
      // Add dummy data for testing
      const dummyTeams = [
        {
          id: '1',
          name: 'Manchester United',
          players: [
            { id: '1', name: 'David De Gea', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
            { id: '2', name: 'Harry Maguire', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harry' },
            { id: '3', name: 'Luke Shaw', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luke' },
            { id: '4', name: 'Bruno Fernandes', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno' },
            { id: '5', name: 'Marcus Rashford', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
            { id: '6', name: 'Mason Mount', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mason' },
            { id: '7', name: 'Raphael Varane', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raphael' },
            { id: '8', name: 'Casemiro', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casemiro' },
            { id: '9', name: 'Antony', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Antony' },
            { id: '10', name: 'Diogo Dalot', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diogo' },
            { id: '11', name: 'Aaron Wan-Bissaka', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aaron' }
          ]
        },
        {
          id: '2',
          name: 'Manchester City',
          players: [
            { id: '12', name: 'Ederson', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ederson' },
            { id: '13', name: 'Kyle Walker', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle' },
            { id: '14', name: 'Ruben Dias', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruben' },
            { id: '15', name: 'John Stones', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
            { id: '16', name: 'Kevin De Bruyne', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin' },
            { id: '17', name: 'Erling Haaland', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Erling' },
            { id: '18', name: 'Phil Foden', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phil' },
            { id: '19', name: 'Bernardo Silva', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bernardo' },
            { id: '20', name: 'Jack Grealish', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' },
            { id: '21', name: 'Rodri', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rodri' },
            { id: '22', name: 'Nathan Ake', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan' }
          ]
        }
      ];
      setTeams(dummyTeams);
      localStorage.setItem('teams', JSON.stringify(dummyTeams));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  const addTeam = () => {
    const teamName = prompt('Enter team name:');
    if (teamName) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name: teamName,
        players: []
      };
      setTeams([...teams, newTeam]);
      setCurrentTeam(newTeam);
    }
  };

  const addPlayer = () => {
    if (!currentTeam) return;
    
    const playerName = prompt('Enter player name:');
    const pictureUrl = prompt('Enter player picture URL:');
    
    if (playerName && pictureUrl) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: playerName,
        picture: pictureUrl
      };
      
      const updatedTeam = {
        ...currentTeam,
        players: [...currentTeam.players, newPlayer]
      };
      
      setTeams(teams.map(team => 
        team.id === currentTeam.id ? updatedTeam : team
      ));
      setCurrentTeam(updatedTeam);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-8">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-green-100">
        <h1 className="text-4xl font-bold text-green-800 mb-12 text-center">Team Setup</h1>
        
        <div className="flex gap-12">
          <div className="w-1/3 bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-green-700">Teams</h2>
              <button
                onClick={addTeam}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                Add Team
              </button>
            </div>
            <div className="space-y-3">
              {teams.map(team => (
                <div
                  key={team.id}
                  onClick={() => setCurrentTeam(team)}
                  className={`p-4 rounded-xl cursor-pointer transform transition-all duration-200 ${currentTeam?.id === team.id ? 'bg-green-100 border-2 border-green-500 scale-105' : 'bg-white hover:bg-green-50 border border-green-100 hover:scale-102'}`}
                >
                  <div className="font-semibold text-lg text-green-800">{team.name}</div>
                  <div className="text-sm text-green-600 mt-1">{team.players.length} Players</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-2/3 bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-50">
            {currentTeam ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-green-700">{currentTeam.name}</h2>
                    <p className="text-green-600 mt-1">Manage team players</p>
                  </div>
                  <button
                    onClick={addPlayer}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    Add Player
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {currentTeam.players.map(player => (
                    <div 
                      key={player.id} 
                      className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100 group w-full"
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative w-20 h-20 mb-3">
                          <img 
                            src={player.picture} 
                            alt={player.name}
                            className="w-full h-full rounded-full object-cover ring-4 ring-green-400 group-hover:ring-green-500 transition-all duration-300 shadow-md"
                          />
                        </div>
                        <div className="text-lg font-semibold text-green-800 group-hover:text-green-600 transition-colors text-center truncate w-full">
                          {player.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-green-600">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <p className="text-xl">Select a team to manage players</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}