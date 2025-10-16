import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { Skill, Sport } from '../types';
import { PlusIcon, TrashIcon } from '../components/Icons';
import ConfirmationModal from '../components/ConfirmationModal';

const InlineAddForm: React.FC<{
  placeholder: string;
  onSave: (name: string) => void;
  onCancel: () => void;
  cta: string;
}> = ({ placeholder, onSave, onCancel, cta }) => {
  const [name, setName] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2 p-4 bg-wenge/30 rounded-lg mt-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        className="flex-grow p-2 bg-raisin-black border border-onyx rounded-lg focus:ring-2 focus:ring-bone focus:outline-none text-isabelline"
        autoFocus
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-bone/80 hover:text-bone transition-colors">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-bone text-raisin-black font-semibold rounded-lg hover:bg-isabelline transition-colors">{cta}</button>
      </div>
    </form>
  );
};

const SportTab: React.FC<{ sport: Sport, isActive: boolean, onClick: () => void }> = ({ sport, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${
            isActive
                ? 'bg-wenge/80 text-bone border-b-4 border-bone'
                : 'text-wenge/70 hover:bg-wenge/20'
        }`}
    >
        {sport.name}
    </button>
);

const SkillShop: React.FC = () => {
  const { availableSportsData, userSportsData, addSkillFromShop, addSkillToShop, deleteSkillFromShop, addSport } = useAppData();
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingSport, setIsAddingSport] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<{ skill: Skill, sportId: string } | null>(null);
  const [activeSportId, setActiveSportId] = useState<string | null>(null);

  useEffect(() => {
    if (availableSportsData.length > 0 && !activeSportId) {
      setActiveSportId(availableSportsData[0].id);
    }
  }, [availableSportsData, activeSportId, setActiveSportId]);

  const userSkillIds = useMemo(() => {
    const ids = new Set<string>();
    userSportsData.forEach(sport => {
        sport.skills.forEach(skill => ids.add(skill.id));
    });
    return ids;
  }, [userSportsData]);

  const activeSport = availableSportsData.find(s => s.id === activeSportId);

  const handleConfirmDelete = () => {
    if (skillToDelete) {
        deleteSkillFromShop(skillToDelete.sportId, skillToDelete.skill.id);
        setSkillToDelete(null);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-raisin-black">Explorar Habilidades</h1>
        <Link to="/" className="px-5 py-2.5 bg-wenge/80 text-bone font-semibold rounded-lg hover:bg-wenge transition-colors shadow-lg shadow-wenge/20 w-full sm:w-auto">
          &larr; Voltar para o Painel
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <p className="text-onyx/80 max-w-2xl">
          Aqui está um catálogo de habilidades. Adicione as que você quer praticar ao seu painel pessoal, crie uma nova para a comunidade ou adicione um novo esporte.
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
            <button
                onClick={() => setIsAddingSport(prev => !prev)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-raisin-black text-bone rounded-lg hover:bg-onyx transition-colors w-full sm:w-auto flex-shrink-0"
            >
                <PlusIcon className="w-5 h-5" />
                <span>{isAddingSport ? 'Cancelar' : 'Novo Esporte'}</span>
            </button>
        </div>
      </div>

      {isAddingSport && (
            <InlineAddForm
                placeholder="Nome do novo esporte"
                onSave={(name) => {
                    addSport(name);
                    setIsAddingSport(false);
                }}
                onCancel={() => setIsAddingSport(false)}
                cta="Salvar Esporte"
            />
        )}


      <div className="border-b border-wenge/30 flex flex-wrap items-center">
          {availableSportsData.map(sport => (
              <SportTab
                  key={sport.id}
                  sport={sport}
                  isActive={activeSportId === sport.id}
                  onClick={() => {
                    setActiveSportId(sport.id);
                    setIsAddingSkill(false);
                  }}
              />
          ))}
      </div>

      {activeSport ? (
        <section>
            <div className="flex justify-end mb-4">
                 <button
                    onClick={() => setIsAddingSkill(prev => !prev)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-raisin-black text-bone rounded-lg hover:bg-onyx transition-colors w-full sm:w-auto flex-shrink-0"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>{isAddingSkill ? 'Cancelar' : 'Criar Nova Habilidade'}</span>
                </button>
            </div>

            {isAddingSkill && (
                <InlineAddForm
                    placeholder="Nome da nova habilidade para a loja"
                    onSave={(name) => {
                        addSkillToShop(activeSport.id, name);
                        setIsAddingSkill(false);
                    }}
                    onCancel={() => setIsAddingSkill(false)}
                    cta="Salvar Habilidade"
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {activeSport.skills.map((skill: Skill) => {
                const isAdded = userSkillIds.has(skill.id);
                return (
                <div key={skill.id} className="bg-wenge/80 rounded-xl border border-raisin-black/50 p-6 flex flex-col justify-between">
                    <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-isabelline mb-2 pr-2">{skill.name}</h3>
                        <button
                            onClick={() => setSkillToDelete({ skill, sportId: activeSport.id })}
                            className="text-bone/50 hover:text-bone transition-colors p-1 flex-shrink-0"
                            aria-label={`Excluir ${skill.name} da loja`}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <ul className="space-y-1 pl-4 list-disc text-bone/70 mb-4">
                        {skill.subSkills.slice(0, 4).map(sub => (
                        <li key={sub.id}>{sub.name}</li>
                        ))}
                        {skill.subSkills.length > 4 && <li className="italic">e mais...</li>}
                    </ul>
                    </div>
                    <button
                    onClick={() => addSkillFromShop(activeSport.id, skill)}
                    disabled={isAdded}
                    className={`w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 font-semibold rounded-lg transition-colors ${
                        isAdded
                        ? 'bg-onyx/50 text-bone/60 cursor-not-allowed'
                        : 'bg-bone text-raisin-black hover:bg-isabelline'
                    }`}
                    >
                    <PlusIcon className="w-5 h-5" />
                    {isAdded ? 'Adicionada' : 'Adicionar aos treinos'}
                    </button>
                </div>
                );
            })}
            </div>
        </section>
      ) : (
          <p>Selecione um esporte para ver as habilidades.</p>
      )}

      {skillToDelete && (
        <ConfirmationModal
            isOpen={!!skillToDelete}
            onClose={() => setSkillToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Excluir Habilidade da Loja"
        >
            <p>
                Tem certeza que deseja excluir permanentemente <strong>"{skillToDelete.skill.name}"</strong>?
            </p>
            <p className="mt-2 text-sm text-bone/70">
                Esta ação removerá a habilidade do catálogo e também do seu painel de habilidades, caso já tenha sido adicionada. Esta ação não pode ser desfeita.
            </p>
        </ConfirmationModal>
      )}
    </div>
  );
};

export default SkillShop;