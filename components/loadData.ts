import axios from 'axios';
interface Entry {
  cantine: string;
  meal: string;
  received: boolean;
  takeaway: boolean;
  halbePortion: boolean;
  time: string;
}



export async function loadData(apiUrl: string, date: Date, token: string, setData: (data: Entry[]) => void) {
  const today = new Date().toISOString().substr(0, 10);
  const dateStr = date ? date.toISOString().substr(0, 10) : today;
  
  const result = await axios.get(
    `${apiUrl}?date=${dateStr}`,
    { headers: { Authorization: `Bearer ${token}`, 'Access-Control-Allow-Origin': 'true' } }
  );

  const tmpData: Entry[] = result.data.map((element: any) => ({
    cantine: element.cantine,
    meal: element.meal,
    received: element.received,
    takeaway: element.takeaway,
    halbePortion: element.halbePortion,
    time: element.time
  }));

  setData(tmpData);
}

