import { useEffect, useRef, useCallback } from 'react'
const IMAGE_CACHE = new Map()
const FONT_CACHE = new Map()
async function loadImage(src) {
  if (!src) return null
  if (IMAGE_CACHE.has(src)) return IMAGE_CACHE.get(src)
  const p = new Promise(resolve => { const img = new Image(); img.crossOrigin='anonymous'; img.onload=()=>resolve(img); img.onerror=()=>resolve(null); img.src=src; })
  IMAGE_CACHE.set(src, p); return p
}
async function loadFont(name, url, type) {
  if (!url || FONT_CACHE.has(name)) return
  try { const fmt=type==='opentype'?'opentype':'truetype'; const font=new FontFace(name,`url(${url}) format('${fmt}')`); await font.load(); document.fonts.add(font); FONT_CACHE.set(name,true) } catch {}
}
function hexToRgb(hex) { if(!hex)return null; const m=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return m?{r:parseInt(m[1],16),g:parseInt(m[2],16),b:parseInt(m[3],16)}:null }
function renderColoredTemplate(ctx,templateImg,colors,w,h) {
  const off=document.createElement('canvas'); off.width=w; off.height=h; const octx=off.getContext('2d'); octx.drawImage(templateImg,0,0,w,h)
  let pixels; try{pixels=octx.getImageData(0,0,w,h)}catch{ctx.fillStyle=colors[0]||'#ccc'; ctx.fillRect(0,0,w,h); ctx.globalCompositeOperation='multiply'; ctx.drawImage(templateImg,0,0,w,h); ctx.globalCompositeOperation='source-over'; return}
  const d=pixels.data; const out=ctx.createImageData(w,h); const od=out.data; const c=colors.map(hexToRgb)
  for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],a=d[i+3]; if(a<10)continue; const lum=r*0.299+g*0.587+b*0.114; if(lum<60){od[i]=r;od[i+1]=g;od[i+2]=b;od[i+3]=a;continue} let fill=c[0]; if(r>180&&g<100&&b<100&&c[1])fill=c[1]; else if(g>180&&r<100&&b<100&&c[2])fill=c[2]; else if(b>180&&r<100&&g<100&&c[3])fill=c[3]; if(!fill)fill=c[0]||{r:200,g:200,b:200}; const t=lum/255; od[i]=Math.min(255,Math.round(fill.r*(0.5+t*0.5))); od[i+1]=Math.min(255,Math.round(fill.g*(0.5+t*0.5))); od[i+2]=Math.min(255,Math.round(fill.b*(0.5+t*0.5))); od[i+3]=a}
  ctx.putImageData(out,0,0)
}
export function useJerseyCanvas({canvasRef,part,templatePart,colors,playerName,playerNumber,fontName,fontUrl,fontType,textColor,strokeColor,textPositions,logoCenter,logoLeft,logoRight,laceFile,width=500,height=600}) {
  const activeRef=useRef(true)
  const render=useCallback(async()=>{
    const canvas=canvasRef.current; if(!canvas)return
    const ctx=canvas.getContext('2d'); canvas.width=width; canvas.height=height; ctx.clearRect(0,0,width,height)
    if(!templatePart?.img){ctx.fillStyle=colors[0]||'#1a3a6b'; ctx.fillRect(0,0,width,height); return}
    const [tImg,sImg,laceImg]=await Promise.all([loadImage(templatePart.img),loadImage(templatePart.shading),laceFile?loadImage(laceFile):null])
    if(!activeRef.current)return
    if(!tImg){ctx.fillStyle=colors[0]||'#ccc'; ctx.fillRect(0,0,width,height); return}
    renderColoredTemplate(ctx,tImg,colors,width,height)
    if(sImg){ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=0.55;ctx.drawImage(sImg,0,0,width,height);ctx.restore()}
    for(const cfg of[logoCenter,logoLeft,logoRight]){if(!cfg?.dataUrl)continue; const img=await loadImage(cfg.dataUrl); if(!img||!activeRef.current)continue; ctx.save(); ctx.translate(cfg.x*(width/1000),cfg.y*(height/1000)); if(cfg.r)ctx.rotate(cfg.r*Math.PI/180); const ss=(cfg.size||200)*(width/1000); ctx.drawImage(img,-ss/2,-ss/2,ss,ss); ctx.restore()}
    if(fontUrl)await loadFont(fontName,fontUrl,fontType)
    if(!activeRef.current)return
    const ff=(fontName&&FONT_CACHE.has(fontName))?`'${fontName}'`:`'Barlow Condensed'`
    if(textPositions?.length){for(const pos of textPositions){const txt=pos.type==='name'?(playerName||'PLAYER').toUpperCase():(playerNumber||'97'); if(!txt)continue; ctx.save(); ctx.translate(pos.x*(width/1000),pos.y*(height/1000)); ctx.rotate((pos.angle||0)*Math.PI/180); const fs=pos.fontSize*(width/1000); ctx.font=`900 ${fs}px ${ff}, 'Barlow Condensed', sans-serif`; ctx.textAlign=pos.align||'center'; ctx.textBaseline='middle'; if(strokeColor){ctx.strokeStyle=strokeColor;ctx.lineWidth=(pos.lineWidth||4)*(width/1000);ctx.lineJoin='round';ctx.strokeText(txt,0,0)} ctx.fillStyle=textColor||'#ffffff'; ctx.fillText(txt,0,0); ctx.restore()}}
    if(laceImg){ctx.save();ctx.globalAlpha=0.85;ctx.drawImage(laceImg,0,0,width,height);ctx.restore()}
  },[canvasRef,part,templatePart,colors,playerName,playerNumber,fontName,fontUrl,fontType,textColor,strokeColor,textPositions,logoCenter,logoLeft,logoRight,laceFile,width,height])
  useEffect(()=>{activeRef.current=true; render(); return()=>{activeRef.current=false}},[render])
}
