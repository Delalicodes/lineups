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

interface ModalState {
  isOpen: boolean;
  type: 'add-team' | 'add-player';
}

export default function Setup() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: 'add-team' });
  const [formData, setFormData] = useState({ name: '', picture: '' });

  // Load teams from localStorage on component mount
  useEffect(() => {
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      const parsedTeams = JSON.parse(savedTeams);
      setTeams(parsedTeams);
    }
  }, []);

  // Save teams to localStorage when they change
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  const closeModal = () => {
    setModal({ isOpen: false, type: 'add-team' });
    setFormData({ name: '', picture: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    switch (modal.type) {
      case 'add-team':
        const newTeam: Team = {
          id: Date.now().toString(),
          name: formData.name,
          players: []
        };
        setTeams([...teams, newTeam]);
        setCurrentTeam(newTeam);
        break;

      case 'add-player':
        if (currentTeam) {
          const newPlayer: Player = {
            id: Date.now().toString(),
            name: formData.name,
            picture: formData.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
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
        break;
    }
    
    closeModal();
  };

  const addTeam = () => {
    setModal({ isOpen: true, type: 'add-team' });
    setFormData({ name: '', picture: '' });
  };

  const addPlayer = () => {
    if (!currentTeam) return;
    setModal({ isOpen: true, type: 'add-player' });
    setFormData({ name: '', picture: '' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Team Setup</h1>

        <div className="flex gap-8">
          <div className="w-1/4">
            <button
              onClick={addTeam}
              className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-6"
            >
              Add New Team
            </button>

            <div className="space-y-2">
              {teams.map(team => (
                <div
                  key={team.id}
                  onClick={() => setCurrentTeam(team)}
                  className={`p-3 rounded cursor-pointer ${currentTeam?.id === team.id ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-500">{team.players.length} Players</div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-3/4">
            {currentTeam ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-green-700">{currentTeam.name}</h2>
                  <button
                    onClick={addPlayer}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Player
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentTeam.players.map(player => (
                    <div
                      key={player.id}
                      className="p-4 bg-white rounded-lg shadow border border-gray-200 flex items-center gap-4"
                    >
                      <img
                        src={player.picture}
                        alt={player.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{player.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Select a team or create a new one
              </div>
            )}
          </div>
        </div>

        {modal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {modal.type === 'add-team' ? 'Add New Team' : 'Add New Player'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {modal.type === 'add-team' ? 'Team Name' : 'Player Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                {modal.type === 'add-player' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Picture URL (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.picture}
                      onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Leave empty for random avatar"
                    />
                  </div>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    {modal.type === 'add-team' ? 'Create Team' : 'Add Player'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}