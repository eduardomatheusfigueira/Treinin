import React, { useState, useMemo, useEffect } from 'react';
import { useSkatingData } from '../context/SkatingDataContext';
import { TrainingSession, TrainingExercise } from '../types';
import Modal from '../components/Modal';
import { PencilIcon } from '../components/Icons';

const YoutubeLinkManager: React.FC<{
    links: string[];
    onAddLink: (link: string) => void;
    onRemoveLink: (index: number) => void;
    title: string;
}> = ({ links, onAddLink, onRemoveLink, title }) => {
    const [currentLink, setCurrentLink] = useState('');

    const handleAdd = () => {
        if (currentLink && !links.includes(currentLink)) {
            onAddLink(currentLink);
            setCurrentLink('');
        }
    };

    return (
        <div>
            <h4 className="text-md font-semibold text-bone mb-2">{title}</h4>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                    type="text"
                    value={currentLink}
                    onChange={(e) => setCurrentLink(e.target.value)}
                    placeholder="Cole um link do YouTube..."
                    className="flex-grow p-2 bg-raisin-black border border-onyx rounded-lg focus:ring-2 focus:ring-bone focus:outline-none text-sm text-isabelline"
                />
                <button type="button" onClick={handleAdd} className="px-4 py-2 bg-bone/80 text-raisin-black font-semibold rounded-lg hover:bg-bone transition-colors text-sm w-full sm:w-auto">Adicionar</button>
            </div>
            <ul className="space-y-1 break-words text-xs">
                {links.map((link, i) => (
                    <li key={i} className="flex items-center justify-between bg-raisin-black/50 p-1 rounded">
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-bone hover:underline truncate ...">{link}</a>
                        <button type="button" onClick={() => onRemoveLink(i)} className="text-bone/70 hover:text-bone p-1 ml-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}


const TrainingSessionForm: React.FC<{onClose: () => void, session?: TrainingSession}> = ({ onClose, session }) => {
    const { addTrainingSession, updateTrainingSession, userSkillsData } = useSkatingData();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState(60);
    const [exercises, setExercises] = useState<TrainingExercise[]>([]);
    const [sessionYoutubeLinks, setSessionYoutubeLinks] = useState<string[]>([]);

    useEffect(() => {
        if (session) {
            setTitle(session.title);
            setDate(session.date);
            setDuration(session.duration);
            setExercises(session.exercises);
            setSessionYoutubeLinks(session.youtubeLinks || []);
        }
    }, [session]);

    const skillOptions = useMemo(() => {
        const options: { label: string; value: string }[] = [{ label: 'Exercício Personalizado', value: 'custom' }];
        userSkillsData.forEach(cat => {
            cat.skills.forEach(skill => {
                options.push({ label: `Habilidade: ${skill.name}`, value: `skill:${skill.id}`});
                skill.subSkills.forEach(sub => {
                    options.push({ label: `  - ${sub.name}`, value: `subskill:${sub.id}:${skill.id}` });
                });
            });
        });
        return options;
    }, [userSkillsData]);

    const handleAddExercise = () => {
        setExercises([...exercises, { id: `ex-${Date.now()}`, customName: '', youtubeLinks: [] }]);
    };

    const handleRemoveExercise = (index: number) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const handleExerciseChange = (index: number, updates: Partial<TrainingExercise>) => {
        const newExercises = [...exercises];
        const exercise = { ...newExercises[index], ...updates };

        if ('skillSelection' in updates) {
            const selection = (updates as any).skillSelection as string;
            delete (updates as any).skillSelection;
            if (selection === 'custom') {
                exercise.skillId = undefined;
                exercise.subSkillId = undefined;
            } else if (selection.startsWith('skill:')) {
                exercise.skillId = selection.replace('skill:', '');
                exercise.subSkillId = undefined;
                exercise.customName = '';
            } else if (selection.startsWith('subskill:')) {
                const [, subId, skillId] = selection.split(':');
                exercise.skillId = skillId;
                exercise.subSkillId = subId;
                exercise.customName = '';
            }
        }
        
        newExercises[index] = exercise;
        setExercises(newExercises);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const sessionData: Omit<TrainingSession, 'id'> = {
            title,
            date,
            duration,
            exercises,
            notes: session?.notes || '',
            performance: session?.performance || null,
            isCompleted: session?.isCompleted || false,
            youtubeLinks: sessionYoutubeLinks,
        };

        if (session) {
            updateTrainingSession(session.id, sessionData);
        } else {
            addTrainingSession({ ...sessionData, id: `session-${Date.now()}` });
        }
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-bone/80 mb-1">Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 bg-raisin-black border border-onyx rounded-lg focus:ring-2 focus:ring-bone focus:outline-none text-isabelline"
                    required
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-bone/80 mb-1">Data</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 bg-raisin-black border border-onyx rounded-lg focus:ring-2 focus:ring-bone focus:outline-none text-isabelline"
                    required
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-bone/80 mb-1">Duração (minutos)</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full p-2 bg-raisin-black border border-onyx rounded-lg focus:ring-2 focus:ring-bone focus:outline-none text-isabelline"
                    required
                />
            </div>

            <div className="pt-2">
                <YoutubeLinkManager
                    links={sessionYoutubeLinks}
                    onAddLink={(link) => setSessionYoutubeLinks([...sessionYoutubeLinks, link])}
                    onRemoveLink={(index) => setSessionYoutubeLinks(sessionYoutubeLinks.filter((_, i) => i !== index))}
                    title="Tutoriais da Sessão (YouTube)"
                />
            </div>

            <div className="space-y-4 pt-2">
                 <h3 className="text-lg font-semibold text-bone border-t border-raisin-black/50 pt-4">Exercícios</h3>
                 {exercises.map((ex, index) => {
                     const isCustom = !ex.skillId && !ex.subSkillId;
                     let selectValue = 'custom';
                     if (ex.subSkillId && ex.skillId) selectValue = `subskill:${ex.subSkillId}:${ex.skillId}`;
                     else if (ex.skillId) selectValue = `skill:${ex.skillId}`;

                     return (
                        <div key={ex.id} className="p-4 bg-raisin-black/50 rounded-lg space-y-3 border border-onyx/50">
                             <div className="flex justify-between items-center">
                                 <select
                                     value={selectValue}
                                     onChange={(e) => handleExerciseChange(index, { skillSelection: e.target.value } as any)}
                                     className="w-full p-2 bg-raisin-black border border-onyx rounded-md focus:ring-2 focus:ring-bone focus:outline-none text-isabelline"
                                 >
                                     {skillOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                 </select>
                                 <button type="button" onClick={() => handleRemoveExercise(index)} className="ml-3 text-bone/70 hover:text-bone p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                 </button>
                             </div>
                             {isCustom && (
                                <input
                                    type="text"
                                    placeholder="Nome do exercício personalizado"
                                    value={ex.customName}
                                    onChange={(e) => handleExerciseChange(index, { customName: e.target.value })}
                                    className="w-full p-2 bg-raisin-black border border-onyx rounded-md text-isabelline"
                                />
                             )}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input type="number" placeholder="Séries" value={ex.sets || ''} onChange={e => handleExerciseChange(index, { sets: Number(e.target.value) || undefined })} className="w-full p-2 bg-raisin-black border border-onyx rounded-md text-isabelline" />
                                <input type="number" placeholder="Reps" value={ex.reps || ''} onChange={e => handleExerciseChange(index, { reps: Number(e.target.value) || undefined })} className="w-full p-2 bg-raisin-black border border-onyx rounded-md text-isabelline" />
                                <input type="number" placeholder="Segs" value={ex.duration || ''} onChange={e => handleExerciseChange(index, { duration: Number(e.target.value) || undefined })} className="w-full p-2 bg-raisin-black border border-onyx rounded-md text-isabelline" />
                            </div>
                             <div className="pt-2">
                                <YoutubeLinkManager
                                    links={ex.youtubeLinks || []}
                                    onAddLink={(link) => handleExerciseChange(index, { youtubeLinks: [...(ex.youtubeLinks || []), link] })}
                                    onRemoveLink={(linkIndex) => handleExerciseChange(index, { youtubeLinks: (ex.youtubeLinks || []).filter((_, i) => i !== linkIndex) })}
                                    title="Tutoriais do Exercício"
                                />
                            </div>
                        </div>
                    )
                 })}
                 <button type="button" onClick={handleAddExercise} className="w-full py-2 text-bone bg-wenge/50 hover:bg-wenge rounded-lg transition-colors">
                     + Adicionar Exercício
                 </button>
            </div>

            <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-onyx text-isabelline rounded-lg hover:bg-raisin-black/80 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-bone text-raisin-black font-semibold rounded-lg hover:bg-isabelline transition-colors">
                    {session ? 'Atualizar Sessão' : 'Agendar Sessão'}
                </button>
            </div>
        </form>
    )
}

const CompleteSessionModal: React.FC<{
    session: TrainingSession;
    onClose: () => void;
    onComplete: (sessionId: string, performance: 'Bom' | 'Ok' | 'Ruim', notes: string) => void;
}> = ({ session, onClose, onComplete }) => {
    const [performance, setPerformance] = useState<'Bom' | 'Ok' | 'Ruim' | null>(null);
    const [notes, setNotes] = useState('');

    const handleSubmit = () => {
        if (performance) {
            onComplete(session.id, performance, notes);
        }
    };
    
    const performanceStyles = {
        'Bom': {
            selected: 'bg-bone text-raisin-black',
            unselected: 'bg-onyx/50 hover:bg-onyx'
        },
        'Ok': {
            selected: 'bg-onyx text-isabelline',
            unselected: 'bg-onyx/50 hover:bg-onyx'
        },
        'Ruim': {
            selected: 'bg-raisin-black text-isabelline/80',
            unselected: 'bg-onyx/50 hover:bg-onyx'
        }
    };

    return (
        <Modal isOpen={!!session} onClose={onClose} title={`Concluir: ${session.title}`}>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-bone mb-3">Como foi a sessão?</h3>
                    <div className="flex gap-4">
                        {(['Bom', 'Ok', 'Ruim'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPerformance(p)}
                                className={`flex-1 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                                    performance === p ? performanceStyles[p].selected : performanceStyles[p].unselected
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-bone mb-2">Anotações</h3>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Alguma observação sobre seu desempenho, coisas para lembrar para a próxima vez, etc."
                        className="w-full h-32 p-3 bg-raisin-black border border-onyx rounded-lg focus:ring-2 focus:ring-bone focus:outline-none text-isabelline"
                    />
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-onyx text-isabelline rounded-lg hover:bg-raisin-black/80">Cancelar</button>
                    <button onClick={handleSubmit} disabled={!performance} className="px-4 py-2 bg-bone text-raisin-black font-semibold rounded-lg hover:bg-isabelline transition-colors disabled:bg-onyx/50 disabled:cursor-not-allowed">
                        Concluir Sessão
                    </button>
                </div>
            </div>
        </Modal>
    );
};


const TrainingPlanner: React.FC = () => {
    const { trainingData, updateTrainingSession, deleteTrainingSession, userSkillsData } = useSkatingData();
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [sessionToEdit, setSessionToEdit] = useState<TrainingSession | null>(null);
    const [sessionToComplete, setSessionToComplete] = useState<TrainingSession | null>(null);

    const plannedSessions = trainingData.filter(s => !s.isCompleted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const completedSessions = trainingData.filter(s => s.isCompleted).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const handleMarkComplete = (sessionId: string, performance: 'Bom' | 'Ok' | 'Ruim', notes: string) => {
        updateTrainingSession(sessionId, { isCompleted: true, performance, notes: notes || '' });
        setSessionToComplete(null);
    };

    const handleDelete = (sessionId: string) => {
        if (window.confirm('Tem certeza de que deseja excluir esta sessão de treino? Esta ação não pode ser desfeita.')) {
            deleteTrainingSession(sessionId);
        }
    };

    const handleEdit = (session: TrainingSession) => {
        setSessionToEdit(session);
        setIsPlanModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsPlanModalOpen(false);
        setSessionToEdit(null);
    };

    const getExerciseName = (exercise: TrainingExercise): string => {
        if (exercise.customName) return exercise.customName;
        for (const cat of userSkillsData) {
            for (const skill of cat.skills) {
                if (skill.id === exercise.skillId && !exercise.subSkillId) return skill.name;
                const subSkill = skill.subSkills.find(s => s.id === exercise.subSkillId);
                if (subSkill) return subSkill.name;
            }
        }
        return 'Habilidade sem nome';
    };

    const formatExerciseDetails = (ex: TrainingExercise) => {
        const parts = [];
        if (ex.sets) parts.push(`${ex.sets} séries`);
        if (ex.reps) parts.push(`${ex.reps} reps`);
        if (ex.duration) parts.push(`${ex.duration} segs`);
        return parts.join(', ');
    };
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00'); // Assume local timezone
        return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between">
                 <h1 className="text-3xl sm:text-4xl font-bold text-raisin-black">Planejador de Treinos</h1>
                 <button onClick={() => setIsPlanModalOpen(true)} className="px-5 py-2.5 bg-raisin-black text-bone font-semibold rounded-lg hover:bg-onyx transition-colors shadow-lg shadow-onyx/20 w-full sm:w-auto">
                     Agendar Nova Sessão
                 </button>
            </div>
            
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-wenge border-b-2 border-wenge/30 pb-2">Sessões Agendadas</h2>
                {plannedSessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plannedSessions.map(session => (
                            <div key={session.id} className="bg-wenge/80 p-6 rounded-xl border border-raisin-black flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-isabelline">{session.title}</h3>
                                    <p className="text-bone/70">{formatDate(session.date)}</p>
                                    <p className="text-bone/70 mb-4">{session.duration} minutos</p>
                                    {session.youtubeLinks && session.youtubeLinks.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-bone mb-1">Links da Sessão:</h4>
                                            <ul className="space-y-1 text-xs list-disc list-inside">
                                                {session.youtubeLinks.map((link, i) => (
                                                     <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="text-bone hover:underline">{link}</a></li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <h4 className="text-sm font-semibold text-isabelline/90 mb-1">Exercícios:</h4>
                                    <ul className="space-y-2 text-sm">
                                        {session.exercises.map(ex => (
                                            <li key={ex.id} className="text-isabelline/90">
                                                <span className="font-semibold">{getExerciseName(ex)}</span>
                                                <span className="text-bone/70 ml-2">({formatExerciseDetails(ex)})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => setSessionToComplete(session)} className="w-full px-4 py-2 bg-bone text-raisin-black font-semibold rounded-lg hover:bg-isabelline transition-colors">Marcar como Concluída</button>
                                    <button onClick={() => handleEdit(session)} className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDelete(session.id)} className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-wenge/70">Nenhuma sessão agendada. Hora de patinar!</p>
                )}
            </section>
            
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-wenge border-b-2 border-wenge/30 pb-2">Histórico de Treinos</h2>
                 {completedSessions.length > 0 ? (
                    <div className="space-y-4">
                        {completedSessions.map(session => (
                            <details key={session.id} className="bg-wenge/80 rounded-xl border border-raisin-black overflow-hidden">
                                <summary className="p-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between cursor-pointer">
                                    <div className="flex-grow">
                                       <h3 className="text-xl font-bold text-isabelline">{session.title}</h3>
                                       <p className="text-bone/70">{new Date(session.date  + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                           session.performance === 'Bom' ? 'bg-bone text-raisin-black' :
                                           session.performance === 'Ok' ? 'bg-onyx/80 text-bone' :
                                           'bg-raisin-black/80 text-bone/80'
                                       }`}>
                                           {session.performance}
                                       </div>
                                       <button onClick={(e) => { e.preventDefault(); handleEdit(session); }} className="p-2 text-blue-400/70 hover:text-blue-400 hover:bg-blue-500/20 rounded-full transition-colors">
                                            <PencilIcon className="h-5 w-5" />
                                       </button>
                                       <button onClick={(e) => { e.preventDefault(); handleDelete(session.id); }} className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/20 rounded-full transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                       </button>
                                    </div>
                                </summary>
                                <div className="px-6 pb-6 border-t border-raisin-black">
                                    <p className="text-isabelline/90 mt-4 break-words"><span className="font-semibold text-isabelline">Anotações:</span> {session.notes || "Sem anotações."}</p>
                                     {session.youtubeLinks && session.youtubeLinks.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-isabelline mb-2">Links da Sessão:</h4>
                                            <ul className="space-y-1 text-sm list-disc list-inside">
                                                {session.youtubeLinks.map((link, i) => (
                                                     <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="text-bone hover:underline">{link}</a></li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                     <div className="mt-4">
                                        <h4 className="font-semibold text-isabelline mb-2">Exercícios Realizados:</h4>
                                        <ul className="space-y-2 text-sm list-disc list-inside">
                                            {session.exercises.map(ex => (
                                                <li key={ex.id} className="text-isabelline/90">
                                                    <div>
                                                        <span className="font-semibold">{getExerciseName(ex)}</span>
                                                        <span className="text-bone/70 ml-2">({formatExerciseDetails(ex)})</span>
                                                    </div>
                                                     {ex.youtubeLinks && ex.youtubeLinks.length > 0 && (
                                                        <ul className="pl-5 mt-1 space-y-1 text-xs list-disc list-inside">
                                                            {ex.youtubeLinks.map((link, i) => (
                                                                <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="text-bone hover:underline">{link}</a></li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>
                ) : (
                    <p className="text-wenge/70">Nenhuma sessão concluída ainda. Conclua uma sessão agendada para vê-la aqui.</p>
                )}
            </section>
            
            <Modal isOpen={isPlanModalOpen} onClose={handleCloseModal} title={sessionToEdit ? "Editar Sessão de Treino" : "Agendar Nova Sessão de Treino"}>
                <TrainingSessionForm onClose={handleCloseModal} session={sessionToEdit || undefined} />
            </Modal>
            
            {sessionToComplete && (
                <CompleteSessionModal
                    session={sessionToComplete}
                    onClose={() => setSessionToComplete(null)}
                    onComplete={handleMarkComplete}
                />
            )}
        </div>
    );
};

export default TrainingPlanner;