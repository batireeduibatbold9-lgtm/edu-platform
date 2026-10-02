import { sb } from "./supabase.js";
import { $, toast, setContent, setTitle, escapeHtml, formatDate } from "./ui.js";
import { renderTeacher } from "./teacher.js";
import { renderStudent } from "./student.js";

let session=null, profile=null;

async function loadProfile(){
  const {data:{user}} = await sb.auth.getUser();
  if(!user) return null;
  const {data,error}=await sb.from("profiles").select("*").eq("id",user.id).single();
  if(error) throw error;
  return data;
}

function nav(role){
  const items = role==="teacher"
    ? [["dashboard","Dashboard"],["courses","Courses"],["exams","Exams"],["results","Results"],["notifications","Notifications"]]
    : [["dashboard","Dashboard"],["courses","My Courses"],["exams","Exams"],["results","My Results"],["leaderboard","Leaderboard"],["notifications","Notifications"]];
  $("#nav").innerHTML=items.map(([id,label])=>`<button class="nav-btn" data-page="${id}">${label}</button>`).join("");
  $("#nav").querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>route(b.dataset.page));
}

async function showApp(){
  $("#auth-view").classList.add("hidden");
  $("#app-view").classList.remove("hidden");
  $("#user-mini").innerHTML=`<b>${escapeHtml(profile.full_name)}</b><br><span class="muted">${escapeHtml(profile.email||"")} · ${profile.role}</span>`;
  nav(profile.role);
  route("dashboard");
}

async function showAuth(){
  $("#auth-view").classList.remove("hidden");
  $("#app-view").classList.add("hidden");
}

async function route(page){
  $("#nav").querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  if(profile.role==="teacher") await renderTeacher(page, profile);
  else await renderStudent(page, profile);
}

$("#login-tab").onclick=()=>{
  $("#login-tab").classList.add("active"); $("#signup-tab").classList.remove("active");
  $("#login-form").classList.remove("hidden"); $("#signup-form").classList.add("hidden");
};
$("#signup-tab").onclick=()=>{
  $("#signup-tab").classList.add("active"); $("#login-tab").classList.remove("active");
  $("#signup-form").classList.remove("hidden"); $("#login-form").classList.add("hidden");
};

$("#login-form").onsubmit=async e=>{
  e.preventDefault();
  const {error}=await sb.auth.signInWithPassword({
    email:$("#login-email").value.trim(),
    password:$("#login-password").value
  });
  if(error) return toast(error.message);
  profile=await loadProfile(); showApp();
};

$("#signup-form").onsubmit=async e=>{
  e.preventDefault();
  const {data,error}=await sb.auth.signUp({
    email:$("#signup-email").value.trim(),
    password:$("#signup-password").value,
    options:{data:{full_name:$("#signup-name").value.trim()}}
  });
  if(error) return toast(error.message);
  if(data.session){ profile=await loadProfile(); showApp(); }
  else toast("Account created. Check your email if confirmation is enabled.");
};

$("#logout-btn").onclick=async()=>{
  await sb.auth.signOut(); profile=null; session=null; showAuth();
};
$("#refresh-btn").onclick=()=>route(document.querySelector(".nav-btn.active")?.dataset.page||"dashboard");

sb.auth.onAuthStateChange(async (_event,s)=>{
  session=s;
  if(s && !profile){ try{profile=await loadProfile(); await showApp()}catch(e){console.error(e)} }
  if(!s){profile=null;showAuth();}
});

const {data:{session:s}}=await sb.auth.getSession();
session=s;
if(session){
  try{profile=await loadProfile(); if(profile) showApp(); else showAuth();}catch(e){console.error(e);showAuth();}
}else showAuth();
