import { pool } from "../db.js";

// GET /trustlogs
export async function getAllTrustLogs(req, res) {
    try {
        const [rows] = await returnAllTrustLogs();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

// GET /trustlogs/{id}
export async function getTrustLogById(req, res) {
    const id = Number(req.params.id);

    try {
        const trustLogs = await findTrustLogById(id);
        if (!trustLogs) return res.status(404).json({ error: `Trust log with ID: ${id} not found` });

        res.json(trustLogs);
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
}

// GET /trustlogs/aquapoint/{id}
export async function getTrustLogByPointId(req, res) {
    const id = Number(req.params.id);

    try {
        const [trustLogs] = await findTrustLogByAquapointId(id);
        if (!trustLogs) return res.status(404).json({ error: `No Trust logs found for Aquapoint with ID: ${id} not found` });

        res.json(trustLogs);
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
}

// GET /trustlogs/user/{id}
export async function getTrustLogsByUserId(req, res) {
    const userId = Number(req.params.id)

    try {
        const [trustLogs] = await findTrustLogsByUserId(userId)
        if (!trustLogs) return res.status(404).json({ error: `No trust logs found for user with ID: ${userId} not found` });

        res.json(trustLogs);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
}

// GET /trustlogs/user/{userId}/aquapoint/{pointId}
export async function getTrustLogsByUserAndAquapointId(req, res) {
    const userId = Number(req.params.userId)
    const pointId = Number(req.params.pointId)

    try {
        const [trustLogs] = await findTrustLogsByUserAndAquapointId(userId, pointId)
        if (!trustLogs) return res.status(404).json({ error: `No trust logs found for user with ID: ${userId} and aquapoint with ID: ${pointId} not found` });

        res.json(trustLogs);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
}

// GET /trustlogs/user/{userId}/aquapoint/{pointId}/most-recent
export async function getMostRecentTrustLogByUserAndAquapointId(req, res) {
    const userId = Number(req.params.userId)
    const pointId = Number(req.params.pointId)

    try {
        const [trustLogs] = await findMostRecentTrustLogByUserAndAquapointId(userId, pointId)
        if (!trustLogs) return res.status(404).json({ error: `No trust logs found for user with ID: ${userId} and aquapoint with ID: ${pointId} not found` });

        res.json(trustLogs);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
}

// GET /trustlogs/user/{userId}/aquapoint/{aquapointId}/is-vote-enable
export async function isVoteEnableByUserAndAquapointId(req, res){
    const userId = Number(req.params.userId)
    const pointId = Number(req.params.pointId)

    try{
        // Vote interval of 5 days
        const [rows] = await pool.query(
            `SELECT NOW() >= DATE_ADD(vote_date, INTERVAL 5 DAY) as valid,
                DATE_ADD(vote_date, INTERVAL 5 DAY) AS next_vote_date
             FROM trust_logs 
                WHERE trust_logs.user_id = ? and trust_logs.point_id = ? 
                ORDER BY trust_logs.vote_date DESC LIMIT 1`,
            [userId, pointId]
        )

        // No records, users has no logs on trustlevel votes on that specific aquapoint
        if (!rows || rows.length === 0) {
            return res.json({ valid: true })
        }

        if(!rows[0].valid){
            return res.status(200).json({ 
                valid: false,
                error: `Só pode votar novamente apartir de ${new Date(rows[0].next_vote_date).toLocaleDateString('pt-PT')}.`
            });
        }

        return res.json({ valid: true })
        
    }
    catch(err){
        console.log(err.message)
        res.status(500).json(err.message);
    }
}


// POST /trustlogs
export async function createTrustLog(req, res) {
    const { user_id, point_id, trust_vote } = req.body;

    if (!user_id || !point_id || !trust_vote) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO trust_logs (user_id, point_id, trust_vote, vote_date) VALUES(?, ?, ?, now())',
            [user_id, point_id, trust_vote]
        )

        res.status(201).json({ message: 'Trust log created successfully' })
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

// DELETE /trustlogs
export async function deleteTrustLog(req, res) {
    const { id } = req.body

    try {
        const [result] = await pool.query(
            'DELETE from trust_logs WHERE id = ?',
            [id]
        )

        res.status(200).json({ message: 'Trust log deleted successfully' })
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

async function returnAllTrustLogs() {
    return await pool.query(`
      SELECT 
        trust_logs.id,
        trust_logs.trust_vote,
        trust_logs.vote_date,
        users.id,
        users.name,
        aqua_points.id,
        aqua_points.point_name,
        aqua_points.point_trust        
      FROM trust_logs
      INNER JOIN users ON trust_logs.user_id = users.id
      INNER JOIN aqua_points ON trust_logs.point_id = aqua_points.id
    `);
}

async function findTrustLogById(id) {
    const [rows] = await pool.query(`
      SELECT 
        trust_logs.id,
        trust_logs.trust_vote,
        trust_logs.vote_date,
        users.id,
        users.name,
        aqua_points.id,
        aqua_points.point_name,
        aqua_points.point_trust        
      FROM trust_logs
      INNER JOIN users ON trust_logs.user_id = users.id
      INNER JOIN aqua_points ON trust_logs.point_id = aqua_points.id
      WHERE trust_logs.id = ?
      `, [id]
    );

    return rows[0];
}

async function findTrustLogByAquapointId(id) {
    return await pool.query(`
      SELECT 
        trust_logs.id,
        trust_logs.trust_vote,
        trust_logs.vote_date,
        users.id,
        users.name,
        aqua_points.id,
        aqua_points.point_name,
        aqua_points.point_trust        
      FROM trust_logs
      INNER JOIN users ON trust_logs.user_id = users.id
      INNER JOIN aqua_points ON trust_logs.point_id = aqua_points.id
      WHERE trust_logs.point_id = ?
      `, [id]
    );
}

async function findTrustLogsByUserId(userId) {
    return await pool.query(`
      SELECT 
        trust_logs.id,
        trust_logs.trust_vote,
        trust_logs.vote_date,
        users.id,
        users.name,
        aqua_points.id,
        aqua_points.point_name,
        aqua_points.point_trust        
      FROM trust_logs
      INNER JOIN users ON trust_logs.user_id = users.id
      INNER JOIN aqua_points ON trust_logs.point_id = aqua_points.id
      WHERE trust_logs.user_id = ?
      `, [userId]
    );
}

async function findTrustLogsByUserAndAquapointId(userId, pointId) {
    return await pool.query(`
      SELECT 
        trust_logs.id,
        trust_logs.trust_vote,
        trust_logs.vote_date,
        users.id,
        users.name,
        aqua_points.id,
        aqua_points.point_name,
        aqua_points.point_trust        
      FROM trust_logs
      INNER JOIN users ON trust_logs.user_id = users.id
      INNER JOIN aqua_points ON trust_logs.point_id = aqua_points.id
      WHERE trust_logs.user_id = ? AND trust_logs.point_id = ?
      `, [userId, pointId]
    );
}

async function findMostRecentTrustLogByUserAndAquapointId(userId, pointId) {
    return await pool.query(`
      SELECT 
        trust_logs.id,
        trust_logs.trust_vote,
        trust_logs.vote_date,
        users.id,
        users.name,
        aqua_points.id,
        aqua_points.point_name,
        aqua_points.point_trust        
      FROM trust_logs
      INNER JOIN users ON trust_logs.user_id = users.id
      INNER JOIN aqua_points ON trust_logs.point_id = aqua_points.id
      WHERE trust_logs.user_id = ? AND trust_logs.point_id = ? 
      ORDER BY trust_logs.vote_date DESC LIMIT 1
      `, [userId, pointId]
    );
}


