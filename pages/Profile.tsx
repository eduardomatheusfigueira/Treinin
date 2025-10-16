import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import { Sport, Skill, SubSkill } from '../types';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { userSportsData } = useAppData();

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="Foto de Perfil"
            className="w-24 h-24 rounded-full border-4 border-wenge/80 shadow-lg"
          />
        )}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-raisin-black">{user.displayName || 'Usuário'}</h1>
          <p className="text-onyx/80">{user.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-wenge border-b-2 border-wenge/30 pb-2 mb-6">
          Minhas Habilidades
        </h2>
        <div className="space-y-8">
          {userSportsData.map((sport: Sport) => (
            <div key={sport.id}>
              <h3 className="text-xl font-bold text-raisin-black mb-4">{sport.name}</h3>
              <div className="space-y-4">
                {sport.skills.map((skill: Skill) => (
                  <div key={skill.id} className="bg-wenge/80 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-isabelline">{skill.name}</h4>
                    <ul className="mt-2 space-y-2">
                      {skill.subSkills.map((subSkill: SubSkill) => (
                        <li key={subSkill.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <span className="text-bone/90">{subSkill.name}</span>
                          <div className="w-full sm:w-1/2">
                            <ProgressBar progress={subSkill.progress} onProgressChange={() => {}} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;