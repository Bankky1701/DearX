import { getClientFallbackSourceStatus } from '../src/services/clientLiveEngine';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const status = getClientFallbackSourceStatus();
  return res.status(200).json(status);
}
