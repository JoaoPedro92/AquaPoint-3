import { pool } from "../db.js";

// GET /reviews
export async function getAllReviews(req, res) {
  try {
    const [rows] = await returnAllReviews();
    res.json(rows.map(formatReview));
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /reviews/{id}
export async function getReviewById(req, res) {
  const id = Number(req.params.id);

  try {
    const reviews = await findReviewById(id);
    if(!reviews) return res.status(404).json({ error: `Review with ID: ${id} not found`});

    res.json(formatReview(reviews));
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

// GET /reviews/aquapoint/{id}
export async function getReviewByPointId(req, res) {
  const id = Number(req.params.id);

  try {
    const [reviews] = await findReviewsByAquapointId(id);
    if(!reviews) return res.status(404).json({ error: `No Reviews found for Aquapoint with ID: ${id} not found`});

    res.json(reviews.map(formatReview));
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

// GET /reviews/user/{id}
export async function getReviewsByUserId(req, res){
  const userId = Number(req.params.id)

  try{
    const [reviews] = await findReviewsByUserId(userId)
    if(!reviews) return res.status(404).json({ error: `No reviews found for user with ID: ${userId} not found`});

    res.json(reviews.map(formatReview));
  }
  catch(err){
    console.log(err.message)
    res.status(500).json(err.message);
  }
}

// PUT /reviews/{id}
export async function updateReview(req, res){
  const reviewId = Number(req.params.id)

  try{
    const { user_id, rating, comment, point_id } = req.body
    const findReview = await findReviewById(reviewId)
    if(!findReview) return res.status(404).json({ error: `No review found with ID: ${reviewId} not found`}); 

    if(!user_id || !rating || !comment || !point_id){
      return res.status(400).json({ error: 'All fields are required' })
    }

    const[result] = await pool.query(
      'UPDATE reviews set user_id = ?, rating = ?, comment = ?, point_id = ? WHERE id = ?',
      [user_id, rating, comment, point_id, reviewId]
    )

    if(result.affectedRows === 0) return res.status(500).json({ error: `There was a problem updating the aquapoint with ID: ${findAquapoint.id}`})

    res.json({ message: `Review ID: '${findReview.id}' updated successfully` })
  }
  catch(err){
    console.log(err.message)
    res.status(500).json(err.message);
  }
}

// POST /reviews
export async function createReview(req, res){
  const { user_id, rating, comment, point_id } = req.body;

  if(!user_id || !rating || !comment || !point_id){
    return res.status(400).json({ error: 'All fields are required' })
  }

  try{
    const[result] = await pool.query(
      'INSERT INTO reviews (user_id, rating, comment, point_id, createdAt) VALUES(?, ?, ?, ?, now())',
      [user_id, rating, comment, point_id]
    )

    res.status(201).json({ message: 'Review created successfully' })
  }
  catch(err){
    return res.status(500).json({ error: err.message })
  }
}

// DELETE /reviews
export async function deleteReview(req, res){
  const { id } = req.body

  try{
    const[result] = await pool.query(
      'DELETE from reviews WHERE id = ?',
      [id]
    )

    res.status(200).json({ message: 'Review deleted successfully' })
  }
  catch(err){
    return res.status(500).json({ error: err.message })
  }
}

async function returnAllReviews(){
  return await pool.query(`
      SELECT 
        users.name,
        users.profilePicture,
        reviews.id,
        reviews.user_id,
        reviews.rating,
        reviews.comment,
        reviews.point_id,
        reviews.createdAt
      FROM reviews
      INNER JOIN users ON reviews.user_id = users.id
    `);
}

async function findReviewById(id){
  const [rows] = await pool.query(`
      SELECT 
        users.name,
        users.profilePicture,
        reviews.id,
        reviews.user_id,
        reviews.rating,
        reviews.comment,
        reviews.point_id,
        reviews.createdAt
      FROM reviews
      INNER JOIN users ON reviews.user_id = users.id
      WHERE reviews.id = ? ORDER BY reviews.createdAt DESC
      `, [id]      
  );

  return rows[0];
}

async function findReviewsByAquapointId(id){
  return await pool.query(`
      SELECT         
        users.name,
        users.profilePicture,
        reviews.id,
        reviews.user_id,
        reviews.rating,
        reviews.comment,
        reviews.point_id,
        reviews.createdAt
      FROM reviews
      INNER JOIN users ON reviews.user_id = users.id
      WHERE reviews.point_id = ? ORDER BY reviews.createdAt DESC
      `, [id]      
  );
}

async function findReviewsByUserId(userId){
  return await pool.query(`
      SELECT 
        users.id,
        users.name,
        users.profilePicture,
        reviews.id,
        reviews.user_id,
        reviews.rating,
        reviews.comment,
        reviews.point_id,
        reviews.createdAt
      FROM reviews
      INNER JOIN users ON reviews.user_id = users.id
      WHERE reviews.user_id = ? 
      ORDER BY reviews.createdAt DESC
      `, [userId]      
  );
}

export function formatReview(reviews){
  if(reviews.profilePicture){
    reviews.profilePicture = `data:image/jpeg;base64,${reviews.profilePicture.toString('base64')}`
  }

  return reviews
}

