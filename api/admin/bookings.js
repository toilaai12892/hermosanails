
import {sql,ensure,response} from "../_db.js";import {verifyToken} from "../_auth.js";
const parsePrice=p=>{const m=String(p||"").match(/\d+/);return m?Number(m[0]):0};
export default async function handler(req,res){if(!verifyToken(req))return res.status(401).json({error:"Unauthorized."});try{const db=sql();await ensure(db);const date=String(req.query.date||""),status=String(req.query.status||"");let rows;if(date&&status)rows=await db`SELECT * FROM bookings WHERE appointment_date=${date} AND status=${status} ORDER BY appointment_time`;else if(date)rows=await db`SELECT * FROM bookings WHERE appointment_date=${date} ORDER BY appointment_time`;else if(status)rows=await db`SELECT * FROM bookings WHERE status=${status} ORDER BY appointment_date DESC,appointment_time`;else rows=await db`SELECT * FROM bookings ORDER BY appointment_date DESC,appointment_time LIMIT 200`;
 const today=new Date().toISOString().slice(0,10),todayRows=await db`SELECT * FROM bookings WHERE appointment_date=${today} AND status<>'cancelled'`;
 let guests=0,revenue=0;const serviceCount={},staffCount={};for(const b of todayRows){guests+=b.guests.length;for(const g of b.guests){staffCount[g.staff]=(staffCount[g.staff]||0)+1;for(const s of g.services){serviceCount[s.name]=(serviceCount[s.name]||0)+1;revenue+=parsePrice(s.price)}}}
 const top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";
 return res.status(200).json({bookings:rows.map(response),analytics:{todayAppointments:todayRows.length,todayGuests:guests,todayRevenue:revenue,topService:top(serviceCount),topStaff:top(staffCount)}})
 }catch(e){console.error(e);return res.status(500).json({error:"Unable to load dashboard."})}}
