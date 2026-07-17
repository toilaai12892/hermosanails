
import {signToken} from "../_auth.js";
export default async function handler(req,res){if(req.method!=="POST")return res.status(405).json({error:"Method not allowed."});const password=String(req.body?.password||"");if(!process.env.ADMIN_PASSWORD)return res.status(500).json({error:"ADMIN_PASSWORD is not configured."});if(password!==process.env.ADMIN_PASSWORD)return res.status(401).json({error:"Incorrect password."});return res.status(200).json({token:signToken()})}
