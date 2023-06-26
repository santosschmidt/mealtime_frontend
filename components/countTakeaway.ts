interface Entry {
                  cantine: string;
                  meal: string;
                  received: boolean;
                  takeaway: boolean;
                  halbePortion: boolean;
                  time: string;
                }

                export function countTakeaway(entries: Entry[], meal: string): number {
                  return entries.filter(entry => entry.meal === meal && entry.takeaway).length;
                }