import {sql,init,clean,validCode,shape} from "../_db.js";
export default async function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  try{
    const code=String(req.query.code||"").toUpperCase(),name=clean(req.query.name);
    if(!validCode(code)||!name) return res.status(400).json({error:"Enter a valid code and booking name."});
    const db=sql();await init(db);
    const rows=await db`SELECT * FROM bookings WHERE code=${code} AND LOWER(booking_name)=LOWER(${name}) LIMIT 1`;
    if(!rows.length)return res.status(404).json({error:"Booking code and name do not match."});
    return res.status(200).json({booking:shape(rows[0])});
  }catch(e){console.error(e);return res.status(500).json({error:"Unable to retrieve booking."});}
}
