import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { SkillCategory, SubSkill, TrainingSession, Skill } from '../types';
import { initialSkatingData, initialTrainingData } from '../data/initialData';
import { useAuth } from './AuthContext';
import { loadUserSkills, loadTrainingData, saveUserData } from '../services/firestoreService';

interface SkatingDataContextType {
  userSkillsData: SkillCategory[];
  availableSkillsData: SkillCategory[];
  trainingData: TrainingSession[];
  updateSubSkill: (categoryId: string, skillId: string, subSkillId: string, updates: Partial<SubSkill>) => void;
  addTrainingSession: (session: TrainingSession) => void;
  updateTrainingSession: (sessionId: string, updates: Partial<TrainingSession>) => void;
  deleteTrainingSession: (sessionId: string) => void;
  addCustomSkill: (categoryId: string, skillName: string) => void;
  addSubSkill: (categoryId: string, skillId: string, subSkillName: string) => void;
  deleteSkill: (categoryId: string, skillId: string) => void;
  deleteSubSkill: (categoryId: string, skillId: string, subSkillId: string) => void;
  addSkillFromShop: (skillToAdd: Skill) => void;
  addSkillToShop: (skillName: string) => void;
  deleteSkillFromShop: (skillId: string) => void;
}

const SkatingDataContext = createContext<SkatingDataContextType | undefined>(undefined);

const initialUserSkills: SkillCategory[] = [{
  id: 'cat-main',
  name: 'Minhas Habilidades',
  skills: [],
}];

