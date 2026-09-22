import { pool } from "../db.js";


// GET /favorites
export async function getAllFavorites(req, res) {
  try {
    const [rows] = await returnAllFavorites();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /favorites/{id}
export async function getFavoriteById(req, res){
    try{
        const id = Number(req.params.id)
        const findFavorite = await findFavoriteById(id);
        if(!findFavorite) return res.status(404).json({ error: `Favorite with ID: ${id} not found`});

        res.json(findFavorite[0]);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

// GET /favorites/user/{id}
export async function getFavoriteByUserId(req, res){
    try{
        const id = Number(req.params.id)
        const findFavorites = await findFavoritesByUserId(id);
        if(!findFavorites) return res.status(404).json({ error: `Favorite with User ID: ${id} not found`});

        res.json(findFavorites);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

// POST /favorites
export async function createFavorite(req, res){
    const { user_id, point_id } = req.body
    if(!user_id || !point_id) return res.status(400).json({ error: 'All fields are required' })
    
    try{
        const[result] = await pool.query(
            'INSERT INTO favorites (user_id, point_id) VALUES (?, ?)',
            [user_id, point_id]
        )

        res.status(201).json({ message: 'Favorite created successfully!', id: result.insertId})
    }
    catch(err){
        res.status(500).json({ error: err.message })
    }
}

// DELETE /favorites
export async function deleteByUserAndPointId(req, res){
    const { user_id, point_id } = req.body
    if(!user_id || !point_id) return res.status(400).json({ error: 'All fields are required' })

    try{
        const[result] = await pool.query(
            'DELETE from favorites WHERE user_id = ? and point_id = ?', [user_id, point_id]
        )

        res.status(200).json({ message: 'Favorite deleted successfully!', id: result.insertId})
    }
    catch(err){
        console.log(err.message)
        res.status(500).json({ error: err.message })
    }
}


async function returnAllFavorites(){
    return await pool.query("SELECT * FROM favorites");
}

async function findFavoriteById(id){
    return await pool.query("SELECT * FROM favorites WHERE id = ?", [id]);
}

export async function findFavoritesByUserId(userId){
    const [rows] = await pool.query("SELECT point_id FROM favorites WHERE user_id = ?", [userId]);
    return rows;
}