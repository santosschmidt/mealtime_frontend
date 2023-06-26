interface Entry {
                  cantine: string;
                  meal: string;
                  received: boolean;
                  takeaway: boolean;
                  halbePortion: boolean;
                  time: string;
                }
                
                export function groupByMeal(entries: Entry[]) {
                  const groups: Record<string, Entry[]> = {};
                  const allMeals = ['Gericht 1', 'Gericht 2', 'Gericht 3'];
                
                  allMeals.forEach((meal) => {
                    groups[meal] = entries.filter((entry) => entry.meal === meal);
                  });
                
                  return groups;
                }