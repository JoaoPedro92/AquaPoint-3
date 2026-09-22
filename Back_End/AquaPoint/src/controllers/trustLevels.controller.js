import { pool } from "../db.js";

// GET /locals
export async function getAllTrustLevels(req, res) {
  try {
    const [rows] = await returnAllTrustLevels();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /locals/{id}
export async function getTrustLevelById(req, res) {
  const id = Number(req.params.id);

  try {
    const trustLevel = await findTrustLevelById(id);
    if(!local) return res.status(404).json({ error: `Trust Level with ID: ${id} not found`});

    res.json(trustLevel);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

async function returnAllTrustLevels(){
  return await pool.query(`
      SELECT 
        *
      FROM trustlevels
    `);
}

async function findTrustLevelById(id){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM trustlevels
      WHERE id = ?
      `, [id]      
  );

  return rows[0];
}