import {fields,labels,missing,handoff,setupPrompt,continuationPrompt,examples} from './core.mjs';
const $=id=>document.getElementById(id);
const input=()=>Object.fromEntries(fields.map(k=>[k,$(k).value]));
function render(){const gaps=missing(input());$('output').value=handoff(input());$('coverage').textContent=gaps.length?`${6-gaps.length}/6 fields filled. Still needed: ${gaps.map(k=>labels[k].toLowerCase()).join(', ')}.`:'6/6 fields filled. Check the facts before sharing.';['copy','download','copy-setup'].forEach(id=>$(id).disabled=gaps.length>0);$('copy-status').textContent='';$('setup-status').textContent='';}
fields.forEach(k=>$(k).addEventListener('input',render));
$('handoff-form').addEventListener('submit',e=>e.preventDefault());
$('load').addEventListener('click',()=>{if(fields.some(k=>$(k).value.trim())&&!window.confirm('Replace the current fields with a fictional example?'))return;const ex=examples[$('example').value];fields.forEach(k=>$(k).value=ex[k]);render();});
async function copy(text,status){try{await navigator.clipboard.writeText(text);$(status).textContent='Copied. Paste into the assistant you choose.';}catch{const area=document.createElement('textarea');area.value=text;area.readOnly=true;area.setAttribute('aria-label','Text to copy manually');area.style.cssText='width:100%;min-height:180px';const old=$(status).querySelector('textarea');if(old)old.remove();$(status).textContent='Clipboard is unavailable. Select and copy this text:';$(status).appendChild(area);area.focus();area.select();}}
$('copy').addEventListener('click',()=>copy(handoff(input()),'copy-status'));
$('copy-setup').addEventListener('click',()=>copy(setupPrompt(input()),'setup-status'));
$('copy-continue').addEventListener('click',()=>copy(continuationPrompt(),'setup-status'));
$('download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([handoff(input())],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='task-handoff.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
const allowed=new Set(['github','skill-directory','community','direct']);const source=new URLSearchParams(location.search).get('from');if(allowed.has(source)){$('setup-link').href=`https://tokenrip.com/setup?utm_source=handoff-kit-${source}&utm_medium=tool&utm_campaign=first-use-20261026`;}
render();
