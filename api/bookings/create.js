import {sql,init,clean,makeCode} from "../_db.js";
import {notify,guestFields} from "../_discord.js";
export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  try{
    const {name,phone,date,time,guests}=req.body||{};
    const bookingName=clean(name), cleanPhone=String(phone||"").trim().slice(0,30);
    if(!bookingName||cleanPhone.replace(/\D/g,"").length<7||!date||!time||!Array.isArray(guests)||guests.length<1||guests.length>7||guests.some(g=>!g.label||!g.staff||!g.services?.length)) return res.status(400).json({error:"Please complete all booking details."});
    const db=sql(); await init(db);
    let code,rows;
    for(let i=0;i<8;i++){
      code=makeCode();
      try{rows=await db`INSERT INTO bookings(code,booking_name,phone,appointment_date,appointment_time,guests) VALUES(${code},${bookingName},${cleanPhone},${date},${time},${JSON.stringify(guests)}::jsonb) RETURNING code`;break}catch(e){if(e.code!=="23505")throw e;}
    }
    if(!rows?.length) throw new Error("Could not generate booking code");
    await notify({title:"✨ New Appointment Request",color:14265957,description:`**Booking Code:** \`${code}\`\n**Representative:** ${bookingName}\n**Phone:** ${cleanPhone}\n**Date:** ${date}\n**Time:** ${time}\n**Guests:** ${guests.length}`,fields:guestFields(guests),footer:{text:"Hermosa Nails Online Booking"},timestamp:new Date().toISOString()});
    return res.status(201).json({success:true,code});
  }catch(e){console.error(e);return res.status(500).json({error:"Unable to create booking. Check DATABASE_URL and Discord webhook."});}
}
