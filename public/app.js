'use strict';
const $=id=>document.getElementById(id),settingsKey='panel-casa-settings-v2';
const weatherLabels={0:'Despejado',1:'Mayormente despejado',2:'Parcialmente nublado',3:'Nublado',45:'Niebla',48:'Niebla con escarcha',51:'Llovizna leve',53:'Llovizna',55:'Llovizna intensa',61:'Lluvia leve',63:'Lluvia',65:'Lluvia intensa',80:'Chubascos leves',81:'Chubascos',82:'Chubascos fuertes',95:'Tormenta'};
const weatherUrl='https://api.open-meteo.com/v1/forecast?latitude=-33.4569&longitude=-70.6483&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max&timezone=America%2FSantiago';
const defaults={name:'',calendar:'',shortcuts:[['Calendario','https://calendar.google.com/'],['Notas','https://keep.google.com/'],['YouTube','https://www.youtube.com/'],['Mapas','https://www.google.com/maps']]},tips=['Toca pantalla completa para dejar el panel listo como reloj de mesa.','La pantalla se mantiene activa mientras el panel está visible.','Usa Ajustes para cambiar tus accesos rápidos y agregar un calendario.','Usa Ajustes para cambiar tus accesos rápidos y agregar un calendario.'];let config=loadConfig(),wakeLock,deferredInstall;
function loadConfig(){try{return {...defaults,...JSON.parse(localStorage.getItem(settingsKey)||'{}')};}catch{return {...defaults};}}function safeUrl(value){try{const url=new URL(value);return url.protocol==='https:'?url.href:'';}catch{return '';}}
function renderShortcuts(){const list=$('quick-links');list.replaceChildren(...config.shortcuts.map(([name,url],index)=>{const link=document.createElement('a');link.href=safeUrl(url)||'#';link.target='_blank';link.rel='noopener noreferrer';link.innerHTML=`<span>${String(index+1).padStart(2,'0')}</span>${name||'Acceso'} <b>↗</b>`;return link;}));}function renderCalendar(){const url=safeUrl(config.calendar);$('calendar-card').hidden=!url;if(url)$('calendar-frame').src=url;}
function openSettings(){const host=$('shortcut-settings');host.replaceChildren();const title=document.createElement('strong');title.textContent='Accesos rápidos';host.append(title);config.shortcuts.forEach(([name,url],index)=>{const label=document.createElement('label');label.textContent=`Acceso ${index+1}`;const input=document.createElement('input');input.name=`shortcut-name-${index}`;input.value=name;label.append(input);const address=document.createElement('label');address.textContent='Enlace';const urlInput=document.createElement('input');urlInput.type='url';urlInput.name=`shortcut-url-${index}`;urlInput.value=url;address.append(urlInput);host.append(label,address);});$('setting-name').value=config.name;$('setting-calendar').value=config.calendar;$('settings-dialog').showModal();}
function saveSettings(){const form=$('settings-form');config={name:form.elements['setting-name'].value.trim().slice(0,30),calendar:form.elements['setting-calendar'].value.trim(),shortcuts:config.shortcuts.map((_,i)=>[form.elements[`shortcut-name-${i}`].value.trim().slice(0,24),form.elements[`shortcut-url-${i}`].value.trim()])};try{localStorage.setItem(settingsKey,JSON.stringify(config));}catch{}renderShortcuts();renderCalendar();tick();$('status').textContent='Cambios guardados en este dispositivo.';}
function tick(){const now=new Date();$('hours-minutes').textContent=new Intl.DateTimeFormat('es',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);$('seconds').textContent=String(now.getSeconds()).padStart(2,'0');$('time').dateTime=now.toISOString();$('date').textContent=new Intl.DateTimeFormat('es',{weekday:'long',day:'numeric',month:'long'}).format(now);const hour=now.getHours(),prefix=hour<6?'Buenas noches':hour<12?'Buenos días':hour<20?'Buenas tardes':'Buenas noches';$('greeting').textContent=config.name?`${prefix}, ${config.name}`:prefix;const index=Math.floor(now.getTime()/30000)%tips.length;$('home-tip').textContent=tips[index];$('tip-number').textContent=`${index+1} / ${tips.length}`;}
function renderForecast(daily){const format=new Intl.DateTimeFormat('es-CL',{weekday:'short'});$('forecast').replaceChildren(...daily.time.slice(1,4).map((date,index)=>{const el=document.createElement('div');el.className='forecast-day';el.innerHTML=`<span>${format.format(new Date(`${date}T12:00:00`))}</span><strong>${Math.round(daily.temperature_2m_max[index+1])}°</strong><em>${weatherLabels[daily.weather_code[index+1]]||'Variable'}</em>`;return el;}));}
async function refreshWeather(){$('weather-badge').textContent='Actualizando';$('refresh-weather').disabled=true;try{const response=await fetch(weatherUrl);if(!response.ok)throw Error();const data=await response.json(),current=data.current;if(!current||!Number.isFinite(current.temperature_2m))throw Error();$('temperature').textContent=`${Math.round(current.temperature_2m)}°`;$('condition').textContent=weatherLabels[current.weather_code]||'Estado no disponible';$('weather-note').textContent=`Sensación de ${Math.round(current.apparent_temperature)}° · Actualizado ${new Intl.DateTimeFormat('es-CL',{hour:'2-digit',minute:'2-digit'}).format(new Date())}`;renderForecast(data.daily);$('weather-badge').textContent='En vivo';$('status').textContent='';return current;}catch{$('weather-badge').textContent='Sin conexión';$('condition').textContent='No se pudo actualizar';$('weather-note').textContent='Comprueba la conexión y toca “Actualizar clima”.';$('status').textContent='El reloj sigue funcionando sin conexión.';throw Error();}finally{$('refresh-weather').disabled=false;}}
async function requestWakeLock(){try{if('wakeLock'in navigator&&!document.hidden)wakeLock=await navigator.wakeLock.request('screen');}catch{}}
$('settings').addEventListener('click', openSettings);
$('settings-form').addEventListener('submit', event => { if (event.submitter?.id === 'save-settings') saveSettings(); });
$('refresh-weather').addEventListener('click', () => refreshWeather().catch(() => {}));
$('close-calendar').addEventListener('click', () => {
  $('calendar-card').classList.remove('is-expanded');
  $('expand-calendar').textContent = 'Ampliar';
});
$('fullscreen').addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('status').textContent = 'No se pudo activar la pantalla completa.'; } });
document.addEventListener('fullscreenchange', () => { $('fullscreen').textContent = document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa'; });
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstall = event; $('install').hidden = false; });
$('install').addEventListener('click', async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; $('install').hidden = true; });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
document.addEventListener('visibilitychange', () => { if (!document.hidden) { tick(); requestWakeLock(); } });
renderShortcuts(); renderCalendar(); tick(); refreshWeather().catch(() => {}); requestWakeLock();
setInterval(tick, 1000); setInterval(() => refreshWeather().catch(() => {}), 15 * 60 * 1000);


