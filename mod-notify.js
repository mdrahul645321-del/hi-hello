export default function(ctx){
const{db,fs,S,$,esc}=ctx,{doc,setDoc,onSnapshot}=fs,W=window,t0=Date.now();
let ac=null,seen=0;
const unlock=()=>{try{ac=ac||new(W.AudioContext||W.webkitAudioContext)();ac.resume&&ac.resume()}catch(e){}
if('Notification' in W&&Notification.permission==='default')Notification.requestPermission().catch(()=>{})};
document.addEventListener('click',unlock);document.addEventListener('touchstart',unlock,{passive:true});
const beep=()=>{try{if(!ac)return;[[880,0],[1175,.16]].forEach(([f,d])=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;o.connect(g);g.connect(ac.destination);
g.gain.setValueAtTime(.0001,ac.currentTime+d);g.gain.exponentialRampToValueAtTime(.25,ac.currentTime+d+.02);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d+.15);o.start(ac.currentTime+d);o.stop(ac.currentTime+d+.16)});
navigator.vibrate&&navigator.vibrate([120,60,120])}catch(e){}};
const toast=(from,name,text)=>{let el=$('#hhtoast');if(el)el.remove();el=document.createElement('div');el.id='hhtoast';
el.style.cssText='position:fixed;top:calc(10px + env(safe-area-inset-top));left:10px;right:10px;z-index:99;padding:12px 14px;border-radius:14px;background:linear-gradient(135deg,#7c3ce6,#ff6b9d);color:#fff;font-weight:600;box-shadow:0 6px 20px #0006';
el.innerHTML='💬 '+esc(name)+': '+esc(text);el.onclick=()=>{el.remove();S.tab='chat';W.openChat(from)};document.body.appendChild(el);setTimeout(()=>el.remove(),5000)};
let unread=0;const base=document.title;
const setBadge=()=>{document.title=unread?'('+unread+') '+base:base};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){unread=0;setBadge()}});
onSnapshot(doc(db,'inbox',S.uid),s=>{if(!s.exists())return;const d=s.data();if(d.ts<=t0||d.ts<=seen)return;seen=d.ts;
const viewing=document.visibilityState==='visible'&&S.peer===d.from&&S.tab==='chat';
beep();
if(document.visibilityState==='visible'){if(!viewing)toast(d.from,d.name,d.text)}
else{unread++;setBadge();if('Notification' in W&&Notification.permission==='granted'&&navigator.serviceWorker)navigator.serviceWorker.ready.then(r=>r.showNotification(d.name,{body:d.text,icon:'hihello-192.png',tag:'hh-'+d.from,vibrate:[120,60,120]})).catch(()=>{})}
},()=>{});
const ping=txt=>{if(!S.peer)return;setDoc(doc(db,'inbox',S.peer),{from:S.uid,name:S.me.name,text:txt,ts:Date.now()}).catch(()=>{})};
const os=W.send,oi=W.sendImg;
W.send=function(){const el=$('#mt'),t=el&&el.value.trim();const r=os.apply(this,arguments);if(t)ping(t);return r};
W.sendImg=function(){const r=oi.apply(this,arguments);ping('📷 ছবি');return r};
}
