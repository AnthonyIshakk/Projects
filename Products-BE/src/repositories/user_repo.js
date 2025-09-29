import {pool} from "../models/db.js"; 

export async function findUserByEmail({email}) {
    const {rows} = await pool.query({
        text: `SELECT id, name, email, password_hash, merchant_id
               FROM users WHERE email = $1 LIMIT 1`,
        values: [email],
    });
    return rows[0] || null;
}

export async function createUser({name, email, passwordHash, merchantId }){
    const {rows} = await pool.query({
        text: `INSERT INTO users(name, email, password_hash, merchant_id)
              VALUES ($1, $2, $3, $4)
              RETURNING id, name, email, merchant_id`,
        values: [name, email, passwordHash, merchantId],      
    })
    return rows[0]; 
}

export async function findUserById({ id }) {
  const { rows } = await pool.query({
    text: `SELECT id, name, email, merchant_id
           FROM users WHERE id = $1`,
    values : [id]
  });
  return rows[0] || null; 
}
