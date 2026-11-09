import { fetchLiveSexyTables } from '../src/services/sexyLiveEngine';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const tables = await fetchLiveSexyTables();
    return res.status(200).json({
      status: 'ok',
      message: 'ดึงข้อมูลสดจาก AE Sexy สำเร็จ',
      totalRooms: tables.length,
      activeRooms: tables.filter((t) => t.sequence.length > 0).length,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: err?.message || 'Sync error',
    });
  }
}
