// 像素心情日记：一天一格 / 年度像素图 / 每周回顾（规则生成文案，不调用任何 AI 接口）
(function(){
const KEY='pixy-web.v1',$=s=>document.querySelector(s);
const MOODS=[{v:6,n:'超棒'},{v:5,n:'很好'},{v:4,n:'不错'},{v:3,n:'一般'},{v:2,n:'有点丧'},{v:1,n:'很糟'},{v:0,n:'崩溃'}];
const COLOR=v=>`var(--m${v})`;
const TAGS=['上课','考试','实习','求职面试','加班','开会','被认可','搞砸了','社交','独处','运动','睡得好','熬夜','家人','恋爱','花钱','通勤','做饭'];
const TIPS={熬夜:'熬夜的日子心情明显更低，下周试试给自己定一个「12 点前放下手机」的小目标。',加班:'加班和低落常常一起出现。可以在加班后给自己留 20 分钟完全不想工作的时间。',考试:'考试周情绪起伏很正常，把复习拆成小块，每完成一块就记一笔。',求职面试:'面试日压力大，结束后写一句「今天学到了什么」，比反复回想失误更有用。',搞砸了:'搞砸的事情会过去。试着在备注里写下下一次可以怎么做。',通勤:'通勤消耗了不少能量，可以准备一个只在路上听的播客或歌单。',花钱:'花钱的日子心情偏低，也许值得看看是不是有冲动消费。',开会:'会多的日子心情偏低，可以试着把需要专注的事安排在没有会的上午。'};
let D;try{D=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){D={}}
const save=()=>localStorage.setItem(KEY,JSON.stringify(D));
const k=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const parse=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
const WK='日一二三四五六';const label=d=>`${d.getMonth()+1}月${d.getDate()}日 周${WK[d.getDay()]}`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
const mName=v=>MOODS.find(m=>m.v===Math.round(v)).n;

// Tabs
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
function tab(t){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));document.querySelectorAll('.tab').forEach(s=>s.classList.toggle('hidden',s.id!==t));({today:drawToday,year:drawYear,week:drawWeek})[t]()}

// 今天
let cur=k(new Date()),sel={};
$('#moods').innerHTML=MOODS.map(m=>`<button class="mood" data-v="${m.v}"><i style="background:${COLOR(m.v)}"></i>${m.n}</button>`).join('');
$('#tags').innerHTML=TAGS.map(t=>`<button class="tag">${t}</button>`).join('');
$('#moods').onclick=e=>{const b=e.target.closest('.mood');if(b){sel.v=+b.dataset.v;drawSel()}};
$('#tags').onclick=e=>{const b=e.target.closest('.tag');if(!b)return;const t=b.textContent;sel.tags=sel.tags||[];sel.tags=sel.tags.includes(t)?sel.tags.filter(x=>x!==t):[...sel.tags,t];drawSel()};
$('#pick').onchange=e=>{if(e.target.value){cur=e.target.value;drawToday()}};
function drawSel(){document.querySelectorAll('.mood').forEach(b=>b.classList.toggle('on',+b.dataset.v===sel.v));document.querySelectorAll('.tag').forEach(b=>b.classList.toggle('on',(sel.tags||[]).includes(b.textContent)))}
function drawToday(){const e=D[cur];sel=e?{v:e.v,tags:[...(e.tags||[])]}:{tags:[]};$('#note').value=e?e.note||'':'';$('#pick').value=cur;$('#pick').max=k(new Date());
 $('#dateLabel').textContent=label(parse(cur))+(cur===k(new Date())?' · 今天':'');$('#saved').textContent=e?'这一天已经记过了，可以修改。':'';drawSel()}
$('#save').onclick=()=>{if(sel.v==null){$('#saved').textContent='先选一个心情颜色吧';return}D[cur]={v:sel.v,tags:sel.tags||[],note:$('#note').value.trim()};save();$('#saved').textContent='已记下 ✓ 去「年度像素」看看这一格吧'};

// 年度像素
let Y=new Date().getFullYear();
$('#yPrev').onclick=()=>{Y--;drawYear()};$('#yNext').onclick=()=>{Y++;drawYear()};
function drawYear(){$('#yLabel').textContent=Y+' 年';let h='<span></span>';for(let m=1;m<=12;m++)h+=`<span class="h">${m}月</span>`;const today=k(new Date());
 for(let d=1;d<=31;d++){h+=`<span class="d">${d}</span>`;for(let m=0;m<12;m++){const dt=new Date(Y,m,d);if(dt.getMonth()!==m){h+='<span class="cell x"></span>';continue}const kk=k(dt),e=D[kk];h+=`<button class="cell ${kk===today?'today':''}" data-k="${kk}" title="${label(dt)}${e?' · '+mName(e.v):''}" style="${e?'background:'+COLOR(e.v):''}"></button>`}}
 $('#grid').innerHTML=h;$('#legend').innerHTML=MOODS.map(m=>`<span><i style="background:${COLOR(m.v)}"></i>${m.n}</span>`).join('')+'<span><i style="background:var(--empty)"></i>未记录</span>';
 const ys=Object.entries(D).filter(([kk])=>kk.startsWith(Y+'-'));const vals=ys.map(([,e])=>e.v);
 let best=0,run=0;const days=new Date(Y,11,31);for(let d=new Date(Y,0,1);d<=days;d.setDate(d.getDate()+1)){if(D[k(d)]){run++;best=Math.max(best,run)}else run=0}
 const a=avg(vals);$('#ystats').innerHTML=`<div class="stat"><b>${ys.length}</b><small>记录天数</small></div><div class="stat"><b>${a==null?'—':mName(a)}</b><small>全年平均心情</small></div><div class="stat"><b>${best}</b><small>最长连续记录（天）</small></div>`}
