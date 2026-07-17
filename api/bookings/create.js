
import {sql,ensure,cleanName,makeCode} from "../_db.js";import {sendDiscord,guestFields} from "../_discord.js";
export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed."});
 try{
  const {name,phone,guests,date,time}=req.body||{},bookingName=cleanName(name),cleanPhone=String(phone||"").trim().slice(0,30);
  if(!bookingName||cleanPhone.replace(/\D/g,"").length<7||!date||!time||!Array.isArray(guests)||guests.length<1||guests.length>7||guests.some(g=>!g.label||!g.staff||!g.services?.length))return res.status(400).json({error:"Invalid booking information."});
  const db=sql();await ensure(db);
  const staff=guests.map(g=>g.staff).filter(x=>x!=="Any available staff");
  if(new Set(staff).size!==staff.length)return res.status(409).json({error:"The same staff member cannot serve two guests at the same time."});
  if(staff.length){const conflicts=await db`SELECT staff FROM booking_slots WHERE appointment_date=${date} AND appointment_time=${time} AND active=TRUE AND staff=ANY(${staff})`;if(conflicts.length)return res.status(409).json({error:`${conflicts.map(x=>x.staff).join(", ")} is no longer available at that time. Please choose another time or staff member.`})}
  let code,inserted=false;
  for(let i=0;i<8;i++){code=makeCode();try{await db`INSERT INTO bookings(code,booking_name,phone,appointment_date,appointment_time,guests) VALUES(${code},${bookingName},${cleanPhone},${date},${time},${JSON.stringify(guests)}::jsonb)`;inserted=true;break}catch(e){if(e.code!=="23505")throw e}}
  if(!inserted)throw new Error("Could not create booking code.");
  try{for(const s of staff)await db`INSERT INTO booking_slots(booking_code,appointment_date,appointment_time,staff) VALUES(${code},${date},${time},${s})`}catch(e){await db`DELETE FROM bookings WHERE code=${code}`;throw Object.assign(new Error("That appointment time was just taken. Please choose another time."),{status:409})}
  await sendDiscord({username:"Hermosa Booking",embeds:[{title:"✨ New Appointment Request",color:14265957,description:`**Booking Code:** \`${code}\`\n**Representative:** ${bookingName}\n**Phone:** ${cleanPhone}\n**Date:** ${date}\n**Time:** ${time}\n**Guests:** ${guests.length}`,fields:guestFields(guests),footer:{text:"Hermosa Nails Online Booking"},timestamp:new Date().toISOString()}]});
  return res.status(201).json({success:true,code});
 }catch(e){console.error(e);return res.status(e.status||500).json({error:e.message||"Unable to create booking."})}
}
