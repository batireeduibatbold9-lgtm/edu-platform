export const $ = (s, root=document) => root.querySelector(s);

export function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

export function toast(message){
  const box = document.createElement("div");
  box.className = "toast";
  box.textContent = message;
  $("#toast-container").appendChild(box);
  setTimeout(()=>box.remove(), 3500);
}

export function openModal(html){
  $("#modal-content").innerHTML = html;
  $("#modal").classList.remove("hidden");
}
export function closeModal(){
  $("#modal").classList.add("hidden");
  $("#modal-content").innerHTML = "";
}
$("#modal-close")?.addEventListener("click", closeModal);
$("#modal")?.addEventListener("click", e => { if(e.target.id==="modal") closeModal(); });

export function setContent(html){ $("#content").innerHTML = html; }
export function setTitle(title, subtitle=""){
  $("#page-title").textContent=title;
  $("#page-subtitle").textContent=subtitle;
}

export function formatDate(v){
  if(!v) return "-";
  return new Date(v).toLocaleString();
}

export function formatRemaining(ms){
  ms=Math.max(0,ms);
  const s=Math.floor(ms/1000), h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60;
  return [h,m,sec].map((x,i)=>i===0?String(x).padStart(2,"0"):String(x).padStart(2,"0")).join(":");
}
