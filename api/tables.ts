import { getClientFallbackSourceStatus, getClientFallbackTables, getClientFallbackTableById } from '../src/services/clientLiveEngine';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};

  if (id) {
    const tableId = parseInt(id as string, 10);
    const table = getClientFallbackTableById(tableId);
    return res.status(200).json({
      status: 'ok',
      table,
    });
  }

  const tables = getClientFallbackTables();
  return res.status(200).json({
    status: 'ok',
    total: tables.length,
    tables,
  });
}
