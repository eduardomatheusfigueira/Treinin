import { SkillCategory, TrainingSession } from '../types';

export const initialSkatingData: SkillCategory[] = [
  {
    id: 'cat-main',
    name: 'Minhas Habilidades',
    skills: [
      // Iniciante
      {
        id: 'skill-1',
        name: 'Frenagem',
        subSkills: [
          { id: 'sub-1-1', name: 'Freio de Calcanhar', progress: 0, description: '', progression: '', youtubeLinks: [] },
          { id: 'sub-1-2', name: 'Freio em Cunha', progress: 0, description: '', progression: '', youtubeLinks: [] },
          { id: 'sub-1-3', name: 'Drag Stop', progress: 0, description: '', progression: '', youtubeLinks: [] },
          { id: 'sub-1-4', name: 'Freio em T', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
      {
        id: 'skill-2',
        name: 'Curvas',
        subSkills: [
          { id: 'sub-2-1', name: 'Curva em A', progress: 0, description: '', progression: '', youtubeLinks: [] },
          { id: 'sub-2-2', name: 'Curva Paralela', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
      {
        id: 'skill-3',
        name: 'Patinar de Costas',
        subSkills: [
           { id: 'sub-3-1', name: 'Swizzles de Costas', progress: 0, description: '', progression: '', youtubeLinks: [] },
           { id: 'sub-3-2', name: 'Passada de Costas', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
      {
        id: 'skill-4',
        name: 'Transições',
        subSkills: [
          { id: 'sub-4-1', name: 'Transição Frente para Trás', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
      // Intermediário
      {
        id: 'skill-5',
        name: 'Patinar com um Pé Só',
        subSkills: [
           { id: 'sub-5-1', name: 'Deslize com um Pé (Reto)', progress: 0, description: '', progression: '', youtubeLinks: [] },
           { id: 'sub-5-2', name: 'Deslize com um Pé (Curvas)', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
      {
        id: 'skill-6',
        name: 'Giros & Saltos',
        subSkills: [
          { id: 'sub-6-1', name: 'Salto 180', progress: 0, description: '', progression: '', youtubeLinks: [] },
          { id: 'sub-6-2', name: 'Salto 360', progress: 0, description: '', progression: '', youtubeLinks: [] },
          { id: 'sub-6-3', name: 'Giro com Dois Pés', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
      {
        id: 'skill-7',
        name: 'Crossovers',
        subSkills: [
           { id: 'sub-7-1', name: 'Crossover para Frente', progress: 0, description: '', progression: '', youtubeLinks: [] },
           { id: 'sub-7-2', name: 'Crossover para Trás', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
      // Avançado
      {
        id: 'skill-8',
        name: 'Slides',
        subSkills: [
          { id: 'sub-8-1', name: 'Powerslide', progress: 0, description: '', progression: '', youtubeLinks: [] },
          { id: 'sub-8-2', name: 'Soul Slide', progress: 0, description: '', progression: '', youtubeLinks: [] },
          { id: 'sub-8-3', name: 'Magic Slide', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
      {
        id: 'skill-9',
        name: 'Grinds',
        subSkills: [
          { id: 'sub-9-1', name: 'Soul Grind', progress: 0, description: '', progression: '', youtubeLinks: [] },
          { id: 'sub-9-2', name: 'Makio Grind', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
      {
        id: 'skill-10',
        name: 'Aéreos',
        subSkills: [
           { id: 'sub-10-1', name: 'Saltos com Grab', progress: 0, description: '', progression: '', youtubeLinks: [] },
           { id: 'sub-10-2', name: 'Backflip', progress: 0, description: '', progression: '', youtubeLinks: [] },
        ],
      },
    ]
  }
];

export const initialTrainingData: TrainingSession[] = [];