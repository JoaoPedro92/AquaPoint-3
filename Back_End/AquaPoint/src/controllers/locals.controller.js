import { pool } from "../db.js";

// GET /locals
export async function getAllLocals(req, res) {
  try {
    const [rows] = await returnAllLocals();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /locals/{id}
export async function getLocalById(req, res) {
  const id = Number(req.params.id);

  try {
    const local = await findLocalById(id);
    if(!local) return res.status(404).json({ error: `Local with ID: ${id} not found`});

    res.json(local);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

// GET /locals/name/{name}
export async function getLocalByName(req, res) {
  const name = req.params.name;

  try {
    const local = await findLocalByName(name);
    if(!local) return res.status(200).json({ error: `Local with name: ${name} not found`}); // envia codigo 200 ao inves de 404 para nao criar logs de erro na consola ( visto que o 404 é meio que proposital e esperado pelo backend no uso desta função )

    res.json(local);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

// POST /locals
export async function addNewLocal(req, res){
  const { name, zone_id } = req.body;

  if(!name || !zone_id){
    return res.status(400).json({ error: 'All fields are required' })
  }

  try{
    const[result] = await pool.query(
      'INSERT INTO local (local_name, zone_id) VALUES(?, ?)',
      [name, zone_id]
    )

    res.status(201).json({
      message: 'Local created successfully',
      id: result.insertId
    })
  }
  catch(err){
    return res.status(500).json({ error: err.message })
  }
}

async function returnAllLocals(){
  return await pool.query(`
      SELECT 
        *
      FROM local
      INNER JOIN zone ON local.zone_id = zone.id
    `);
}

async function findLocalById(id){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM local
      INNER JOIN zone ON local.zone_id = zone.id
      WHERE local.id = ?
      `, [id]      
  );

  return rows[0];
}

async function findLocalByName(name){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM local
      INNER JOIN zone ON local.zone_id = zone.id
      WHERE local_name = ?
      `, [name]      
  );

  return rows[0];
}
