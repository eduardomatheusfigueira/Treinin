import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSkatingData } from '../context/SkatingDataContext';
import { Skill } from '../types';
import { PlusIcon, TrashIcon } from '../components/Icons';
import ConfirmationModal from '../components/ConfirmationModal';

const InlineAddForm: React.FC<{
  placeholder: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}> = ({ placeholder, onSave, onCancel }) => {
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
        <button type="submit" className="px-4 py-2 bg-bone text-raisin-black font-semibold rounded-lg hover:bg-isabelline transition-colors">Salvar Habilidade</button>
      </div>
    </form>
  );
};


const SkillShop: React.FC = () => {
  const { availableSkillsData, userSkillsData, addSkillFromShop, addSkillToShop, deleteSkillFromShop } = useSkatingData();
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const userSkillIds = useMemo(() => {
    const ids = new Set<string>();
    if (userSkillsData.length > 0) {
      userSkillsData[0].skills.forEach(skill => ids.add(skill.id));
    }
    return ids;
  }, [userSkillsData]);

  // Assuming availableSkillsData also follows the same single-category structure for simplicity
  const availableSkillsCategory = availableSkillsData[0];

  const handleConfirmDelete = () => {
    if (skillToDelete) {
        deleteSkillFromShop(skillToDelete.id);
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

      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-onyx/80 max-w-2xl">
              Aqui está um catálogo de habilidades de patinação. Adicione as que você quer praticar ao seu painel pessoal ou crie uma nova para a comunidade.
            </p>
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
                    addSkillToShop(name);
                    setIsAddingSkill(false);
                }}
                onCancel={() => setIsAddingSkill(false)}
            />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {availableSkillsCategory.skills.map((skill: Skill) => {
            const isAdded = userSkillIds.has(skill.id);
            return (
              <div key={skill.id} className="bg-wenge/80 rounded-xl border border-raisin-black/50 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-isabelline mb-2 pr-2">{skill.name}</h3>
                     <button
                        onClick={() => setSkillToDelete(skill)}
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
                  onClick={() => addSkillFromShop(skill)}
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

      {skillToDelete && (
        <ConfirmationModal
            isOpen={!!skillToDelete}
            onClose={() => setSkillToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Excluir Habilidade da Loja"
        >
            <p>
                Tem certeza que deseja excluir permanentemente <strong>"{skillToDelete.name}"</strong>?
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