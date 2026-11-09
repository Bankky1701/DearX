import { fetchLiveSexyTables, getLiveTableById } from '../src/services/sexyLiveEngine';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { id } = req.query || {};

    if (id) {
      const table = await getLiveTableById(id as string);
      if (!table) {
        return res.status(404).json({
          status: 'error',
          message: 'Table not found',
        });
      }
      return res.status(200).json({
        status: 'ok',
        provider: 'Sexy Baccarat (AE Sexy Gaming)',
        timestamp: Date.now(),
        table,
      });
    }

    const tables = await fetchLiveSexyTables();
    return res.status(200).json({
      status: 'ok',
      provider: 'Sexy Baccarat (AE Sexy Gaming)',
      source: 'bpcdf.vctrf.com / AE Sexy Live',
      cdn: 'jhmbs3.godbac987.com',
      isLiveStream: true,
      timestamp: Date.now(),
      totalTables: tables.length,
      tables,
    });
  } catch (err: any) {
    console.error('Error in /api/tables handler:', err);
    return res.status(500).json({
      status: 'error',
      message: err?.message || 'Internal server error',
    });
  }
}
