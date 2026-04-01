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

export const refreshToken = async (refreshToken: string) => {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
      client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await response.json();
  
  if (data.access_token) {
    localStorage.setItem('strava_token', data.access_token);
    localStorage.setItem('strava_refresh_token', data.refresh_token);
    localStorage.setItem('strava_expires_at', data.expires_at.toString());
  }
  
  return data;
};

export const getValidToken = async () => {
  const accessToken = localStorage.getItem('strava_token');
  const refresh_token = localStorage.getItem('strava_refresh_token');
  const expiresAt = localStorage.getItem('strava_expires_at');

  if (!accessToken || !refresh_token) return null;

  // Si expira en menos de 5 minutos (300 segundos), refrescar
  const now = Math.floor(Date.now() / 1000);
  if (expiresAt && (parseInt(expiresAt) - now < 300)) {
    console.log('Token de Strava expirado o próximo a expirar. Refrescando...');
    const data = await refreshToken(refresh_token);
    return data.access_token;
  }

  return accessToken;
};

export const getAthleteActivities = async () => {
  const token = await getValidToken();
  if (!token) throw new Error('No Strava token found');

  const response = await fetch('https://www.strava.com/api/v3/athlete/activities', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // Si falla por 401 a pesar del chequeo previo, intentamos un refresco forzado una vez
    const refresh_token = localStorage.getItem('strava_refresh_token');
    if (refresh_token) {
      const data = await refreshToken(refresh_token);
      const retryResponse = await fetch('https://www.strava.com/api/v3/athlete/activities', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      return retryResponse.json();
    }
  }

  return response.json();
};
