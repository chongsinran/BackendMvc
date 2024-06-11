require('dotenv').config();

const getUserByEmail = async (req, email) => {
  const result = await req.get('pool').query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const getUserByUsername = async (req, username) => {
  const result = await req.get('pool').query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};
const getUserByPhone = async (req, phone) => {

  const res = await req.get('pool').query('SELECT * FROM users WHERE phone = $1', [phone]);
  console.log(res.rows)
  return res.rows[0];
};

const createUser = async (req, username, email, phone, password, passcode) => {
  const result = await req.get('pool').query(
    'INSERT INTO users (username, email, phone, password, passcode, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [username, email, phone, password, passcode, 'user', new Date()]
  );
  return result.rows[0];
};

const createAccessToken = async (req, userId, token, expiresAt) => {
  const result = await req.get('pool').query(
    'INSERT INTO access_tokens (token, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [token, userId, expiresAt]
  );
  return result.rows[0];
};

const createRefreshToken = async (req, userId, token, expiresAt) => {
  const result = await req.get('pool').query(
    'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [token, userId, expiresAt]
  );
  return result.rows[0];
};

const deleteAccessToken = async (req, token) => {
  await req.get('pool').query('DELETE FROM access_tokens WHERE token = $1', [token]);
};

const deleteRefreshToken = async (req, token) => {
  await req.get('pool').query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
};

const getRefreshToken = async (req, token) => {
  const result = await req.get('pool').query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
  return result.rows[0];
};

const updateLastLogin = async (req, userId) => {
  await req.get('pool').query('UPDATE users SET last_login = $1 WHERE id = $2', [new Date(), userId]);
};

module.exports = {
  getUserByEmail,
  getUserByUsername,
  createUser,
  createAccessToken,
  createRefreshToken,
  deleteAccessToken,
  deleteRefreshToken,
  getRefreshToken,
  getUserByPhone,
  updateLastLogin
};
