
document.addEventListener("DOMContentLoaded",()=>{
  const $=s=>document.querySelector(s);let token=sessionStorage.getItem("hermosaAdminToken")||"";
  const money=v=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v||0);
  const headers=()=>({"Authorization":`Bearer ${token}`,"Content-Type":"application/json"});

  async function login(){
    $("#loginError").textContent="";const password=$("#adminPassword").value;
    try{const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})}),d=await r.json();if(!r.ok)throw new Error(d.error);token=d.token;sessionStorage.setItem("hermosaAdminToken",token);showDashboard();}
    catch(e){$("#loginError").textContent=e.message||"Login failed."}
  }

  async function showDashboard(){
    $("#adminLogin").classList.add("hidden");$("#dashboard").classList.remove("hidden");$("#logoutBtn").classList.remove("hidden");await load();
  }

  async function load(){
    const date=$("#filterDate")?.value||"",status=$("#filterStatus")?.value||"";
    const r=await fetch(`/api/admin/bookings?date=${encodeURIComponent(date)}&status=${encodeURIComponent(status)}`,{headers:headers()});
    if(r.status===401)return logout();
    const d=await r.json();renderAnalytics(d.analytics);renderBookings(d.bookings||[]);
  }

  function renderAnalytics(a){
    $("#analytics").innerHTML=`
      <article><small>Today’s Appointments</small><strong>${a.todayAppointments||0}</strong></article>
      <article><small>Today’s Guests</small><strong>${a.todayGuests||0}</strong></article>
      <article><small>Estimated Revenue</small><strong>${money(a.todayRevenue)}</strong></article>
      <article><small>Most Booked</small><strong>${a.topService||"—"}</strong></article>
      <article><small>Most Requested Staff</small><strong>${a.topStaff||"—"}</strong></article>`;
  }

  function renderBookings(rows){
    if(!rows.length)return $("#bookingTable").innerHTML='<div class="empty-state">No appointments found.</div>';
    $("#bookingTable").innerHTML=rows.map(b=>`
      <article class="admin-booking">
        <header><div><small>${b.date} · ${b.time}</small><h3>${b.name}</h3><p>${b.phone} · Code ${b.code}</p></div><select data-code="${b.code}" class="status-select"><option ${b.status==="pending"?"selected":""}>pending</option><option ${b.status==="confirmed"?"selected":""}>confirmed</option><option ${b.status==="completed"?"selected":""}>completed</option><option ${b.status==="cancelled"?"selected":""}>cancelled</option></select></header>
        <div class="admin-guests">${b.guests.map((g,i)=>`<div><strong>Guest ${i+1}: ${g.label}</strong><span>${g.staff}</span><small>${g.services.map(s=>s.name).join(" · ")}</small></div>`).join("")}</div>
      </article>`).join("");
    document.querySelectorAll(".status-select").forEach(s=>s.onchange=async()=>{
      const r=await fetch("/api/admin/status",{method:"POST",headers:headers(),body:JSON.stringify({code:s.dataset.code,status:s.value})}),d=await r.json();if(!r.ok)return alert(d.error||"Update failed");$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),2000);load();
    });
  }

  function logout(){token="";sessionStorage.removeItem("hermosaAdminToken");location.reload();}
  $("#loginBtn").onclick=login;$("#adminPassword").onkeydown=e=>{if(e.key==="Enter")login()};$("#logoutBtn").onclick=logout;$("#refreshBtn").onclick=load;$("#filterDate").onchange=load;$("#filterStatus").onchange=load;
  if(token)showDashboard();
});
