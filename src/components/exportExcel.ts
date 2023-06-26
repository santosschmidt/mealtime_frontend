import { groupByTimeAndMeal } from './groupByTimeAndMeal';
import * as ExcelJS from 'exceljs';

interface Entry {
  cantine: string;
  meal: string;
  received: boolean;
  takeaway: boolean;
  halbePortion: boolean;
  time: string;
}

export async function exportExcel(data: Entry[], selectedDate: Date | null) {
  const groups = groupByTimeAndMeal(data);
  const entries = Object.entries(groups);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Bestellungen');
  sheet.columns = [
    { header: 'Datum', key: 'date', width: 20 },
    { header: 'Uhrzeit', key: 'time', width: 20 },
    { header: 'Mahlzeit', key: 'meal', width: 20 },
    { header: 'Kantine', key: 'cantine', width: 20 },
    { header: 'Portionen', key: 'count', width: 10 },
    { header: 'Halbe Portion', key: 'halbePortion', width: 10 },
    { header: 'Takeaway', key: 'takeaway', width: 10 }
  ];

  entries.forEach(([key, cantines]) => {
    const [time, meal] = key.split('_');
    const entries = Object.entries(cantines).sort(([a], [b]) => a.localeCompare(b));
    entries.forEach(([cantine, count]) => {
      const halbePortionCount = data.filter(entry => entry.time === time && entry.meal === meal && entry.cantine === cantine && entry.halbePortion).length;
      const takeawayCount = data.filter(entry => entry.time === time && entry.meal === meal && entry.cantine === cantine && entry.takeaway).length;
      
      const formattedDate = selectedDate ? formatDate(selectedDate) : ''; // Formatieren Sie das ausgewählte Datum
      
      sheet.addRow({
        date: formattedDate,
        time,
        meal,
        cantine,
        count,
        halbePortion: halbePortionCount,
        takeaway: takeawayCount
      });
    });
  });

  const formattedDate = selectedDate ? formatDate(selectedDate) : ''; // Formatieren Sie das ausgewählte Datum für den Dateinamen
  const fileName = `Reservierungen_${formattedDate}.xlsx`; // Erstellen Sie den Dateinamen
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName); // Verwenden Sie den generierten Dateinamen
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0'); // Führende Null hinzufügen
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Führende Null hinzufügen
  const year = date.getFullYear().toString();
  return `${day}.${month}.${year}`;
}









