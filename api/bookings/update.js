
import {sql,ensure,cleanName,validCode,response} from "../_db.js";import {sendDiscord,diffs,guestFields} from "../_discord.js";
export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed."});
 try{
  const {code:raw,bookingName:auth,updates}=req.body||{},code=String(raw||"").toUpperCase(),authName=cleanName(auth);
  if(!validCode(code)||!authName||!updates)return res.status(400).json({error:"Invalid update request."});
  const n={name:cleanName(updates.name),phone:String(updates.phone||"").trim().slice(0,30),date:String(updates.date||""),time:String(updates.time||""),guests:updates.guests};
  if(!n.name||n.phone.replace(/\D/g,"").length<7||!n.date||!n.time||!Array.isArray(n.guests)||n.guests.some(g=>!g.label||!g.staff||!g.services?.length))return res.status(400).json({error:"Invalid appointment changes."});
  const staff=n.guests.map(g=>g.staff).filter(x=>x!=="Any available staff");if(new Set(staff).size!==staff.length)return res.status(409).json({error:"The same staff member cannot serve two guests at the same time."});
  const db=sql();await ensure(db);const oldRows=await db`SELECT * FROM bookings WHERE code=${code} AND LOWER(booking_name)=LOWER(${authName}) LIMIT 1`;if(!oldRows.length)return res.status(404).json({error:"Booking verification failed."});const old=oldRows[0],changes=diffs(old,n);if(!changes.length)return res.status(200).json({booking:response(old),changed:false});
  if(staff.length){const conflicts=await db`SELECT staff FROM booking_slots WHERE appointment_date=${n.date} AND appointment_time=${n.time} AND active=TRUE AND booking_code<>${code} AND staff=ANY(${staff})`;if(conflicts.length)return res.status(409).json({error:`${conflicts.map(x=>x.staff).join(", ")} is unavailable at that time.`})}
  await db`UPDATE booking_slots SET active=FALSE WHERE booking_code=${code}`;
  try{for(const s of staff)await db`INSERT INTO booking_slots(booking_code,appointment_date,appointment_time,staff) VALUES(${code},${n.date},${n.time},${s})`}catch(e){await db`UPDATE booking_slots SET active=TRUE WHERE booking_code=${code}`;throw Object.assign(new Error("That appointment time was just taken."),{status:409})}
  const rows=await db`UPDATE bookings SET booking_name=${n.name},phone=${n.phone},appointment_date=${n.date},appointment_time=${n.time},guests=${JSON.stringify(n.guests)}::jsonb,updated_at=NOW() WHERE id=${old.id} RETURNING *`;
  await sendDiscord({username:"Hermosa Booking Manager",embeds:[{title:"📝 Appointment Changed",color:16763904,description:`**Booking:** \`${code}\`\n**Customer:** ${old.booking_name}\n\n${changes.join("\n\n")}`,fields:guestFields(n.guests),footer:{text:"Hermosa Nails Appointment Manage"},timestamp:new Date().toISOString()}]});
  return res.status(200).json({booking:response(rows[0]),changed:true});
 }catch(e){console.error(e);return res.status(e.status||500).json({error:e.message||"Unable to update booking."})}
}
