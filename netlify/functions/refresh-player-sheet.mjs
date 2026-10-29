import { refreshPlayerSheet } from '../lib/player-sheet.mjs';

export default async () => {
  const { fetchedAt } = await refreshPlayerSheet();
  console.log(`YSCS player sheet cache refreshed at ${fetchedAt}`);
};