function renderShortcuts(){
  const list=$('quick-links');
  list.replaceChildren(...config.shortcuts.map(([name,url],index)=>{
    const link=document.createElement('a');
    const calendarUrl=safeUrl(config.calendar);
    if(index===0&&calendarUrl){
      link.href='#';
      link.addEventListener('click',event=>{event.preventDefault();$('calendar-card').hidden=false;});
    }else{link.href=safeUrl(url)||'#';link.target='_blank';link.rel='noopener noreferrer';}
    link.innerHTML=`<span>${String(index+1).padStart(2,'0')}</span>${name||'Acceso'} <b>↗</b>`;
    return link;
  }));
}
function renderCalendar(){const url=safeUrl(config.calendar);$('calendar-card').hidden=true;if(url)$('calendar-frame').src=url;}

function renderShortcuts(){const list=$('quick-links');list.replaceChildren(...config.shortcuts.map(([name,url],index)=>{const link=document.createElement('a');link.href=safeUrl(url)||'#';link.target='_blank';link.rel='noopener noreferrer';link.innerHTML=`<span>${String(index+1).padStart(2,'0')}</span>${name||'Acceso'} <b>↗</b>`;return link;}));}
function renderCalendar(){const url=safeUrl(config.calendar);$('calendar-card').hidden=!url;if(url)$('calendar-frame').src=url;}

$('expand-calendar').addEventListener('click', () => {
  const calendar = $('calendar-card');
  calendar.classList.toggle('is-expanded');
  $('expand-calendar').textContent = calendar.classList.contains('is-expanded') ? 'Reducir' : 'Ampliar';
});


function renderCalendar(){
  const url=safeUrl(config.calendar);
  $('calendar-card').hidden=false;
  $('calendar-message').hidden=Boolean(url);
  $('calendar-frame').hidden=!url;
  if(url)$('calendar-frame').src=url;
}
function updateNightMode(){
  const hour=new Date().getHours();
  const night=localStorage.getItem('panel-casa-night')==='on'||(localStorage.getItem('panel-casa-night')!=='off'&&(hour>=22||hour<7));
  document.body.classList.toggle('night-mode',night);
  $('night-mode').textContent=night?'Modo día':'Modo noche';
}
$('night-mode').addEventListener('click',()=>{const active=document.body.classList.contains('night-mode');localStorage.setItem('panel-casa-night',active?'off':'on');updateNightMode();});
updateNightMode();
