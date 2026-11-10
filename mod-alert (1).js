export default function(ctx){
const{db,fs,S,$,esc,user}=ctx,{collection,addDoc,onSnapshot,deleteDoc}=fs,W=window;
let ac;const beep=()=>{try{ac=ac||new(W.AudioContext||W.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=880;g.gain.setValueAtTime(.25,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.45);o.start();o.stop(ac.currentTime+.45)}catch(e){}};
const wrap=n=>{const orig=W[n];W[n]=async function(){const peer=S.peer,t=document.querySelector('#mt'),f=document.querySelector('#mf');
let text=n==='send'?(t?t.value.trim():''):(f&&f.files[0]?'📷 ছবি':'');
await orig.apply(this,arguments);if(peer&&text)addDoc(collection(db,'inbox',peer,'items'),{from:S.uid,text:text.slice(0,80),ts:Date.now()}).catch(()=>{})}};
wrap('send');wrap('sendImg');
const baseTitle=document.title;document.addEventListener('visibilitychange',()=>{if(!document.hidden)document.title=baseTitle});
function banner(html,peer){let b=document.querySelector('#hhb');if(!b){b=document.createElement('div');b.id='hhb';b.style.cssText='position:fixed;top:calc(8px + env(safe-area-inset-top));left:10px;right:10px;z-index:99;background:#7c3ce6;color:#fff;padding:12px 14px;border-radius:14px;box-shadow:0 6px 20px #0006;font-size:14px';document.body.appendChild(b)}
b.innerHTML=html;b.style.display='block';b.onclick=()=>{b.style.display='none';if(peer){S.tab='chat';W.openChat(peer)}};clearTimeout(b.t);b.t=setTimeout(()=>b.style.display='none',4500)}
function notify(m){const name=user(m.from).name||'কেউ';const open=S.peer===m.from&&!document.hidden;
beep();if(navigator.vibrate)navigator.vibrate([150,80,150]);
if(!open){banner('💬 <b>'+esc(name)+'</b>: '+esc(m.text),m.from);document.title='(●) '+name;
if(document.hidden&&W.Notification&&Notification.permission==='granted'){try{new Notification(name,{body:m.text,icon:'hihello-192.png'})}catch(e){}}}}
const since=Date.now();
onSnapshot(collection(db,'inbox',S.uid,'items'),s=>{let missed=0;s.docChanges().forEach(c=>{if(c.type!=='added')return;const m=c.doc.data();if(m.ts<since-3000)missed++;else notify(m);deleteDoc(c.doc.ref).catch(()=>{})});
if(missed){beep();banner('💬 তুমি '+missed+'টি নতুন মেসেজ পেয়েছ',null)}},e=>console.log('inbox',e.code));
W.hhAlertPerm=()=>{if(!W.Notification)return alert('এই ব্রাউজারে সাপোর্ট নেই');Notification.requestPermission().then(()=>ctx.render())};
W.hhAlertTest=()=>{beep();if(navigator.vibrate)navigator.vibrate(200)};
ctx.addTab('alert','🔔','সাইন',()=>`<div class="card"><h2>নোটিফিকেশন ও সাউন্ড</h2><button class="btn" onclick="hhAlertTest()">🔊 টেস্ট সাউন্ড</button><button class="btn" onclick="hhAlertPerm()">🔔 ব্রাউজার নোটিফিকেশনের অনুমতি</button><p class="mu">অবস্থা: ${W.Notification?Notification.permission:'অসমর্থিত'}</p><p class="mu">অ্যাপ খোলা বা ব্যাকগ্রাউন্ডে থাকলে মেসেজে শব্দ, কম্পন ও ব্যানার আসবে। অ্যাপ পুরো বন্ধ থাকলে আসবে না।</p></div>`)}
