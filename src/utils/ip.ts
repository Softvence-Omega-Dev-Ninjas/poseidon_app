import { IncomingMessage } from 'http';
import geoip from 'geoip-lite';

export function normalizeIp(ip?: string | null): string | null {
  if (!ip) return null;

  ip = ip.trim().replace(/^for=/i, '').replace(/"/g, '');

  // Handle IPv6 addresses (remove brackets)
  if (ip.startsWith('[') && ip.endsWith(']')) ip = ip.slice(1, -1);

  // Handle IPv4-mapped IPv6 addresses like ::ffff:192.0.2.128 -> 192.0.2.128
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) return mapped[1];

  // Remove the port if present (e.g., 1.2.3.4:1234 -> 1.2.3.4)
  const portIndex = ip.lastIndexOf(':');
  if (portIndex !== -1 && ip.indexOf(':') === portIndex) {
    ip = ip.split(':')[0]; // IPv4
  } else if (ip.includes(']:')) {
    ip = ip.split(']')[0].replace('[', ''); // IPv6
  }

  return ip || null;
}

export function getClientIp(req: IncomingMessage & any): string | null {
  const candidates: (string | null)[] = [];

  if (req.ip) candidates.push(normalizeIp(req.ip));
  if (Array.isArray(req.ips)) candidates.push(...req.ips.map(normalizeIp));

  // 2. Check the most common proxy headers
  const proxyHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'true-client-ip',
    'x-client-ip',
    'fastly-client-ip',
    'x-cluster-client-ip',
  ];

  for (const header of proxyHeaders) {
    const headerValue = req.headers[header];
    if (headerValue) {
      if (header === 'x-forwarded-for') {
        candidates.push(...(headerValue as string).split(',').map(normalizeIp));
      } else {
        candidates.push(normalizeIp(headerValue as string));
      }
    }
  }

  // direct socket connection (remoteAddress)
  const connIp = req.connection?.remoteAddress || req.socket?.remoteAddress;
  if (connIp) candidates.push(normalizeIp(connIp));

  // Remove duplicates and filter out any nulls
  const uniqueIps = Array.from(new Set(candidates.filter(Boolean)));

  // Return the most likely client IP or null if none found
  return uniqueIps.length > 0 ? uniqueIps[0] : null;
}
