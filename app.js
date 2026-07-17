
document.addEventListener("DOMContentLoaded", () => {
  const state = {
    name: "", phone: "", guestCount: 1,
    guests: [{ label: "Guest 1", services: [], staff: "" }],
    date: "", time: ""
  };

  let currentStep = 0;
  let activeGuest = 0;
  let calendarCursor = new Date();
  calendarCursor.setDate(1);
  let blockedByStaff = {};

  const stepMeta = [
    ["Step 1 of 5", "Who is booking?"],
    ["Step 2 of 5", "How many guests?"],
    ["Step 3 of 5", "Choose services & staff"],
    ["Step 4 of 5", "Select date & time"],
    ["Step 5 of 5", "Review your appointment"]
  ];

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = (s="") => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const todayISO = iso(new Date());
  const prettyDate = v => v ? new Intl.DateTimeFormat("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(new Date(`${v}T12:00:00`)) : "Not selected";

  function ensureGuests(n) {
    const old = state.guests;
    state.guests = Array.from({length:n},(_,i)=>old[i]||{label:`Guest ${i+1}`,services:[],staff:""});
    state.guestCount=n; activeGuest=Math.min(activeGuest,n-1);
  }

  function renderGuestCounts() {
    const box=$("#guestCounts"); box.innerHTML="";
    for(let i=1;i<=7;i++){
      const b=document.createElement("button");
      b.type="button"; b.className=`count-card ${state.guestCount===i?"selected":""}`;
      b.innerHTML=`<strong>${i}</strong><span>${i===1?"Guest":"Guests"}</span>`;
      b.onclick=()=>{ensureGuests(i);renderGuestCounts();renderGuestEditor();validate();};
      box.appendChild(b);
    }
  }

  function renderGuestEditor() {
    const tabs=$("#guestTabs"); tabs.innerHTML="";
    state.guests.forEach((g,i)=>{
      const b=document.createElement("button");
      b.type="button"; b.className=i===activeGuest?"active":"";
      b.textContent=`Guest ${i+1}${g.services.length?` · ${g.services.length}`:""}`;
      b.onclick=()=>{activeGuest=i;renderGuestEditor();};
      tabs.appendChild(b);
    });

    const g=state.guests[activeGuest];
    $("#guestEditor").innerHTML=`
      <div class="guest-name-row">
        <label class="field"><span>Guest Display Name</span><input id="guestLabel" value="${esc(g.label)}"></label>
        <div class="selection-counter"><small>Selected services</small><strong>${g.services.length}</strong></div>
      </div>
      <div class="editor-block"><h4>Preferred Staff *</h4><div id="staffGrid" class="staff-grid"></div></div>
      <div class="editor-block">
        <div class="service-toolbar"><h4>Services * <small>Select as many as needed</small></h4><input id="serviceSearch" placeholder="Search services..."></div>
        <div id="serviceMenu"></div>
      </div>`;
    $("#guestLabel").oninput=e=>{g.label=e.target.value||`Guest ${activeGuest+1}`};
    renderStaff(g); renderServices(g);
    $("#serviceSearch").oninput=e=>renderServices(g,e.target.value);
  }

  function renderStaff(g) {
  const box = $("#staffGrid");
  box.innerHTML = "";

  window.HERMOSA_STAFF.forEach(s => {
    const b = document.createElement("button");

    b.type = "button";
    b.className = `staff-card ${g.staff === s.name ? "selected" : ""}`;

    const avatarContent = s.avatar
      ? `
        <img
          src="${esc(s.avatar)}"
          alt="${esc(s.name)}"
          loading="lazy"
          onerror="
            this.style.display='none';
            this.nextElementSibling.style.display='grid';
          "
        >
        <span class="staff-avatar-fallback">
          ${esc(s.initials || "✦")}
        </span>
      `
      : `
        <span class="staff-avatar-fallback">
          ${esc(s.initials || "✦")}
        </span>
      `;

    b.innerHTML = `
      <span class="staff-avatar">
        ${avatarContent}
      </span>

      <span class="staff-copy">
        <strong>${esc(s.name)}</strong>
        <small>${esc(s.description)}</small>
        <em>
          ${
            s.rating === "Flexible"
              ? "Flexible"
              : `★★★★★ ${esc(s.rating)}`
          }
        </em>
      </span>

      <i>✓</i>
    `;

    b.onclick = () => {
      g.staff = s.name;
      renderGuestEditor();
      validate();
    };

    box.appendChild(b);
  });
}

  function renderServices(g,search="") {
    const box=$("#serviceMenu"); box.innerHTML="";
    const q=search.trim().toLowerCase();
    Object.entries(window.HERMOSA_MENU).forEach(([category,items])=>{
      const filtered=items.filter(x=>x.name.toLowerCase().includes(q));
      if(!filtered.length)return;
      const wrap=document.createElement("div"); wrap.className="service-category open";
      wrap.innerHTML=`<button class="category-head" type="button"><strong>${category}</strong><span>⌄</span></button><div class="service-grid"></div>`;
      wrap.querySelector(".category-head").onclick=()=>wrap.classList.toggle("open");
      const grid=wrap.querySelector(".service-grid");
      filtered.forEach(item=>{
        const selected=g.services.some(x=>x.name===item.name);
        const b=document.createElement("button");
        b.type="button"; b.className=`service-card ${selected?"selected":""}`;
        b.innerHTML=`<div class="service-art">${item.icon||"✦"}</div><div><strong>${item.name}</strong><small>${category}</small></div><span>${item.price}</span><i>${selected?"✓":"+"}</i>`;
        b.onclick=()=>{
          const idx=g.services.findIndex(x=>x.name===item.name);
          if(idx>=0)g.services.splice(idx,1);else g.services.push({...item,category});
          renderGuestEditor();validate();
        };
        grid.appendChild(b);
      });
      box.appendChild(wrap);
    });
  }

  function requiredStaff() {
    return [...new Set(state.guests.map(g=>g.staff).filter(x=>x && x!=="Any available staff"))];
  }

  async function loadAvailability(date) {
    blockedByStaff={};
    $("#availabilityNote").textContent="Checking live availability...";
    try{
      const res=await fetch(`/api/availability/day?date=${encodeURIComponent(date)}`);
      const data=await res.json();
      if(res.ok)blockedByStaff=data.blocked||{};
      $("#availabilityNote").textContent="Unavailable times are disabled automatically.";
    }catch{
      $("#availabilityNote").textContent="Availability could not be refreshed. Please try again.";
    }
    renderTimes();
  }

  function timeBlocked(time) {
    const staff=requiredStaff();
    return staff.some(name=>(blockedByStaff[name]||[]).includes(time));
  }

  function renderTimes() {
    const morning=$("#morningTimes"), afternoon=$("#afternoonTimes");
    morning.innerHTML=""; afternoon.innerHTML="";
    window.HERMOSA_TIMES.forEach(t=>{
      const b=document.createElement("button");
      b.type="button"; b.className=`time-btn ${state.time===t?"selected":""}`;
      b.textContent=timeBlocked(t)?`${t} · Unavailable`:t;
      b.disabled=!state.date||timeBlocked(t);
      b.onclick=()=>{state.time=t;renderTimes();updateSchedule();validate();};
      (t.includes("AM")?morning:afternoon).appendChild(b);
    });
  }

  function renderCalendar() {
    const y=calendarCursor.getFullYear(),m=calendarCursor.getMonth();
    $("#calendarMonth").textContent=new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric"}).format(calendarCursor);
    const first=new Date(y,m,1), last=new Date(y,m+1,0);
    const grid=$("#calendarGrid");grid.innerHTML="";
    for(let i=0;i<first.getDay();i++)grid.appendChild(document.createElement("span"));
    for(let day=1;day<=last.getDate();day++){
      const d=new Date(y,m,day), value=iso(d);
      const b=document.createElement("button");b.type="button";b.textContent=day;
      b.className=value===state.date?"selected":"";
      b.disabled=value<todayISO;
      b.onclick=async()=>{
        state.date=value;state.time="";
        renderCalendar();updateSchedule();$("#timeArea").classList.remove("hidden");
        await loadAvailability(value);validate();
      };
      grid.appendChild(b);
    }
    const now=new Date();
    $("#prevMonth").disabled=y===now.getFullYear()&&m===now.getMonth();
  }

  function updateSchedule(){
    $("#selectedSchedule").textContent=state.date?`${prettyDate(state.date)}${state.time?` at ${state.time}`:""}`:"Choose a date";
  }

  function stepValid(step=currentStep){
    if(step===0)return state.name.trim().length>=2&&state.phone.replace(/\D/g,"").length>=7;
    if(step===1)return state.guestCount>=1;
    if(step===2)return state.guests.every(g=>g.staff&&g.services.length);
    if(step===3)return state.date>=todayISO&&Boolean(state.time);
    return true;
  }

  function validate(){
    const ok=stepValid();$("#nextBtn").disabled=!ok;
    const text=[
      ok?"Contact information complete.":"Enter your name and phone number.",
      `${state.guestCount} guest${state.guestCount>1?"s":""} selected.`,
      ok?"Every guest is ready.":"Each guest needs staff and at least one service.",
      ok?"Schedule selected.":"Choose an available date and time.",
      "Review before confirming."
    ];
    $("#footerHint").textContent=text[currentStep];
  }

  function go(step){
    for(let i=0;i<step;i++)if(!stepValid(i))return;
    currentStep=step;
    $$("[data-form-step]").forEach((el,i)=>el.classList.toggle("active",i===step));
    $$(".booking-steps button").forEach((el,i)=>el.classList.toggle("active",i===step));
    $("#stepLabel").textContent=stepMeta[step][0];$("#stepTitle").textContent=stepMeta[step][1];
    $("#progressFill").style.width=`${(step+1)*20}%`;
    $("#backBtn").disabled=step===0;$("#nextBtn").style.display=step===4?"none":"";
    if(step===2)renderGuestEditor();if(step===4)renderReview();
    validate();$(".booking-panel").scrollIntoView({behavior:"smooth",block:"start"});
  }

  function renderReview(){
    $("#reviewContact").innerHTML=`
      <div><small>Booking Name</small><strong>${esc(state.name)}</strong></div>
      <div><small>Phone</small><strong>${esc(state.phone)}</strong></div>
      <div><small>Date</small><strong>${prettyDate(state.date)}</strong></div>
      <div><small>Time</small><strong>${esc(state.time)}</strong></div>`;
    $("#reviewGuests").innerHTML=state.guests.map((g,i)=>`
      <article><header><small>Guest ${i+1}</small><strong>${esc(g.label)}</strong></header>
      <p><b>Staff:</b> ${esc(g.staff)}</p>
      <ul>${g.services.map(s=>`<li><span>${esc(s.name)}</span><strong>${esc(s.price)}</strong></li>`).join("")}</ul></article>`).join("");
  }

  $("#customerName").oninput=e=>{state.name=e.target.value;validate();};
  $("#customerPhone").oninput=e=>{state.phone=e.target.value;validate();};
  $("#backBtn").onclick=()=>go(currentStep-1);
  $("#nextBtn").onclick=()=>go(currentStep+1);
  $$(".booking-steps button").forEach(b=>b.onclick=()=>go(Number(b.dataset.step)));
  $("#prevMonth").onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar();};
  $("#nextMonth").onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar();};

  $("#confirmBooking").onclick=async e=>{
    const btn=e.currentTarget;btn.disabled=true;btn.textContent="Submitting...";
    try{
      const res=await fetch("/api/bookings/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(state)});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Unable to create booking.");
      $("#bookingCode").textContent=data.code;$("#successModal").classList.add("show");document.body.style.overflow="hidden";
      launchConfetti();
    }catch(err){alert(err.message)}finally{btn.disabled=false;btn.innerHTML='Confirm Appointment <span>→</span>'}
  };

  $("#copyCode").onclick=async()=>{await navigator.clipboard.writeText($("#bookingCode").textContent);$("#copyCode").textContent="Copied!";};

  function launchConfetti(){
    for(let i=0;i<55;i++){
      const c=document.createElement("i");c.className="confetti";c.style.left=`${Math.random()*100}%`;c.style.animationDelay=`${Math.random()*.5}s`;c.style.transform=`rotate(${Math.random()*360}deg)`;
      document.body.appendChild(c);setTimeout(()=>c.remove(),3500);
    }
  }

  ensureGuests(1);renderGuestCounts();renderGuestEditor();renderCalendar();renderTimes();go(0);
});