$('#grid').onclick=e=>{const c=e.target.closest('.cell[data-k]');if(c&&c.dataset.k<=k(new Date())){cur=c.dataset.k;tab('today')}};

// 每周回顾
let W=0;$('#wPrev').onclick=()=>{W--;drawWeek()};$('#wNext').onclick=()=>{if(W<0){W++;drawWeek()}};
function weekDays(off){const t=new Date();const mon=new Date(t.getFullYear(),t.getMonth(),t.getDate()-((t.getDay()+6)%7)+off*7);return[...Array(7)].map((_,i)=>new Date(mon.getFullYear(),mon.getMonth(),mon.getDate()+i))}
function drawWeek(){const ds=weekDays(W);$('#wLabel').textContent=W===0?'本周回顾':`${label(ds[0]).split(' ')[0]} – ${label(ds[6]).split(' ')[0]}`;
 $('#strip').innerHTML=ds.map(d=>{const e=D[k(d)];return `<div class="wd">周${WK[d.getDay()]}<i style="${e?'background:'+COLOR(e.v):''}"></i></div>`}).join('');
 $('#review').innerHTML=review(ds)}
function review(ds){const es=ds.map(d=>({d,e:D[k(d)]})).filter(x=>x.e);const head='<h2>这周的你</h2><p class="tagline">根据你的记录按规则生成，不会上传任何数据</p>';
 if(es.length<3)return head+`<p>这周记录了 ${es.length} 天。再多记 ${3-es.length} 天，就能看到这周的情绪小结。</p><p class="tip">小建议：把记录放在睡前固定时间，10 秒就够。</p>`;
 const vs=es.map(x=>x.e.v),a=avg(vs),prev=weekDays(W-1).map(d=>D[k(d)]).filter(Boolean).map(e=>e.v),pa=avg(prev);
 const hi=es.reduce((p,c)=>c.e.v>p.e.v?c:p),lo=es.reduce((p,c)=>c.e.v<p.e.v?c:p);
 const li=[];li.push(`记录了 <b>${es.length}/7</b> 天，平均心情是「<b>${mName(a)}</b>」${pa==null?'':a-pa>0.4?'，比上周好一些 ↑':a-pa<-0.4?'，比上周低一些 ↓':'，和上周差不多'}。`);
 if(hi.e.v!==lo.e.v){li.push(`状态最好的是 <b>周${WK[hi.d.getDay()]}</b>${hi.e.tags.length?'（'+hi.e.tags.slice(0,3).map(esc).join('、')+'）':''}${hi.e.note?'：“'+esc(hi.e.note)+'”':''}。`);li.push(`最低落的是 <b>周${WK[lo.d.getDay()]}</b>${lo.e.tags.length?'（'+lo.e.tags.slice(0,3).map(esc).join('、')+'）':''}。`)}
 // 标签与心情的关系：用全部历史记录算，样本 ≥3 次才下结论
 const all=Object.values(D),ga=avg(all.map(e=>e.v)),eff=TAGS.map(t=>{const w=all.filter(e=>(e.tags||[]).includes(t)).map(e=>e.v);return{t,n:w.length,d:w.length>=3?avg(w)-ga:0}}).filter(x=>x.n>=3);
 const up=eff.filter(x=>x.d>0.5).sort((a,b)=>b.d-a.d)[0],dn=eff.filter(x=>x.d<-0.5).sort((a,b)=>a.d-b.d)[0];
 if(up)li.push(`在你的记录里，有「${up.t}」的日子心情通常更好（${up.n} 次记录）。`);
 if(dn)li.push(`有「${dn.t}」的日子心情通常偏低（${dn.n} 次记录）。`);
 let tip=dn&&TIPS[dn.t]?TIPS[dn.t]:up?`「${up.t}」是你的充电方式，下周有意多安排一次吧。`:'继续记录几周，就能看出哪些事情在影响你的心情。';
 let run=0,maxRun=0;ds.forEach(d=>{const e=D[k(d)];if(e&&e.v<=1){run++;maxRun=Math.max(maxRun,run)}else run=0});
 if(maxRun>=3)tip='连续几天都很难熬，辛苦了。可以和信任的朋友、家人聊聊，或者联系学校 / 公司的心理咨询服务，不需要一个人扛着。';
 return head+`<ul>${li.map(x=>`<li>${x}</li>`).join('')}</ul><p class="tip">${tip}</p>`}

// 示例数据（明确标注为示例，可一键清空）
$('#demo').onclick=()=>{if(Object.keys(D).length&&!confirm('示例数据会覆盖已有记录，确定吗？'))return;D={};const t=new Date();let s=7;
 for(let i=200;i>=0;i--){const d=new Date(t.getFullYear(),t.getMonth(),t.getDate()-i);if(Math.random()<.15)continue;const tags=TAGS.filter(()=>Math.random()<.12);let v=4+(Math.random()*3|0)-1;if(tags.includes('熬夜')||tags.includes('加班'))v-=2;if(tags.includes('运动')||tags.includes('被认可'))v+=1;D[k(d)]={v:Math.max(0,Math.min(6,v)),tags,note:''}}save();tab('year')};
$('#clear').onclick=()=>{if(confirm('确定清空全部记录吗？此操作不能撤销。')){D={};save();tab('today')}};
tab('today');
})();
