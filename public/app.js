'use strict';

const $ = id => document.getElementById(id);
const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=-33.4569&longitude=-70.6483&current=temperature_2m,apparent_temperature,weather_code&timezone=America%2FSantiago';
const weatherLabels = {
  0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Niebla', 48: 'Niebla con escarcha', 51: 'Llovizna leve', 53: 'Llovizna',
  55: 'Llovizna intensa', 56: 'Llovizna helada leve', 57: 'Llovizna helada intensa',
  61: 'Lluvia leve', 63: 'Lluvia', 65: 'Lluvia intensa', 66: 'Lluvia helada leve',
  67: 'Lluvia helada intensa', 71: 'Nieve leve', 73: 'Nieve', 75: 'Nieve intensa',
  77: 'Granos de nieve', 80: 'Chubascos leves', 81: 'Chubascos', 82: 'Chubascos fuertes',
  85: 'Chubascos de nieve leves', 86: 'Chubascos de nieve fuertes', 95: 'Tormenta',
  96: 'Tormenta con granizo leve', 99: 'Tormenta con granizo fuerte'
};

function tick() {
  const now = new Date();
  $('hours-minutes').textContent = new Intl.DateTimeFormat('es', {
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).format(now);
  $('seconds').textContent = String(now.getSeconds()).padStart(2, '0');
  $('time').dateTime = now.toISOString();
  $('date').textContent = new Intl.DateTimeFormat('es', {
    weekday: 'long', day: 'numeric', month: 'long'
  }).format(now);
  const hour = now.getHours();
  $('greeting').textContent = hour < 6 ? 'Buenas noches' : hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
}

async function refreshWeather() {
  $('weather-badge').textContent = 'Actualizando';
  $('refresh-weather').disabled = true;
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error('Respuesta meteorológica no disponible');
    const data = await response.json();
    if (!data.current || !Number.isFinite(data.current.temperature_2m)) throw new Error('Datos meteorológicos incompletos');
    const temperature = Math.round(data.current.temperature_2m);
    const apparent = Math.round(data.current.apparent_temperature);
    $('temperature').textContent = `${temperature}°`;
    $('condition').textContent = weatherLabels[data.current.weather_code] || 'Estado no disponible';
    $('weather-note').textContent = `Sensación de ${apparent}° · Actualizado ${new Intl.DateTimeFormat('es-CL', {hour:'2-digit', minute:'2-digit'}).format(new Date())}`;
    $('weather-badge').textContent = 'En vivo';
    $('status').textContent = '';
    return { city: 'Santiago de Chile', temperature, apparent, condition: $('condition').textContent };
  } catch (error) {
    $('weather-badge').textContent = 'Sin conexión';
    $('condition').textContent = 'No se pudo actualizar';
    $('weather-note').textContent = 'Comprueba la conexión y toca “Actualizar clima”.';
    $('status').textContent = 'El reloj sigue funcionando sin conexión.';
    throw error;
  } finally {
    $('refresh-weather').disabled = false;
  }
}

$('refresh-weather').addEventListener('click', () => { refreshWeather().catch(() => {}); });
$('fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    else $('status').textContent = 'Este navegador no permite activar pantalla completa desde el panel.';
  } catch {
    $('status').textContent = 'No se pudo activar la pantalla completa en este navegador.';
  }
});
document.addEventListener('fullscreenchange', () => {
  $('fullscreen').textContent = document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa';
});

function registerWebMcp() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  try {
    void Promise.resolve(context.registerTool({
      name: 'refresh_weather',
      title: 'Actualizar clima',
      description: 'Actualiza el clima visible de Santiago de Chile y devuelve las condiciones actuales.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: () => refreshWeather()
    })).catch(() => {});
  } catch { /* El navegador puede no admitir WebMCP. */ }
}

tick();
refreshWeather().catch(() => {});
registerWebMcp();
setInterval(tick, 1000);
setInterval(() => { refreshWeather().catch(() => {}); }, 15 * 60 * 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
