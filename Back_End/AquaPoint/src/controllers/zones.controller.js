import { pool } from "../db.js";


// GET /zones
export async function getAllZones(req, res) {
  try {
    const [rows] = await returnAllZones();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /zones/{id}
export async function getZoneById(req, res) {
  const id = Number(req.params.id);

  try {
    const zone = await findZoneById(id);
    if(!zone) return res.status(404).json({ error: `Zone with ID: ${id} not found`});

    res.json(zone);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

// GET /zones/name/{name}
export async function getZoneByName(req, res) {
  const name = req.params.name;

  try {
    const zone = await findZoneByName(name);
    if(!zone) return res.status(200).json({ error: `Zone with name: ${name} not found`}); // envia codigo 200 ao inves de 404 para nao criar logs de erro na consola ( visto que o 404 é meio que proposital e esperado pelo backend no uso desta função )

    res.json(zone);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

// POST /zones
export async function addNewZone(req, res){
  const { name } = req.body;

  if(!name){
    return res.status(400).json({ error: 'All fields are required' })
  }

  try{
    const[result] = await pool.query(
      'INSERT INTO zone (zone_name) VALUES(?)',
      [name]
    )

    res.status(201).json({
      message: 'Zone created successfully',
      id: result.insertId
    })
  }
  catch(err){
    return res.status(500).json({ error: err.message })
  }
}

async function returnAllZones(){
  return await pool.query(`
      SELECT 
        *
      FROM zone
    `);
}

async function findZoneById(id){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM zone
      WHERE id = ?
      `, [id]      
  );

  return rows[0];
}

async function findZoneByName(name){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM zone
      WHERE zone_name = ?
      `, [name]      
  );

  return rows[0];
}
