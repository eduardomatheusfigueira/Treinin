import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import { ChevronDownIcon, SparklesIcon, PlusIcon, TrashIcon, BookOpenIcon } from '../components/Icons';
import { Skill, SubSkill, Sport } from '../types';
import Modal from '../components/Modal';
import { getSkillTips } from '../services/geminiService';
import ConfirmationModal from '../components/ConfirmationModal';
import YoutubeEmbed from '../components/YoutubeEmbed';

interface SkillDetailModalProps {
  subSkill: SubSkill | null;
  sportName: string;
  onClose: () => void;
  onUpdate: (updates: Partial<SubSkill>) => void;
}

type ItemToDelete = {
    type: 'skill' | 'subskill';
    name: string;
    sportId: string;
    skillId: string;
    subSkillId?: string;
};

const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ subSkill, sportName, onClose, onUpdate }) => {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  if (!subSkill) return null;

  const handleAddLink = () => {
    if (youtubeLink && !subSkill.youtubeLinks.includes(youtubeLink)) {
      onUpdate({ youtubeLinks: [...subSkill.youtubeLinks, youtubeLink] });
      setYoutubeLink('');
    }
  };

  const handleDeleteLink = (index: number) => {
    const newLinks = [...subSkill.youtubeLinks];
    newLinks.splice(index, 1);
    onUpdate({ youtubeLinks: newLinks });
  };
  
  const handleGenerateTips = async () => {
    setIsLoadingAi(true);
    const tips = await getSkillTips(subSkill.name, sportName);
    onUpdate({ description: tips });
    setIsLoadingAi(false);
  };

  return (
    <Modal isOpen={!!subSkill} onClose={onClose} title={subSkill.name}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-bone mb-2">Descrição & Progressão</h3>
          <button
              onClick={handleGenerateTips}
              disabled={isLoadingAi}
              className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-onyx text-isabelline rounded-lg hover:bg-raisin-black transition-colors disabled:bg-wenge/50"
          >
              <SparklesIcon className="w-5 h-5" />
              {isLoadingAi ? 'Gerando...' : 'Obter Dicas da IA'}
          </button>
          {isLoadingAi && <div className="text-sm text-bone/70">Buscando dicas do nosso treinador IA...</div>}
          <textarea
            value={subSkill.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Como fazer esta habilidade, passos de progressão..."
            className="w-full h-40 p-3 bg-raisin-black border border-onyx rounded-lg focus:ring-2 focus:ring-bone focus:outline-none text-isabelline"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-bone mb-2">Tutoriais (YouTube)</h3>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="Cole um link do YouTube..."
              className="flex-grow p-2 bg-raisin-black border border-onyx rounded-lg focus:ring-2 focus:ring-bone focus:outline-none text-isabelline"
            />
            <button onClick={handleAddLink} className="px-4 py-2 bg-bone text-raisin-black font-semibold rounded-lg hover:bg-isabelline transition-colors w-full sm:w-auto">Adicionar</button>
          </div>
          <div className="space-y-4">
            {subSkill.youtubeLinks.map((link, i) => (
              <YoutubeEmbed key={i} url={link} onDelete={() => handleDeleteLink(i)} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

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
    <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2 p-4 bg-wenge/30 rounded-lg mt-2">
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
        <button type="submit" className="px-4 py-2 bg-bone text-raisin-black font-semibold rounded-lg hover:bg-isabelline transition-colors">Salvar</button>
      </div>
    </form>
  );
};

const SubSkillItem: React.FC<{ subSkill: SubSkill, onUpdateProgress: (progress: number) => void, onSelect: () => void, onDelete: () => void }> = ({ subSkill, onUpdateProgress, onSelect, onDelete }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-wenge/50 rounded-lg hover:bg-wenge transition-colors">
      <div className="flex items-center gap-3 mb-2 sm:mb-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-bone/50 hover:text-bone transition-colors p-1"
          aria-label={`Excluir ${subSkill.name}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        <button onClick={onSelect} className="text-lg text-left text-isabelline hover:text-bone">
          {subSkill.name}
        </button>
      </div>
      <ProgressBar progress={subSkill.progress} onProgressChange={onUpdateProgress} />
    </div>
  );
};


const SkillItem: React.FC<{ 
    sportId: string,
    sportName: string,
    skill: Skill,
    onRequestDeleteSkill: (skillId: string, skillName: string) => void,
    onRequestDeleteSubSkill: (skillId: string, subSkillId: string, subSkillName: string) => void
}> = ({ sportId, sportName, skill, onRequestDeleteSkill, onRequestDeleteSubSkill }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateSubSkill, addSubSkill } = useAppData();
  const [selectedSubSkill, setSelectedSubSkill] = useState<SubSkill | null>(null);
  const [isAddingSubSkill, setIsAddingSubSkill] = useState(false);

  const overallProgress = useMemo(() => {
    if (skill.subSkills.length === 0) return 0;
    const total = skill.subSkills.reduce((sum, s) => sum + s.progress, 0);
    return total / skill.subSkills.length;
  }, [skill.subSkills]);

  const handleUpdateProgress = useCallback((subSkillId: string, progress: number) => {
    updateSubSkill(sportId, skill.id, subSkillId, { progress });
  }, [sportId, skill.id, updateSubSkill]);

  const handleUpdateSubSkillDetails = useCallback((updates: Partial<SubSkill>) => {
    if (selectedSubSkill) {
      updateSubSkill(sportId, skill.id, selectedSubSkill.id, updates);
      setSelectedSubSkill(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [sportId, skill.id, updateSubSkill, selectedSubSkill]);
  
  const handleDeleteSkill = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRequestDeleteSkill(skill.id, skill.name);
  };

  const handleDeleteSubSkill = (subSkillId: string, subSkillName: string) => {
    onRequestDeleteSubSkill(skill.id, subSkillId, subSkillName);
  };

  return (
    <div className="bg-wenge/80 rounded-xl border border-raisin-black/50 overflow-hidden">
        <div className="w-full flex items-center justify-between p-5 text-left cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center gap-4 flex-grow">
                <button
                    onClick={handleDeleteSkill}
                    className="text-bone/50 hover:text-bone transition-colors p-1 z-10 relative"
                    aria-label={`Excluir ${skill.name}`}
                >
                    <TrashIcon className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-4 flex-grow">
                    <div className="w-2 h-10 rounded-full bg-bone" style={{opacity: overallProgress / 10}}></div>
                    <h3 className="text-xl font-semibold text-isabelline">{skill.name}</h3>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-sm text-bone/70 hidden sm:block">{Math.round((overallProgress / 10) * 100)}% Dominado</div>
                <ChevronDownIcon className={`w-6 h-6 text-bone/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </div>
      
      {isOpen && (
        <div className="p-5 pt-0">
            <div className="border-t border-raisin-black/50 pt-4 space-y-3">
            {skill.subSkills.map(subSkill => (
                <SubSkillItem 
                    key={subSkill.id} 
                    subSkill={subSkill} 
                    onUpdateProgress={(p) => handleUpdateProgress(subSkill.id, p)}
                    onSelect={() => setSelectedSubSkill(subSkill)}
                    onDelete={() => handleDeleteSubSkill(subSkill.id, subSkill.name)}
                />
            ))}
             <div className="mt-4">
              {isAddingSubSkill ? (
                <InlineAddForm
                  placeholder="Nome da nova sub-habilidade"
                  onSave={(name) => {
                    addSubSkill(sportId, skill.id, name);
                    setIsAddingSubSkill(false);
                  }}
                  onCancel={() => setIsAddingSubSkill(false)}
                />
              ) : (
                <button 
                  onClick={() => setIsAddingSubSkill(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-bone bg-wenge/50 hover:bg-wenge rounded-lg transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Adicionar Sub-Habilidade
                </button>
              )}
            </div>
            </div>
        </div>
      )}
      <SkillDetailModal 
        subSkill={selectedSubSkill} 
        sportName={sportName}
        onClose={() => setSelectedSubSkill(null)}
        onUpdate={handleUpdateSubSkillDetails}
      />
    </div>
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

const SkillsDashboard: React.FC = () => {
  const { userSportsData, addCustomSkill, deleteSkill, deleteSubSkill } = useAppData();
  const [addingSkillToSport, setAddingSkillToSport] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);
  const [activeSportId, setActiveSportId] = useState<string | null>(null);

  useEffect(() => {
    if (userSportsData.length > 0 && !activeSportId) {
      setActiveSportId(userSportsData[0].id);
    }
  }, [userSportsData, activeSportId]);

  if (!userSportsData || userSportsData.length === 0) {
    return <div>Carregando...</div>
  }

  const activeSport = userSportsData.find(s => s.id === activeSportId);

  const handleRequestDeleteSkill = (sportId: string, skillId: string, skillName: string) => {
    setItemToDelete({
        type: 'skill',
        name: skillName,
        sportId: sportId,
        skillId: skillId,
    });
  };

  const handleRequestDeleteSubSkill = (sportId: string, skillId: string, subSkillId: string, subSkillName: string) => {
      setItemToDelete({
          type: 'subskill',
          name: subSkillName,
          sportId: sportId,
          skillId: skillId,
          subSkillId: subSkillId,
      });
  };

  const handleConfirmDelete = () => {
      if (!itemToDelete) return;

      if (itemToDelete.type === 'skill') {
          deleteSkill(itemToDelete.sportId, itemToDelete.skillId);
      } else if (itemToDelete.type === 'subskill' && itemToDelete.subSkillId) {
          deleteSubSkill(itemToDelete.sportId, itemToDelete.skillId, itemToDelete.subSkillId);
      }
      setItemToDelete(null);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-raisin-black">Painel de Habilidades</h1>
        <Link to="/skill-shop" className="flex items-center justify-center sm:justify-start gap-2 px-5 py-2.5 bg-raisin-black text-bone font-semibold rounded-lg hover:bg-onyx transition-colors shadow-lg shadow-onyx/20 w-full sm:w-auto">
          <BookOpenIcon className="w-5 h-5" />
          <span>Explorar Habilidades</span>
        </Link>
      </div>

      <div className="border-b border-wenge/30">
          {userSportsData.map(sport => (
              <SportTab
                  key={sport.id}
                  sport={sport}
                  isActive={activeSportId === sport.id}
                  onClick={() => setActiveSportId(sport.id)}
              />
          ))}
      </div>
      
      {activeSport ? (
        <section key={activeSport.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-wenge border-b-2 border-wenge/30 pb-2 flex-grow">{activeSport.name}</h2>
              <button
                  onClick={() => setAddingSkillToSport(activeSport.id === addingSkillToSport ? null : activeSport.id)}
                  className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm bg-wenge/80 text-bone rounded-lg hover:bg-wenge transition-colors w-full sm:w-auto"
                  aria-label={`Adicionar nova habilidade personalizada`}
              >
                  <PlusIcon className="w-5 h-5" />
                  <span>Nova Habilidade (Personalizada)</span>
              </button>
            </div>

            <div className="space-y-4">
              {activeSport.skills.length > 0 ? (
                  activeSport.skills.map(skill => (
                    <SkillItem
                      key={skill.id}
                      sportId={activeSport.id}
                      sportName={activeSport.name}
                      skill={skill}
                      onRequestDeleteSkill={(skillId, name) => handleRequestDeleteSkill(activeSport.id, skillId, name)}
                      onRequestDeleteSubSkill={(skillId, subId, name) => handleRequestDeleteSubSkill(activeSport.id, skillId, subId, name)}
                    />
                  ))
              ) : (
                  <div className="text-center py-10 px-6 bg-wenge/30 rounded-lg border-2 border-dashed border-wenge/50">
                      <h3 className="text-xl font-semibold text-wenge">Seu painel de habilidades para {activeSport.name} está vazio!</h3>
                      <p className="text-onyx/80 mt-2 mb-4">Comece explorando o nosso catálogo de habilidades e adicione as que você quer treinar.</p>
                      <Link to="/skill-shop" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-raisin-black text-bone font-semibold rounded-lg hover:bg-onyx transition-colors shadow-lg shadow-onyx/20">
                          <BookOpenIcon className="w-5 h-5" />
                          <span>Ir para a Loja de Habilidades</span>
                      </Link>
                  </div>
              )}
              {addingSkillToSport === activeSport.id && (
                  <InlineAddForm
                  placeholder="Nome da nova habilidade personalizada"
                  onSave={(name) => {
                      addCustomSkill(activeSport.id, name);
                      setAddingSkillToSport(null);
                  }}
                  onCancel={() => setAddingSkillToSport(null)}
                  />
              )}
            </div>
        </section>
      ) : (
        <div>Selecione um esporte.</div>
      )}

        {itemToDelete && (
            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={`Excluir ${itemToDelete.type === 'skill' ? 'Habilidade' : 'Sub-habilidade'}`}
            >
                <p>
                    Tem certeza que deseja excluir <strong>"{itemToDelete.name}"</strong>?
                </p>
                {itemToDelete.type === 'skill' && (
                    <p className="mt-2 text-sm text-bone/70">
                        Todas as sub-habilidades associadas também serão removidas. Esta ação não pode ser desfeita.
                    </p>
                )}
                 {itemToDelete.type !== 'skill' && (
                    <p className="mt-2 text-sm text-bone/70">
                        Esta ação não pode ser desfeita.
                    </p>
                )}
            </ConfirmationModal>
        )}
    </div>
  );
};

export default SkillsDashboard;