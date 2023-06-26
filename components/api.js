// api.js ausgelagerter funktion zur übung

import axios from 'axios';

export async function seeData(token) {
  try {
    const result = await axios.get('https://mealtime-api-dev.euc1.services.kaercher.com/Authorization/IsAuthorizedCanteen', { headers: { Authorization: `Bearer ${token}` } });
    const auth = result.data;
    if (auth) {
      const data = result.data; // extrahiere die Daten aus der API-Antwort
      console.log(data); // Wenn der Benutzer authentifiziert ist, gib die Daten im Browser-Log aus
      return data;
    } else {
      console.log('Not Authorized'); // Andernfalls gib eine entsprechende Meldung aus
      return null;
    }
  } catch (error) {
    console.error(error); // Gib einen Fehler aus, wenn die API-Aufruf fehlschlägt
    ;
  }
}

