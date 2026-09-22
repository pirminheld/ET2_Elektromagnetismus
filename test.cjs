const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('./model.js');let checks=0;function ok(x){assert.ok(x);checks++;}function near(x,y){ok(Math.abs(x-y)<1e-8);}
near(M.wire(1),10);near(M.wire(0),0);near(M.wire(-1),10);near(M.wire(4),40);near(M.coil(50),157.07963267948966);near(M.coil(200),628.3185307179587);
for(let i=.5;i<=4;i+=.5){near(M.wire(2*i),2*M.wire(i));near(M.wire(-i),M.wire(i));}
for(const n of [50,100,150,200])near(M.coil(n*2),2*M.coil(n));
ok(M.measure('A',-1).direction==='im Uhrzeigersinn');ok(M.measure('A',0).direction==='keine Feldrichtung');
// Minimal DOM harness executes the actual UI handlers, without browser dependencies.
const nodes={},buttons=[];class El{constructor(id){this.id=id;this.value='';this.dataset={};this.handlers={};this.classList={toggle(){}};this.attrs={};}addEventListener(t,f){this.handlers[t]=f;}setAttribute(k,v){this.attrs[k]=v;}set innerHTML(s){this.html=s;if(this.id==='controls'){delete nodes.setting;delete nodes['setting-output'];buttons.length=0;for(const m of s.matchAll(/data-current="([^"]+)"/g)){const b=new El('');b.dataset.current=m[1];buttons.push(b);}if(s.includes('id="setting"')){nodes.setting=new El('setting');nodes['setting-output']=new El('setting-output');}}}get innerHTML(){return this.html||'';}fire(t){this.handlers[t]?.();}}
const html=fs.readFileSync(__dirname+'/index.html','utf8');for(const m of html.matchAll(/id="([^"]+)"/g))nodes[m[1]]=new El(m[1]);
const tabs=['A','B','C'].map(g=>{const b=new El('');b.dataset.group=g;return b;});let stored='',printed=false;
const ctx={console,MagnetModel:M,document:{getElementById:id=>nodes[id]||null,querySelectorAll:s=>s==='[data-group]'?tabs:buttons},localStorage:{getItem:()=>null,setItem:(k,v)=>stored=v},location:{hash:''},history:{replaceState(){}},window:{print(){printed=true;}}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),ctx);
ok(nodes.reading.textContent==='10 µT');buttons[2].fire('click');ok(nodes.direction.textContent==='im Uhrzeigersinn');ok(nodes.diagram.innerHTML.includes('rotate(90)'));buttons[1].fire('click');ok(!nodes.diagram.innerHTML.includes('stroke="#4385b9"'));ok(nodes.reading.textContent==='0 µT');
tabs[1].fire('click');nodes.setting.value='4';nodes.setting.fire('input');near(nodes['field-meter'].value,40);
tabs[2].fire('click');nodes.setting.value='200';nodes.setting.fire('input');near(nodes['field-meter'].value,M.coil(200));ok(nodes.diagram.innerHTML.includes('200 Windungen'));nodes.reset.fire('click');near(nodes['field-meter'].value,M.coil(50));
tabs[1].fire('click');near(nodes['field-meter'].value,40);nodes.reset.fire('click');near(nodes['field-meter'].value,10);
ok(!html.includes('<textarea'));ok(!html.includes('id="record"'));ok(!html.includes('id="measurements"'));ok(!fs.readFileSync(__dirname+'/app.js','utf8').includes('localStorage'));
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g))ok(fs.existsSync(__dirname+'/'+m[1]));
console.log(checks+' Prüfungen bestanden (Fachmodell, Gruppenwechsel, Regler, Rücksetzen, lokale Dateien).');
