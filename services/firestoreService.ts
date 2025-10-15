import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Sport, TrainingSession } from '../types';

const USERS_COLLECTION = 'users';

export const saveUserData = async (userId: string, sports: Sport[], trainings: TrainingSession[]): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userDocRef, { sports, trainings }, { merge: true });
  } catch (error) {
    console.error("Error saving user data:", error);
    throw new Error('Failed to save user data.');
  }
};

export const loadUserSkills = async (userId: string): Promise<Sport[] | null> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists() && docSnap.data().sports) {
      return docSnap.data().sports as Sport[];
    }
    return null;
  } catch (error) {
    console.error("Error loading user skills:", error);
    throw new Error('Failed to load skills data.');
  }
};

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