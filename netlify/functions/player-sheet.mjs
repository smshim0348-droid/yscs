import { getCachedPlayerSheet } from '../lib/player-sheet.mjs';

export default async () => {
  try {
    const { csv, fetchedAt } = await getCachedPlayerSheet();
    return new Response(csv, {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
        'x-yscs-data-updated-at': fetchedAt || ''
      }
    });
  } catch (error) {
    console.error('Player sheet cache read failed', error);
    return Response.json({ error: 'Player data is temporarily unavailable.' }, { status: 503 });
  }
};
