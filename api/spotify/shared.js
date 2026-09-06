import crypto from 'node:crypto';
export const redirectUri=()=>process.env.SPOTIFY_REDIRECT_URI||'https://paneldecasa.vercel.app/api/spotify/callback';
export const cookie=(name,value,maxAge)=>`${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
export const readCookies=req=>Object.fromEntries(String(req.headers.cookie||'').split(';').map(x=>x.trim().split('=').map(decodeURIComponent)).filter(x=>x[0]));
export const tokenRequest=async(params)=>{let r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{authorization:'Basic '+Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams(params)}),d=await r.json();if(!r.ok)throw Error(d.error_description||'Spotify rechazó la conexión');return d};
export const state=()=>crypto.randomBytes(24).toString('hex');
