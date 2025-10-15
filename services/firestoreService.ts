import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { SkillCategory, TrainingSession } from '../types';

const USERS_COLLECTION = 'users';

// Function to save user skills data
export const saveUserSkills = async (userId: string, data: SkillCategory[]): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userDocRef, { skills: data }, { merge: true });
  } catch (error) {
    console.error("Error saving user skills:", error);
    throw new Error('Failed to save skills data.');
  }
};

// Function to load user skills data
export const loadUserSkills = async (userId: string): Promise<SkillCategory[] | null> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists() && docSnap.data().skills) {
      return docSnap.data().skills as SkillCategory[];
    }
    return null;
  } catch (error) {
    console.error("Error loading user skills:", error);
    throw new Error('Failed to load skills data.');
  }
};

// Function to save user training data
export const saveTrainingData = async (userId: string, data: TrainingSession[]): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userDocRef, { trainings: data }, { merge: true });
  } catch (error) {
    console.error("Error saving user training data:", error);
    throw new Error('Failed to save training data.');
  }
};

// Function to load user training data
export const loadTrainingData = async (userId: string): Promise<TrainingSession[] | null> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists() && docSnap.data().trainings) {
      return docSnap.data().trainings as TrainingSession[];
    }
    return null;
  } catch (error) {
    console.error("Error loading user training data:", error);
    throw new Error('Failed to load training data.');
  }
};