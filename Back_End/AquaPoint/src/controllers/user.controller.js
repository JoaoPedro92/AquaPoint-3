import { pool } from "../db.js";
import bcrypt from 'bcrypt'
import { findFavoritesByUserId } from "./favorites.controller.js";

// GET /users
export async function getAllUsers(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows.map(formatUser));
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /users/{id}
export async function getUserById(req, res) {
  const userId = Number(req.params.id);

  try {
    const findUser = await findUserById(userId);
    if(!findUser) return res.status(404).json({ error: `User with ID: ${userId} not found`});

    res.json(formatUser(findUser));
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

// GET /users/id/profile-picture
export async function getUserProfilePicture(req, res){
  return res.json(await returnUserProfilePicture(Number(req.params.id)))
}


// POST /users
export async function createUser(req, res) {
  const { name, email, dateBirth, city, profilePicture, password, isAdmin } = req.body

  if(!name || !email || !dateBirth || !city || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  console.log('profilePicture:', profilePicture?.substring(0, 50))
  try{
    const passwordBcrypt = await bcrypt.hash(password, 10)
    let profilePictureBlob = null
    if(profilePicture){
      profilePictureBlob = Buffer.from(profilePicture.split(',')[1], 'base64')
    }

    const[result] = await pool.query(
      'INSERT INTO users (name, email, dateBirth, city, profilePicture, passwordHash, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, dateBirth, city, profilePictureBlob, passwordBcrypt, isAdmin]
    )

    res.status(201).json({ message: 'User created successfully!', id: result.insertId})
  }
  catch(err){
    res.status(500).json({ error: err.message })
  }
}

// POST /users/compare-passwords
export async function comparePasswords(req, res){
  const { inputPassword, userPassword } = req.body

  const isValid = await bcrypt.compare(inputPassword, userPassword)
  res.json({ isValid })
}

// PUT /users/{id}  - Doesn't change isAdmin (there is another endpoint to change these)
export async function updateUser(req, res) {
  const userId = Number(req.params.id)
  
  try{
    const findUser = await findUserById(userId)
    if(!findUser) return res.status(404).json({ error: "User not found" })

    const { name, email, dateBirth, city, passwordHash, profilePicture } = req.body
    let profilePictureBlob = null

    let passwordHashed = findUser.passwordHash

    if(passwordHash){
      passwordHashed = await bcrypt.hash(passwordHash, 10)
    }

    if(profilePicture){
      profilePictureBlob = Buffer.from(profilePicture.split(',')[1], 'base64')
    }

    const[result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, dateBirth = ?, city = ?, passwordHash = ?, profilePicture = ? WHERE id = ?',
      [name, email, dateBirth, city, passwordHashed, profilePictureBlob, userId]
    );

    res.json({ message: `User with ID: ${userId} updated successfully` });
  }
  catch(err){
    console.log(err.message)
    res.status(500).json({ error: err.message })
  }
}

// PUT /users/{id}/change-isadmin
export async function changeIsAdmin(req, res) {
    const userId = Number(req.params.id)
    
    try{
      const findUser = await findUserById(userId)
      if(!findUser) return res.status(404).json({ error: "User not found" })
    
      const[result] = await pool.query(
      'UPDATE users SET isAdmin = ? WHERE id = ?',
      [req.body.isAdmin, userId]
    );
      
    res.json({ message: `User with ID: ${userId} updated successfully` });    
    }
    catch(err){
      res.status(500).json({ error: err.message })
    }
}

// PUT /users/{id}/update-password
export async function updatePassword(req, res){
    const userId = Number(req.params.id)
    const { password } = req.body
    const newPasswordHash = await bcrypt.hash(password, 10)

    try{
      const findUser = await findUserById(userId)
      if(!findUser) return res.status(404).json({ error: "User not found" })

      const[result] = await pool.query(
        'UPDATE users SET passwordHash = ? WHERE id = ?',
        [newPasswordHash, userId]
      );

      res.json({ message: `User with ID: ${userId} updated successfully` });   

    }
    catch(err){
      res.status(500).json({ error: err.message })
    }
}

// DELETE /users/{id}
export async function deleteUser(req, res) { 
  
  try{
    const findUser = await findUserById(Number(req.params.id))

    if(!findUser) return res.status(404).json({ error: "User not found" })

    await pool.query('DELETE FROM users WHERE id = ?', [findUser.id]);

    res.json({ message: `User with ID: ${findUser.id} was deleted successfully` });
  }
  catch(err){
    res.status(500).json({ error: err.message })  
  }
}


export async function findUserById(id){
  const [rows] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
}

export async function findUserByEmail(email){
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?", email);
  
    return rows[0];
}

export async function returnUserProfilePicture(id){
  const findUser = await findUserById(id)
  if(!findUser) return res.status(404).json({ error: 'User not found'})
  
  return `data:image/jpeg;base64,${findUser.profilePicture.toString('base64')}`
}

export function formatUser(user){
  if(user.profilePicture){
    user.profilePicture = `data:image/jpeg;base64,${user.profilePicture.toString('base64')}`
  }

  return user
}


