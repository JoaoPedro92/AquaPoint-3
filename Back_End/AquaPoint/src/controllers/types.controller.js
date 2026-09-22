import { pool } from "../db.js";

// GET /types
export async function getAllTypes(req, res) {
  try {
    const [rows] = await returnAllTypes();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /types/{id}
export async function getTypeById(req, res) {
  const id = Number(req.params.id);

  try {
    const type = await findTypeById(id);
    if(!local) return res.status(404).json({ error: `Type with ID: ${id} not found`});

    res.json(type);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

async function returnAllTypes(){
  return await pool.query(`
      SELECT 
        *
      FROM type
    `);
}

async function findTypeById(id){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM type
      WHERE id = ?
      `, [id]      
  );

  return rows[0];
}