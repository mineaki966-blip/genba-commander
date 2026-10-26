/* 現場コマンダー サービスワーカー：一度開けばオフラインでも遊べる */
const VER='gc-v4';
const CORE=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "img/bosai_n.webp", "img/cmd_n.webp", "img/cond_n.webp", "img/drv_n.webp", "img/mak_n.webp", "img/oni_a.webp", "img/oni_n.webp", "img/oni_s.webp", "img/safe_n.webp", "img/sakaki_n.webp", "img/sakura_a.webp", "img/sakura_n.webp", "img/sakura_s.webp", "img/scene_bus.webp", "img/scene_chem.webp", "img/scene_fire.webp", "img/scene_hwy.webp", "img/scene_train.webp", "img/tad_n.webp", "img/trk_n.webp"];
const BGM_LIST=["bgm/A_Map_of_Intent.mp3", "bgm/Calculated_Momentum.mp3", "bgm/Critical_Path.mp3", "bgm/The_Steady_Hand.mp3", "bgm/The_Weight_of_a_Breath.mp3", "bgm/Unsolved_Presence.mp3", "bgm/Where_the_Storm_Settles.mp3"];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(VER).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==location.origin){ /* Google Fonts など：取れたら保存、取れなければ保存分 */
    e.respondWith(caches.open(VER).then(c=>fetch(req).then(r=>{c.put(req,r.clone());return r}).catch(()=>c.match(req))));return}
  if(req.mode==='navigate'||url.pathname.endsWith('index.html')){ /* 本体は新しい版を優先 */
    e.respondWith(fetch(req).then(r=>{caches.open(VER).then(c=>c.put(req,r.clone()));return r}).catch(()=>caches.match(req).then(m=>m||caches.match('index.html'))));return}
  if(url.pathname.includes('/bgm/'))return; /* BGMは毎回ネットから（オフライン時は無音） */
  e.respondWith(caches.match(req).then(m=>m||fetch(req).then(r=>{if(r.ok&&r.status===200){const cp=r.clone();caches.open(VER).then(c=>c.put(req,cp))}return r})));
});
