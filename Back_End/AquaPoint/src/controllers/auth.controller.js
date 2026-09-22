import { pool } from "../db.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { findUserByEmail } from "./user.controller.js";

// POST /auth
export async function authenticateUser(req, res){
    const { email, password } = req.body

    const findUser = await findUserByEmail(email);
    if(!findUser) return res.status(404).json({ error: `User with email: ${email} not found`});

    const isPasswordValid = await bcrypt.compare(password, findUser.passwordHash)

    if(!isPasswordValid) return res.status(401).json({ error: 'Password incorreta' })

    const token = jwt.sign({
        id: findUser.id, email: findUser.email, isAdmin: findUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    )

    res.json({ user: findUser, token })
}