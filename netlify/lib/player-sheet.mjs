import { getStore } from '@netlify/blobs';

export const PLAYER_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1syPFQtNAiAhrj5BZBt0Z0mCWGiaVAxhYCTTEvh2gVBo/export?format=csv&gid=56643669';
const STORE_NAME = 'yscs-player-data';
const CACHE_KEY = 'players.csv';

export async function refreshPlayerSheet() {
  const response = await fetch(PLAYER_SHEET_URL, { headers: { accept: 'text/csv' } });
  if (!response.ok) throw new Error(`Google Sheet request failed: ${response.status}`);

  const csv = await response.text();
  if (!csv.includes('총 경기수') || !csv.includes('승\\패')) throw new Error('Unexpected player sheet format');

  const fetchedAt = new Date().toISOString();
  const store = getStore({ name: STORE_NAME, consistency: 'strong' });
  await store.set(CACHE_KEY, csv, { metadata: { fetchedAt, source: PLAYER_SHEET_URL } });
  return { csv, fetchedAt };
}

export async function getCachedPlayerSheet() {
  const store = getStore({ name: STORE_NAME, consistency: 'strong' });
  const cached = await store.getWithMetadata(CACHE_KEY, { type: 'text' });
  if (cached?.data) return { csv: cached.data, fetchedAt: cached.metadata?.fetchedAt || null };
  return refreshPlayerSheet();
}
