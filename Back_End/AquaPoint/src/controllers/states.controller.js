import { pool } from "../db.js";

// GET /locals
export async function getAllStates(req, res) {
  try {
    const [rows] = await returnAllStates();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /locals/{id}
export async function getStateById(req, res) {
  const id = Number(req.params.id);

  try {
    const trustLevel = await findStateById(id);
    if(!local) return res.status(404).json({ error: `State with ID: ${id} not found`});

    res.json(trustLevel);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

async function returnAllStates(){
  return await pool.query(`
      SELECT 
        *
      FROM states
    `);
}

async function findStateById(id){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM states
      WHERE id = ?
      `, [id]      
  );

  return rows[0];
}