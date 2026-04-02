export const normalizeActivityType = (type: string): 'swim' | 'bike' | 'run' | 'other' => {
  const t = type.toLowerCase().trim();
  
  if (t.includes('swim') || t.includes('nataci') || t.includes('nadar')) return 'swim';
  if (t.includes('bike') || t.includes('bici') || t.includes('ciclismo') || t.includes('ride')) return 'bike';
  if (t.includes('run') || t.includes('carrera') || t.includes('correr')) return 'run';
  
  return 'other';
};
