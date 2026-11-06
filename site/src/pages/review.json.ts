import type { APIRoute } from 'astro';
import { getSite } from '../lib/site';

/** The Review data file: every Review card, loaded by the client-side Review. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(getSite().review), { headers: { 'Content-Type': 'application/json' } });
