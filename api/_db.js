import { neon } from "@neondatabase/serverless";
export const sql = () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
  return neon(process.env.DATABASE_URL);
};
export async function init(db){
  await db`CREATE TABLE IF NOT EXISTS bookings(
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(6) UNIQUE NOT NULL,
    booking_name VARCHAR(80) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    guests JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}
export const clean = v => String(v||"").trim().replace(/\s+/g," ").slice(0,80);
export const validCode = v => /^[A-Z0-9]{6}$/.test(String(v||"").toUpperCase());
export function makeCode(){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes=crypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map(x=>chars[x%chars.length]).join("");
}
export const shape = r => ({code:r.code,name:r.booking_name,phone:r.phone,date:String(r.appointment_date).slice(0,10),time:r.appointment_time,guests:r.guests,status:r.status});
