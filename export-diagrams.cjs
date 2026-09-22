const fs=require('fs'),vm=require('vm'),path=require('path');
const root=__dirname,source=fs.readFileSync(path.join(root,'app.js'),'utf8');
const context={};vm.createContext(context);vm.runInContext(source.slice(source.indexOf('function text'),source.indexOf('function update')),context);
const dest=path.resolve(root,'../../03_Berufsschule/ET2/00_Pirmin/Unterrichtsstunden/02_Elektromagnetismus/bilder');
for(const [name,g,v] of [['gruppe_a_plus','A',1],['gruppe_a_minus','A',-1],['gruppe_b','B',1],['gruppe_c','C',50]]){
 let svg=context.diagram(g,v).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320" ');
 svg=svg.replace(/<path d="M -17 0 H 14.*?\/>/g,'').replace(/<g transform="translate\([^"]+\) rotate\([^"]+\)">.*?<\/g>/g,'').replace(/<text[^>]*>[NS]<\/text>/g,'');
 svg=svg.replace(/<text /g,'<text font-family="Arial" font-size="16" fill="#182c43" ');
 fs.writeFileSync(path.join(dest,name+'.svg'),svg);
}
