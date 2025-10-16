import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Sport, SubSkill, TrainingSession, Skill } from '../types';
import { initialSportsData, initialTrainingData } from '../data/sportsData';
import { useAuth } from './AuthContext';
import { loadUserSkills, loadTrainingData, saveUserData } from '../services/firestoreService';

interface AppContextType {
  userSportsData: Sport[];
  availableSportsData: Sport[];
  trainingData: TrainingSession[];
  updateSubSkill: (sportId: string, skillId: string, subSkillId: string, updates: Partial<SubSkill>) => void;
  addTrainingSession: (session: TrainingSession) => void;
  updateTrainingSession: (sessionId: string, updates: Partial<TrainingSession>) => void;
  deleteTrainingSession: (sessionId: string) => void;
  addCustomSkill: (sportId: string, skillName: string) => void;
  addSubSkill: (sportId: string, skillId: string, subSkillName: string) => void;
  deleteSkill: (sportId: string, skillId: string) => void;
  deleteSubSkill: (sportId: string, skillId: string, subSkillId: string) => void;
  addSkillFromShop: (sportId: string, skillToAdd: Skill) => void;
  addSkillToShop: (sportId: string, skillName: string) => void;
  deleteSkillFromShop: (sportId: string, skillId: string) => void;
  addSport: (sportName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUserSports: Sport[] = initialSportsData.map(sport => ({
  ...sport,
  skills: [],
}));

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userSportsData, setUserSportsData] = useState<Sport[]>(initialUserSports);
  const [availableSportsData, setAvailableSportsData] = useState<Sport[]>(initialSportsData);
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
          setUserSportsData(skills);
        } else {
          setUserSportsData(initialUserSports);
        }

        if (trainings) {
          setTrainingData(trainings);
        } else {
          setTrainingData(initialTrainingData);
        }
        setIsDataLoaded(true);
      } else {
        setUserSportsData(initialUserSports);
        setTrainingData(initialTrainingData);
        setAvailableSportsData(initialSportsData);
        setIsDataLoaded(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (user && isDataLoaded) {
      saveUserData(user.uid, userSportsData, trainingData);
    }
  }, [user, userSportsData, trainingData, isDataLoaded]);

  const updateSubSkill = useCallback((sportId: string, skillId: string, subSkillId: string, updates: Partial<SubSkill>) => {
    setUserSportsData(prevData =>
      prevData.map(sport => {
        if (sport.id === sportId) {
          return {
            ...sport,
            skills: sport.skills.map(skill => {
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
        return sport;
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

  const addSkillToShop = useCallback((sportId: string, skillName: string) => {
    const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: skillName,
        subSkills: [],
    };
    setAvailableSportsData(prevData => prevData.map(sport => {
      if (sport.id === sportId) {
        return {
          ...sport,
          skills: [...sport.skills, newSkill]
        };
      }
      return sport;
    }));
  }, []);

  const addCustomSkill = useCallback((sportId: string, skillName: string) => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: skillName,
      subSkills: [],
    };
    // Add to user skills
    setUserSportsData(prevData =>
      prevData.map(sport => {
        if (sport.id === sportId) {
          return { ...sport, skills: [...sport.skills, newSkill] };
        }
        return sport;
      })
    );
    // Add to available skills (shop)
    setAvailableSportsData(prevData => prevData.map(sport => {
      if (sport.id === sportId) {
        const skillExists = sport.skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase());
        if (skillExists) return sport; // Avoid duplicates in shop

        return {
            ...sport,
            skills: [...sport.skills, JSON.parse(JSON.stringify(newSkill))]
        };
      }
      return sport;
    }));
  }, []);

  const addSkillFromShop = useCallback((sportId: string, skillToAdd: Skill) => {
    setUserSportsData(prevData => prevData.map(sport => {
        if (sport.id === sportId) {
          const skillExists = sport.skills.some(skill => skill.id === skillToAdd.id);
          if (skillExists) {
              return sport; // Do nothing if skill is already added
          }
          const skillCopy = JSON.parse(JSON.stringify(skillToAdd));
          return {
            ...sport,
            skills: [...sport.skills, skillCopy]
          };
        }
        return sport;
    }));
  }, []);


  const addSubSkill = useCallback((sportId: string, skillId: string, subSkillName: string) => {
    const newSubSkill: SubSkill = {
      id: `sub-${Date.now()}`,
      name: subSkillName,
      progress: 0,
      description: '',
      progression: '',
      youtubeLinks: [],
    };
    // Add to user skills
    setUserSportsData(prevData =>
      prevData.map(sport => {
        if (sport.id === sportId) {
          return {
            ...sport,
            skills: sport.skills.map(skill => {
              if (skill.id === skillId) {
                return { ...skill, subSkills: [...skill.subSkills, newSubSkill] };
              }
              return skill;
            }),
          };
        }
        return sport;
      })
    );
     // Add to available skills (shop)
    setAvailableSportsData(prevData =>
        prevData.map(sport => {
          if (sport.id === sportId) {
            return {
              ...sport,
              skills: sport.skills.map(skill => {
                  if (skill.id === skillId) {
                      const subSkillExists = skill.subSkills.some(sub => sub.name.toLowerCase() === subSkillName.toLowerCase());
                      if (subSkillExists) return skill; // Avoid duplicates
                      return { ...skill, subSkills: [...skill.subSkills, JSON.parse(JSON.stringify(newSubSkill))] };
                  }
                  return skill;
              })
            }
          }
          return sport;
        })
    );
  }, []);

  const deleteSkill = useCallback((sportId: string, skillId: string) => {
    setUserSportsData(prevData =>
      prevData.map(sport => {
        if (sport.id === sportId) {
          return {
            ...sport,
            skills: sport.skills.filter(skill => skill.id !== skillId),
          };
        }
        return sport;
      })
    );
  }, []);

  const deleteSubSkill = useCallback((sportId: string, skillId: string, subSkillId: string) => {
    setUserSportsData(prevData =>
      prevData.map(sport => {
        if (sport.id === sportId) {
          return {
            ...sport,
            skills: sport.skills.map(skill => {
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
        return sport;
      })
    );
  }, []);

  const deleteSkillFromShop = useCallback((sportId: string, skillId: string) => {
    // Remove from available skills (shop)
    setAvailableSportsData(prevData =>
      prevData.map(sport => {
        if (sport.id === sportId) {
          return {
            ...sport,
            skills: sport.skills.filter(skill => skill.id !== skillId),
          }
        }
        return sport;
      })
    );
    // Also remove from user skills to maintain consistency
    setUserSportsData(prevData =>
      prevData.map(sport => {
        if (sport.id === sportId) {
          return {
            ...sport,
            skills: sport.skills.filter(skill => skill.id !== skillId),
          }
        }
        return sport;
      })
    );
  }, []);

  const addSport = useCallback((sportName: string) => {
    const newSport: Sport = {
      id: `sport-${Date.now()}`,
      name: sportName,
      skills: [],
    };

    // Add to user's sports data
    setUserSportsData(prevData => [...prevData, { ...newSport }]);

    // Add to available sports data so it appears in the shop
    setAvailableSportsData(prevData => [...prevData, { ...newSport }]);
  }, []);

  const contextValue = {
    userSportsData,
    availableSportsData,
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
    addSport,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within a AppProvider');
  }
  return context;
};