import { groupByTimeAndMeal } from './groupByTimeAndMeal';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

interface Entry {
  cantine: string;
  meal: string;
  received: boolean;
  takeaway: boolean;
  halbePortion: boolean;
  time: string;
}

export async function exportPDF(data: Entry[], selectedDate: Date | null) {
  const groups = groupByTimeAndMeal(data);
  const entries = Object.entries(groups);

  const formattedDate = selectedDate ? formatDate(selectedDate) : ''; // Formatieren Sie das ausgewählte Datum

  const docDefinition = {
    content: [
      { text: `Bestellungen für den ${formattedDate}`, style: 'header' }, // Verwenden Sie das formatierte Datum
      { text: '\n' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            ['Uhrzeit', 'Mahlzeit', 'Kantine', 'Portionen', 'Halbe Portion', 'Takeaway'],
            ...entries.flatMap(([key, cantines]) => {
              const [time, meal] = key.split('_');
              return Object.entries(cantines).sort(([a], [b]) => a.localeCompare(b)).flatMap(([cantine, count]) => {
                const halbePortionCount = data.filter(entry => entry.time === time && entry.meal === meal && entry.cantine === cantine && entry.halbePortion).length;
                const takeawayCount = data.filter(entry => entry.time === time && entry.meal === meal && entry.cantine === cantine && entry.takeaway).length;
                return [[time, meal, cantine, count, halbePortionCount, takeawayCount]];
              });
            })
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      }
    }
  };

  const fileName = `Reservierungen für den ${formattedDate}.pdf`; // Erstellen Sie den Dateinamen

  pdfMake.createPdf(docDefinition).download(fileName);
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0'); // Führende Null hinzufügen
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Führende Null hinzufügen
  const year = date.getFullYear().toString();
  return `${day}.${month}.${year}`;
}

