import { pool } from "../db.js";

// GET /reports
export async function getAllReports(req, res) {
  try {
    const [rows] = await returnAllReports();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /reports/{id}
export async function getReportById(req, res) {
  const id = Number(req.params.id);

  try {
    const reports = await findReportById(id);
    if(!reports) return res.status(404).json({ error: `Report with ID: ${id} not found`});

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

// GET /reports/user/{id}
export async function getReportsByUserId(req, res) {
  const id = Number(req.params.id);

  try {
    const reports = await findReportsByUserId(id);
    if(!reports) return res.status(404).json({ error: `No Reports found for User with ID: ${id} not found`});

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

// GET /reports/aquapoint/{id}
export async function getReportByPointId(req, res) {
  const id = Number(req.params.id);

  try {
    const reports = await findReportsByAquapointId(id);
    if(!reports) return res.status(404).json({ error: `No Reports found for Aquapoint with ID: ${id} not found`});

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

// POST /reports
export async function createReport(req, res){
  const { user_id, comment, point_id, image } = req.body;

  if(!user_id || !comment || !point_id || !image){
    return res.status(400).json({ error: 'All fields are required' })
  }

  let reportPictureBlob = null

  if (typeof image === 'string' && image.startsWith('data:image/')) {
    reportPictureBlob = Buffer.from(image.split(',')[1], 'base64')
  }

  try{
    const[result] = await pool.query(
      'INSERT INTO reports (user_id, comment, point_id, image, createdAt) VALUES(?, ?, ?, ?, now())',
      [user_id, comment, point_id, reportPictureBlob]
    )

    res.status(201).json({ message: 'Report created successfully' })
  }
  catch(err){
    return res.status(500).json({ error: err.message })
  }
}

// DELETE /reports/{id}
export async function deleteReport(req, res){

  try{
    const id = Number(req.params.id)
    const report = await findReportById(id)
    if(!report) return res.status(404).json({ error: `Report not found with id ${id}`})
    
    await pool.query('DELETE FROM reports WHERE id = ?', report.id)

    res.json({ message: `Report '${report.id}' was deleted successfully` })
  }
  catch(err){
    res.status(500).json({ error: err.message })
  }
}

async function returnAllReports(){
  return await pool.query(`
      SELECT 
        *
      FROM reports
    `);
}

async function findReportById(id){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM reports
      WHERE id = ?
      `, [id]      
  );

  return rows[0];
}

async function findReportsByUserId(id){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM reports
      WHERE user_id = ?
      `, [id]      
  );

  return rows[0];
}

async function findReportsByAquapointId(id){
  const [rows] = await pool.query(`
      SELECT 
        *
      FROM reports
      WHERE point_id = ?
      `, [id]      
  );

  return rows[0];
}