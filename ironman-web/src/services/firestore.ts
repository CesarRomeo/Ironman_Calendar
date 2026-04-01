import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { TrainingPlan } from "../types.ts";

const DEFAULT_USER_ID = "alex_pro_2026";

export const saveUserPlan = async (plan: TrainingPlan, userId: string = DEFAULT_USER_ID) => {
  try {
    await setDoc(doc(db, "users", userId), {
      plan: plan,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("Plan guardado en Firestore");
  } catch (e) {
    console.error("Error guardando plan: ", e);
    throw e;
  }
};

export const getUserPlan = async (userId: string = DEFAULT_USER_ID): Promise<TrainingPlan | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().plan as TrainingPlan;
    }
  } catch (e) {
    console.error("Error obteniendo plan: ", e);
  }
  return null;
};

export const saveStravaActivities = async (activities: any[], userId: string = DEFAULT_USER_ID) => {
  try {
    await setDoc(doc(db, "activities", userId), {
      items: activities,
      updatedAt: new Date().toISOString()
    });
    console.log("Actividades de Strava guardadas en Firestore");
  } catch (e) {
    console.error("Error guardando actividades: ", e);
    throw e;
  }
};

export const getStravaActivities = async (userId: string = DEFAULT_USER_ID): Promise<any[] | null> => {
  try {
    const docRef = doc(db, "activities", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().items;
    }
  } catch (e) {
    console.error("Error obteniendo actividades: ", e);
  }
  return null;
};
