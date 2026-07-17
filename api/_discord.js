export async function notify(embed){
  const url=process.env.DISCORD_WEBHOOK_URL;
  if(!url) throw new Error("DISCORD_WEBHOOK_URL is missing");
  const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:"Hermosa Booking",embeds:[embed]})});
  if(!r.ok) throw new Error(`Discord ${r.status}`);
}
export const guestFields = guests => guests.map((g,i)=>({name:`Guest ${i+1}: ${g.label}`,value:`**Staff:** ${g.staff}\n**Services:**\n${g.services.map(s=>`• ${s.name} — ${s.price}`).join("\n")}`,inline:false}));
export function changes(old,next){
  const out=[];
  if(old.booking_name!==next.name) out.push(`**Booking name:** ${old.booking_name} → ${next.name}`);
  if(old.phone!==next.phone) out.push(`**Phone:** ${old.phone} → ${next.phone}`);
  const oldDate=String(old.appointment_date).slice(0,10);
  if(oldDate!==next.date) out.push(`**Date:** ${oldDate} → ${next.date}`);
  if(old.appointment_time!==next.time) out.push(`**Time:** ${old.appointment_time} → ${next.time}`);
  next.guests.forEach((g,i)=>{
    const before=old.guests[i];
    if(!before){out.push(`**Guest ${i+1}:** Added`);return;}
    if(before.label!==g.label) out.push(`**Guest ${i+1} name:** ${before.label} → ${g.label}`);
    if(before.staff!==g.staff) out.push(`**${g.label} staff:** ${before.staff} → ${g.staff}`);
    const a=before.services.map(s=>`${s.name} (${s.price})`).join(", ");
    const b=g.services.map(s=>`${s.name} (${s.price})`).join(", ");
    if(a!==b) out.push(`**${g.label} services:**\nBefore: ${a}\nAfter: ${b}`);
  });
  return out;
}
