const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'schedules',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

function connect() {
    pool.connect()
        .then((client) => {
            console.log('Connected to PostgreSQL');
            client.release();
            // Create tables if they don't exist
            createTables();
        })
        .catch((err) => {
            console.error('Error connecting to PostgreSQL:', err);
            // Retry connection after 5 seconds
            setTimeout(connect, 5000);
        });
}

async function createTables() {
    const createAppointmentsTable = `
        CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP NOT NULL,
            status VARCHAR(50) DEFAULT 'scheduled',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createIndex = `
        CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
    `;

    try {
        await pool.query(createAppointmentsTable);
        await pool.query(createIndex);
        console.log('Database tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}

module.exports = { 
    connect, 
    pool 
};

