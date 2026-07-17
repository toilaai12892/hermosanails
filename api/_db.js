
import { neon } from "@neondatabase/serverless";
export function sql(){if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL missing");return neon(process.env.DATABASE_URL)}
export async function ensure(db){
  await db`CREATE TABLE IF NOT EXISTS bookings(
    id BIGSERIAL PRIMARY KEY, code VARCHAR(6) UNIQUE NOT NULL, booking_name VARCHAR(80) NOT NULL,
    phone VARCHAR(30) NOT NULL, appointment_date DATE NOT NULL, appointment_time VARCHAR(20) NOT NULL,
    guests JSONB NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await db`CREATE TABLE IF NOT EXISTS booking_slots(
    id BIGSERIAL PRIMARY KEY, booking_code VARCHAR(6) NOT NULL, appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL, staff VARCHAR(80) NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE)`;
  await db`CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_staff_slot ON booking_slots(appointment_date,appointment_time,staff) WHERE active=TRUE AND staff <> 'Any available staff'`;
}
export const cleanName=v=>String(v||"").trim().replace(/\s+/g," ").slice(0,80);
export const validCode=v=>/^[A-Z0-9]{6}$/.test(String(v||"").toUpperCase());
export function makeCode(){const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",a=crypto.getRandomValues(new Uint8Array(6));return [...a].map(x=>c[x%c.length]).join("")}
export const response=r=>({code:r.code,name:r.booking_name,phone:r.phone,date:String(r.appointment_date).slice(0,10),time:r.appointment_time,guests:r.guests,status:r.status,createdAt:r.created_at,updatedAt:r.updated_at});
