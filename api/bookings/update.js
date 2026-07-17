import {sql,init,clean,validCode,shape} from "../_db.js";
import {notify,changes,guestFields} from "../_discord.js";
export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  try{
    const {code:raw,bookingName,updates}=req.body||{};const code=String(raw||"").toUpperCase(),auth=clean(bookingName);
    if(!validCode(code)||!auth||!updates)return res.status(400).json({error:"Invalid update request."});
    const next={name:clean(updates.name),phone:String(updates.phone||"").trim().slice(0,30),date:String(updates.date||""),time:String(updates.time||""),guests:updates.guests};
    if(!next.name||next.phone.replace(/\D/g,"").length<7||!next.date||!next.time||!Array.isArray(next.guests)||next.guests.some(g=>!g.label||!g.staff||!g.services?.length))return res.status(400).json({error:"Complete every field and keep one service per guest."});
    const db=sql();await init(db);
    const oldRows=await db`SELECT * FROM bookings WHERE code=${code} AND LOWER(booking_name)=LOWER(${auth}) LIMIT 1`;
    if(!oldRows.length)return res.status(404).json({error:"Booking verification failed."});
    const old=oldRows[0],diff=changes(old,next);
    if(!diff.length)return res.status(200).json({booking:shape(old),changed:false});
    const rows=await db`UPDATE bookings SET booking_name=${next.name},phone=${next.phone},appointment_date=${next.date},appointment_time=${next.time},guests=${JSON.stringify(next.guests)}::jsonb,updated_at=NOW() WHERE id=${old.id} RETURNING *`;
    await notify({title:"📝 Appointment Changed",color:16763904,description:`**Booking:** \`${code}\`\n**Customer:** ${old.booking_name}\n\n${diff.join("\n\n")}`,fields:guestFields(next.guests),footer:{text:"Hermosa Nails Appointment Manage"},timestamp:new Date().toISOString()});
    return res.status(200).json({booking:shape(rows[0]),changed:true});
  }catch(e){console.error(e);return res.status(500).json({error:"Unable to update booking."});}
}
