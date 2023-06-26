interface Entry {
                  cantine: string;
                  meal: string;
                  received: boolean;
                  takeaway: boolean;
                  halbePortion: boolean;
                  time: string;
                }
                export function groupByTimeAndMeal(entries: Entry[]) {
                  const groups: Record<string, Record<string, number>> = {}; 
                  entries.forEach((entry) => { 
                  const time = entry.time; 
                  const meal = entry.meal; 
                  const key = `${time}_${meal}`; 
                  if (!groups[key]) groups[key] = {}; 
                  if (!groups[key][entry.cantine]) groups[key][entry.cantine] = 0; 
                  groups[key][entry.cantine] += 1; 
                  });
                                  
                  const sortedGroups: Record<string, Record<string, number>> = {}; 
                  Object.keys(groups)
                  .sort((a, b) => {
                  const timeA = parseInt(a.split('_')[0].replace(':', ''));
                  const timeB = parseInt(b.split('_')[0].replace(':', ''));
                  return timeA - timeB;
                  })
                  .forEach((key) => {
                  sortedGroups[key] = groups[key];
                  });
                                    
                  return sortedGroups; 
                  }