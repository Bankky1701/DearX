import { getClientFallbackTables } from '../src/services/clientLiveEngine';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const rooms = getClientFallbackTables().filter((t) => t.isHotRoom);
  return res.status(200).json({
    status: 'ok',
    total: rooms.length,
    rooms,
  });
}
