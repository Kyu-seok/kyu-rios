import type { APIRoute } from 'astro';
import { getSite } from '../lib/site';

/** The Graph data file: Nodes and Relationships, loaded by the client-side Graph. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(getSite().graph), { headers: { 'Content-Type': 'application/json' } });
