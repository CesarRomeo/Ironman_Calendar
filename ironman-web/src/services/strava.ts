export const getStravaAuthUrl = () => {
  const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_STRAVA_REDIRECT_URI;
  
  console.log('Iniciando Auth Strava con Client ID:', clientId);
  
  if (!clientId || clientId === 'undefined') {
    console.error('ERROR: VITE_STRAVA_CLIENT_ID no está definido en el archivo .env');
  }

  return `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=activity:read_all`;
};

export const exchangeToken = async (code: string) => {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
      client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });
  return response.json();
};

export const getAthleteActivities = async (accessToken: string) => {
  const response = await fetch('https://www.strava.com/api/v3/athlete/activities', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};
