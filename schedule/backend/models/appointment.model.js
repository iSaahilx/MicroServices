const { pool } = require('../db/db');

class Appointment {
    static async create(data) {
        const { user_id, title, description, start_time, end_time, status = 'scheduled' } = data;
        const query = `
            INSERT INTO appointments (user_id, title, description, start_time, end_time, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [user_id, title, description, start_time, end_time, status];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM appointments WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findByUserId(user_id) {
        const query = 'SELECT * FROM appointments WHERE user_id = $1 ORDER BY start_time ASC';
        const result = await pool.query(query, [user_id]);
        return result.rows;
    }

    static async update(id, data) {
        const { title, description, start_time, end_time, status } = data;
        const query = `
            UPDATE appointments
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                start_time = COALESCE($3, start_time),
                end_time = COALESCE($4, end_time),
                status = COALESCE($5, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;
        const values = [title, description, start_time, end_time, status, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM appointments WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findByDateRange(start_date, end_date) {
        const query = `
            SELECT * FROM appointments
            WHERE start_time >= $1 AND end_time <= $2
            ORDER BY start_time ASC
        `;
        const result = await pool.query(query, [start_date, end_date]);
        return result.rows;
    }
}

module.exports = Appointment;

