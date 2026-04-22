// Millisecond constants
export const MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

/**
 * Formatterar en varaktighet i minuter till läsbar format
 * @param mins - Antal minuter
 * @returns Formaterad sträng (ex: "1 tim 30 min")
 */
export const formatDuration = (mins: number): string => {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} tim` : `${h} tim ${m} min`;
};

/**
 * Beräknar återstående tid till ett målTidpunkt
 * @param targetTime - MålTidpunkt i millisekunder
 * @param currentTime - Nuvarande tid i millisekunder
 * @returns Objekt med timmar, minuter och sekunder
 */
export const getTimeRemaining = (targetTime: number, currentTime: number) => {
  const diff = targetTime - currentTime;
  if (diff <= 0) return { h: 0, m: 0, s: 0 };
  
  return {
    h: Math.floor(diff / MS.HOUR),
    m: Math.floor((diff / MS.MINUTE) % 60),
    s: Math.floor((diff / MS.SECOND) % 60),
  };
};

/**
 * Padding för tal (ex: 5 -> "05")
 */
export const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Hämtar svenska namn för timmar och minuter
 * @param date - Datumets tid
 * @returns Svensk tidsbeskrivning (ex: "kvart över tre")
 */
export const getSwedishTimeWords = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const hourNames = [
    'tolv', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju',
    'åtta', 'nio', 'tio', 'elva', 'tolv',
  ];

  let h = hours % 12;
  let nextH = (h + 1) % 12;
  if (h === 0) h = 12;
  if (nextH === 0) nextH = 12;

  // Standard tidsintervaller
  const timePhrasesMap: Record<number, string> = {
    0: hourNames[h],
    5: `fem över ${hourNames[h]}`,
    10: `tio över ${hourNames[h]}`,
    15: `kvart över ${hourNames[h]}`,
    20: `tjugo över ${hourNames[h]}`,
    25: `fem i halv ${hourNames[nextH]}`,
    30: `halv ${hourNames[nextH]}`,
    35: `fem över halv ${hourNames[nextH]}`,
    40: `tjugo i ${hourNames[nextH]}`,
    45: `kvart i ${hourNames[nextH]}`,
    50: `tio i ${hourNames[nextH]}`,
    55: `fem i ${hourNames[nextH]}`,
  };

  if (timePhrasesMap[minutes]) return timePhrasesMap[minutes];

  // Dynamisk beräkning för övriga minuter
  const numWords = [
    '', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio',
    'tio', 'elva', 'tolv', 'tretton', 'fjorton', 'femton', 'sexton',
    'sjutton', 'arton', 'nitton', 'tjugo', 'tjugoett', 'tjugotvå',
    'tjugottre', 'tjugofyra', 'tjugofem', 'tjugosex', 'tjugosju',
    'tjugoåtta', 'tjugonio', 'trettio',
  ];

  const getMinStr = (num: number) => `${numWords[num]} ${num === 1 ? 'minut' : 'minuter'}`;

  if (minutes > 0 && minutes < 25) {
    return minutes > 20
      ? `${getMinStr(30 - minutes)} i halv ${hourNames[nextH]}`
      : `${getMinStr(minutes)} över ${hourNames[h]}`;
  }
  if (minutes > 25 && minutes < 30) return `${getMinStr(30 - minutes)} i halv ${hourNames[nextH]}`;
  if (minutes > 30 && minutes < 35) return `${getMinStr(minutes - 30)} över halv ${hourNames[nextH]}`;
  if (minutes > 35 && minutes < 45) {
    return minutes < 40
      ? `${getMinStr(minutes - 30)} över halv ${hourNames[nextH]}`
      : `${getMinStr(60 - minutes)} i ${hourNames[nextH]}`;
  }
  if (minutes > 45) return `${getMinStr(60 - minutes)} i ${hourNames[nextH]}`;

  return '';
};
