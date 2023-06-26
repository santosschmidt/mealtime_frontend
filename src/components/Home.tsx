/**
/**
 * Dies ist ein Beispiel-Code, der Daten von einer API lädt, sie in Tabellen formatiert und als Excel-Datei exportiert.
 * Die Daten werden gruppiert und gefiltert und können vom Benutzer ausgewählt werden.
 * Der Code verwendet React, TypeScript, ExcelJS und axios.
 * Autor: Alessandro Santos Schmidt (Praktikant)
 */

import { useState, useEffect } from 'react'; 
import './Home.css'; 
import React from 'react'; 
import { seeData } from './api'; // Importieren der Ausgelagerten seedata Funktion zur Übung des Refactorings
import { groupByMeal } from './groupByMeal';
import { countTakeaway } from './countTakeaway';
import { loadData } from './loadData';
import { exportExcel } from './exportExcel';
import { exportPDF } from './exportPDF';


interface HomeProps {
  token: string; 
}

interface Entry {
  cantine: string;
  meal: string;
  received: boolean;
  takeaway: boolean;
  halbePortion: boolean;
  time: string;
}

                


// Definiere eine React-Komponente "Home", die das UI rendert und Daten von der API lädt
function Home({ token }: HomeProps) {
  // Definiere verschiedene Zustandsvariablen, die von der Komponente verwendet werden
  const [data, setData] = useState<Entry[]>([]); // Speichert die Daten, die von der API geladen werden
  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null); // Speichert die ausgewählte Kantine
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Setze das heutige Datum als Standardwert
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // Speichert die ausgewählte Uhrzeit
  const [apiUrl] = useState('https://mealtime-api-dev.euc1.services.kaercher.com/Meals/GetMealsDay'); 
  const [selectedTakeaway, setSelectedTakeaway] = useState<boolean | null>(null); // Speichert den ausgewählten Takeaway-Filter


// Verwende den Hook "useEffect" um die Funktion "seeData" beim Laden der Komponente auszuführen
useEffect(() => {
  seeData(token) // Rufe die Funktion "seeData" auf
}, []); // Gib ein leeres Array als zweites Argument an, um sicherzustellen, dass der Hook nur einmal ausgeführt wird. Hier wird keine Abhängigkeit angegeben, da die Funktion nur einmalig aufgerufen werden soll.


const filteredData = data.filter((entry) => {
  if (selectedCanteen && entry.cantine !== selectedCanteen) return false;
  if (selectedTime && entry.time !== selectedTime) return false;
  if (selectedTakeaway !== null && entry.takeaway !== selectedTakeaway) return false; // Hinzufügen der Bedingung für den ausgewählten Takeaway-Filter
  return true;
}).reduce((groups: Record<string, Entry[]>, entry) => {
  // Reduziere die gefilterten Daten auf eine Gruppierung nach Zeit
  const time = entry.time;
  if (!groups[time]) groups[time] = [];
  groups[time].push(entry); // Füge den Eintrag zur entsprechenden Zeit-Gruppe hinzu
  return groups;
}, {});


// Definiere die Home-Komponente
return (
  <div className="Home">
    
    <h1>Mahlzeit</h1>
    <div className="row">
      <div className="col-sm-4">
        <div className="dropdown-container">
          <label htmlFor="canteen-select">Kantine:</label>
          <select
  id="canteen-select"
  className="form-select dropdown"
  value={selectedCanteen || ''}
  onChange={(e) => {
    const canteen = e.target.value || null;
    setSelectedCanteen(canteen);
  }}
>
  <option value="">Alle Kantinen</option>
  <option value="Cantine Winnenden">Kantine Winnenden</option>
  <option value="Cantine Schwaikheim">Kantine Schwaikheim</option>
</select>

        </div>
      </div>
      <div className="col-sm-4">
        <div className="dropdown-container">
          <label htmlFor="date-select">Datum:</label>
          <input
            id="date-select"
            className="form-control dropdown"
            type="date"
            value={selectedDate ? selectedDate.toISOString().substr(0, 10) : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              setSelectedDate(date);
              if (date) {
                loadData(apiUrl, date, token, setData);
              }
            }}
            min="2023-01-01"
          />
        </div>
      </div>
      <div className="col-sm-4">
        <div className="dropdown-container">
          <label htmlFor="time-select">Uhrzeit:</label>
          <select
            id="time-select"
            className="form-select dropdown"
            onChange={(e) => {
              const time = e.target.value;
              setSelectedTime(time);
            }}
          >
            <option value="">Alle Uhrzeiten</option>
            <option value="11:30">11:30</option>
            <option value="12:00">12:00</option>
            <option value="12:30">12:30</option>
            <option value="13:00">13:00</option>
            <option value="13:30">13:30</option>
          </select>
        </div>
      </div>
    </div>

    <div className="table-responsive">
  {Object.entries(filteredData).sort(([a], [b]) => a.localeCompare(b)).map(([time, entries]) => (
    <>
      <h2>{time}</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Gericht</th>
            <th>Anzahl</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupByMeal(entries)).sort(([a], [b]) => a.localeCompare(b)).map(([meal, mealEntries]) => (
            <React.Fragment key={meal}>
              <tr>
                <td>{meal}</td>
                <td>{mealEntries.length}</td>
              </tr>
              <tr>
                <td>{meal + ' Halb'}</td>
                <td>{mealEntries.filter(entry => entry.halbePortion).length}</td>
              </tr>
              <tr>
                <td>{meal + ' Takeaway'}</td>
                <td>{countTakeaway(mealEntries, meal)}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  ))}
</div>


<button className="btn btn-primary" onClick={() => exportExcel(data, selectedDate)}>Daten exportieren Excel</button>
<button className="btn btn-primary" onClick={() => exportPDF(data, selectedDate)}>Daten exportieren PDF</button>


  </div>
);

}
export default Home;
