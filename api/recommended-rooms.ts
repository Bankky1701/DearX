import { getLiveRecommendedRooms } from '../src/services/sexyLiveEngine';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rooms = await getLiveRecommendedRooms();
    return res.status(200).json({
      status: 'ok',
      provider: 'Sexy Baccarat (AE Sexy Gaming)',
      source: 'bpcdf.vctrf.com / AE Sexy Live',
      timestamp: Date.now(),
      count: rooms.length,
      rooms,
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: err?.message || 'Internal server error',
    });
  }
}
