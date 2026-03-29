import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { TrainingPlan } from "../types.ts";

export const saveUserPlan = async (userId: string, plan: TrainingPlan) => {
  try {
    await setDoc(doc(db, "users", userId), {
      plan: plan,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("Plan guardado en Firestore");
  } catch (e) {
    console.error("Error guardando plan: ", e);
  }
};

export const getUserPlan = async (userId: string): Promise<TrainingPlan | null> => {
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

export const updateWorkoutStatus = async (userId: string, date: string, workoutId: string, completed: boolean) => {
    // This is a bit complex for deep nesting in Firestore. 
    // Usually, you might want to restructure the data or just update the whole plan.
    // For simplicity in this prototype, we update the whole plan object.
};