export const SkatingDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userSkillsData, setUserSkillsData] = useState<SkillCategory[]>(initialUserSkills);
  const [availableSkillsData, setAvailableSkillsData] = useState<SkillCategory[]>(initialSkatingData);
  const [trainingData, setTrainingData] = useState<TrainingSession[]>(initialTrainingData);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsDataLoaded(false);
        const [skills, trainings] = await Promise.all([
          loadUserSkills(user.uid),
          loadTrainingData(user.uid)
        ]);

        if (skills) {
          setUserSkillsData(skills);
        } else {
          setUserSkillsData(initialUserSkills);
        }

        if (trainings) {
          const migratedTrainings = trainings.map(t => {
            const exercises = t.exercises.map(ex => {
              if (ex.duration && ex.duration < 1000) { // Heuristic to detect old data
                return { ...ex, duration: ex.duration * 60 };
              }
              return ex;
            });
            return { ...t, exercises };
          });
          setTrainingData(migratedTrainings);
        } else {
          setTrainingData(initialTrainingData);
        }
        setIsDataLoaded(true);
      } else {
        setUserSkillsData(initialUserSkills);
        setTrainingData(initialTrainingData);
        setAvailableSkillsData(initialSkatingData);
        setIsDataLoaded(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (user && isDataLoaded) {
      saveUserData(user.uid, userSkillsData, trainingData);
    }
  }, [user, userSkillsData, trainingData, isDataLoaded]);

  const updateSubSkill = useCallback((categoryId: string, skillId: string, subSkillId: string, updates: Partial<SubSkill>) => {
    setUserSkillsData(prevData =>
      prevData.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            skills: category.skills.map(skill => {
              if (skill.id === skillId) {
                return {
                  ...skill,
                  subSkills: skill.subSkills.map(subSkill => {
                    if (subSkill.id === subSkillId) {
                      return { ...subSkill, ...updates };
                    }
                    return subSkill;
                  }),
                };
              }
              return skill;
            }),
          };
        }
        return category;
      })
    );
  }, []);

  const addTrainingSession = useCallback((session: TrainingSession) => {
    setTrainingData(prev => [...prev, session]);
  }, []);

  const updateTrainingSession = useCallback((sessionId: string, updates: Partial<TrainingSession>) => {
    setTrainingData(prev => prev.map(session => session.id === sessionId ? { ...session, ...updates } : session));
  }, []);

  const deleteTrainingSession = useCallback((sessionId: string) => {
    setTrainingData(prev => prev.filter(session => session.id !== sessionId));
  }, []);

  const addSkillToShop = useCallback((skillName: string) => {
    const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: skillName,
        subSkills: [],
    };
    setAvailableSkillsData(prevData => {
        const mainCategory = prevData[0];
        const updatedCategory = {
            ...mainCategory,
            skills: [...mainCategory.skills, newSkill]
        };
        return [updatedCategory, ...prevData.slice(1)];
    });
  }, []);

  const addCustomSkill = useCallback((categoryId: string, skillName: string) => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: skillName,
      subSkills: [],
    };
    // Add to user skills
    setUserSkillsData(prevData =>
      prevData.map(category => {
        if (category.id === categoryId) {
          return { ...category, skills: [...category.skills, newSkill] };
        }
        return category;
      })
    );
    // Add to available skills (shop)
    setAvailableSkillsData(prevData => {
        const mainCategory = prevData[0];
        const skillExists = mainCategory.skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase());
        if (skillExists) return prevData; // Avoid duplicates in shop

        const updatedCategory = {
            ...mainCategory,
            // FIX: Corrected typo from `main` to `mainCategory`.
            skills: [...mainCategory.skills, JSON.parse(JSON.stringify(newSkill))]
        };
        return [updatedCategory, ...prevData.slice(1)];
    });
  }, []);

  const addSkillFromShop = useCallback((skillToAdd: Skill) => {
    setUserSkillsData(prevData => {
        const mainCategory = prevData[0];
        const skillExists = mainCategory.skills.some(skill => skill.id === skillToAdd.id);

        if (skillExists) {
            return prevData; // Do nothing if skill is already added
        }

        // Deep copy to prevent reference issues
        const skillCopy = JSON.parse(JSON.stringify(skillToAdd));

        const newCategory = {
            ...mainCategory,
            skills: [...mainCategory.skills, skillCopy]
        };
        return [newCategory, ...prevData.slice(1)];
    });
  }, []);


  const addSubSkill = useCallback((categoryId: string, skillId: string, subSkillName: string) => {
    const newSubSkill: SubSkill = {
      id: `sub-${Date.now()}`,
      name: subSkillName,
      progress: 0,
      description: '',
      progression: '',
      youtubeLinks: [],
    };
    // Add to user skills
    setUserSkillsData(prevData =>
      prevData.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            skills: category.skills.map(skill => {
              if (skill.id === skillId) {
                return { ...skill, subSkills: [...skill.subSkills, newSubSkill] };
              }
              return skill;
            }),
          };
        }
        return category;
      })
    );
     // Add to available skills (shop)
    setAvailableSkillsData(prevData =>
        prevData.map(category => ({
            ...category,
            skills: category.skills.map(skill => {
                if (skill.id === skillId) {
                    const subSkillExists = skill.subSkills.some(sub => sub.name.toLowerCase() === subSkillName.toLowerCase());
                    if (subSkillExists) return skill; // Avoid duplicates
                    return { ...skill, subSkills: [...skill.subSkills, JSON.parse(JSON.stringify(newSubSkill))] };
                }
                return skill;
            })
        }))
    );
  }, []);

  const deleteSkill = useCallback((categoryId: string, skillId: string) => {
    setUserSkillsData(prevData =>
      prevData.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            skills: category.skills.filter(skill => skill.id !== skillId),
          };
        }
        return category;
      })
    );
  }, []);

  const deleteSubSkill = useCallback((categoryId: string, skillId: string, subSkillId: string) => {
    setUserSkillsData(prevData =>
      prevData.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            skills: category.skills.map(skill => {
              if (skill.id === skillId) {
                return {
                  ...skill,
                  subSkills: skill.subSkills.filter(subSkill => subSkill.id !== subSkillId),
                };
              }
              return skill;
            }),
          };
        }
        return category;
      })
    );
  }, []);

  const deleteSkillFromShop = useCallback((skillId: string) => {
    // Remove from available skills (shop)
    setAvailableSkillsData(prevData =>
      prevData.map(category => ({
        ...category,
        skills: category.skills.filter(skill => skill.id !== skillId),
      }))
    );
    // Also remove from user skills to maintain consistency
    setUserSkillsData(prevData =>
      prevData.map(category => ({
        ...category,
        skills: category.skills.filter(skill => skill.id !== skillId),
      }))
    );
  }, []);

  const contextValue = {
    userSkillsData,
    availableSkillsData,
    trainingData,
    updateSubSkill,
    addTrainingSession,
    updateTrainingSession,
    deleteTrainingSession,
    addCustomSkill,
    addSubSkill,
    deleteSkill,
    deleteSubSkill,
    addSkillFromShop,
    addSkillToShop,
    deleteSkillFromShop,
  };

  return (
    <SkatingDataContext.Provider value={contextValue}>
      {children}
    </SkatingDataContext.Provider>
  );
};

export const useSkatingData = () => {
  const context = useContext(SkatingDataContext);
  if (context === undefined) {
    throw new Error('useSkatingData must be used within a SkatingDataProvider');
  }
  return context;
};