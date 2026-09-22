'use strict';
(function(root){
const MU0=4*Math.PI*1e-7;
function wire(current,r=.02){if(!(r>0))throw new RangeError('Abstand muss positiv sein');return MU0*Math.abs(current)/(2*Math.PI*r)*1e6;}
function coil(n,current=1,length=.4){if(!(length>0)||n<0)throw new RangeError('Ungültige Spulengeometrie');return MU0*n*Math.abs(current)/length*1e6;}
function measure(group,value){if(group==='A')return {setting:value,field:wire(value),direction:value>0?'gegen den Uhrzeigersinn':value<0?'im Uhrzeigersinn':'keine Feldrichtung'};if(group==='B')return {setting:value,field:wire(value),direction:value===0?'keine Feldrichtung':'gegen den Uhrzeigersinn'};if(group==='C')return {setting:value,field:coil(value),direction:'innen nach links; links N, rechts S'};throw new Error('Unbekannte Gruppe');}
const api={wire,coil,measure};root.MagnetModel=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
