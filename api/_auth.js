
import crypto from "crypto";
const secret=()=>process.env.ADMIN_SECRET||process.env.ADMIN_PASSWORD||"";
export function signToken(){const exp=Date.now()+1000*60*60*12;const body=Buffer.from(JSON.stringify({exp})).toString("base64url");const sig=crypto.createHmac("sha256",secret()).update(body).digest("base64url");return `${body}.${sig}`}
export function verifyToken(req){try{const token=String(req.headers.authorization||"").replace(/^Bearer\s+/,""),[body,sig]=token.split(".");if(!body||!sig)return false;const expected=crypto.createHmac("sha256",secret()).update(body).digest("base64url");if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;return JSON.parse(Buffer.from(body,"base64url").toString()).exp>Date.now()}catch{return false}}
