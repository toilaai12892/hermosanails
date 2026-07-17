
document.addEventListener("DOMContentLoaded",()=>{
  let auth={code:"",name:""},booking=null;
  const $=s=>document.querySelector(s),esc=(s="")=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
  const allServices=()=>Object.entries(HERMOSA_MENU).flatMap(([category,items])=>items.map(x=>({...x,category})));

  $("#lookupCode").oninput=e=>e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);
  $("#lookupBtn").onclick=async e=>{
    const btn=e.currentTarget,code=$("#lookupCode").value.trim(),name=$("#lookupName").value.trim();$("#lookupError").textContent="";
    if(code.length!==6||!name)return $("#lookupError").textContent="Enter a valid booking code and name.";
    btn.disabled=true;btn.textContent="Verifying...";
    try{const r=await fetch(`/api/bookings/get?code=${encodeURIComponent(code)}&name=${encodeURIComponent(name)}`),d=await r.json();if(!r.ok)throw new Error(d.error);auth={code,name};booking=d.booking;$("#lookupCard").classList.add("hidden");$("#manageEditor").classList.remove("hidden");$("#manageCode").textContent=`Booking ${booking.code}`;render();}
    catch(err){$("#lookupError").textContent=err.message||"Appointment not found."}finally{btn.disabled=false;btn.textContent="Confirm & View Appointment →";}
  };

  function render(){
    const services=allServices();
    $("#manageForm").innerHTML=`
      <section class="manage-section"><small>Contact</small><h3>Representative</h3><div class="field-grid"><label class="field"><span>Name</span><input id="editName" value="${esc(booking.name)}"></label><label class="field"><span>Phone</span><input id="editPhone" value="${esc(booking.phone)}"></label></div></section>
      <section class="manage-section"><small>Schedule</small><h3>Date & Time</h3><div class="field-grid"><label class="field"><span>Date</span><input id="editDate" type="date" min="${today()}" value="${esc(booking.date)}"></label><label class="field"><span>Time</span><select id="editTime">${HERMOSA_TIMES.map(t=>`<option ${t===booking.time?"selected":""}>${t}</option>`).join("")}</select></label></div></section>
      <section class="manage-section"><small>Guests</small><h3>Services & Staff</h3><div class="manage-guests">${booking.guests.map((g,i)=>`
        <article class="manage-guest" data-i="${i}"><div class="field-grid"><label class="field"><span>Guest Name</span><input class="guest-name" value="${esc(g.label)}"></label><label class="field"><span>Staff</span><select class="guest-staff">${HERMOSA_STAFF.map(s=>`<option ${s.name===g.staff?"selected":""}>${esc(s.name)}</option>`).join("")}</select></label></div>
        <div class="check-grid">${services.map(s=>`<label><input type="checkbox" data-name="${esc(s.name)}" data-price="${esc(s.price)}" data-category="${esc(s.category)}" ${g.services.some(x=>x.name===s.name)?"checked":""}><span><b>${esc(s.name)}</b><small>${esc(s.price)}</small></span></label>`).join("")}</div></article>`).join("")}</div></section>`;
  }

  $("#saveChanges").onclick=async e=>{
    const btn=e.currentTarget;$("#saveError").textContent="";
    const updates={name:$("#editName").value.trim(),phone:$("#editPhone").value.trim(),date:$("#editDate").value,time:$("#editTime").value,guests:[...document.querySelectorAll(".manage-guest")].map(card=>({label:card.querySelector(".guest-name").value.trim(),staff:card.querySelector(".guest-staff").value,services:[...card.querySelectorAll('input[type="checkbox"]:checked')].map(x=>({name:x.dataset.name,price:x.dataset.price,category:x.dataset.category}))}))};
    if(!updates.name||updates.phone.replace(/\D/g,"").length<7||updates.date<today()||updates.guests.some(g=>!g.label||!g.staff||!g.services.length))return $("#saveError").textContent="Complete all fields and keep at least one service for each guest.";
    btn.disabled=true;btn.textContent="Saving...";
    try{const r=await fetch("/api/bookings/update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:auth.code,bookingName:auth.name,updates})}),d=await r.json();if(!r.ok)throw new Error(d.error);booking=d.booking;auth.name=booking.name;render();$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),3000);}
    catch(err){$("#saveError").textContent=err.message||"Unable to update."}finally{btn.disabled=false;btn.textContent="Save Appointment Changes →";}
  };
  $("#signOut").onclick=()=>location.reload();
});
