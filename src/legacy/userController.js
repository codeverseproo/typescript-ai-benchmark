// LEGACY FILE — intentionally untyped JavaScript
// Task 3: Migrate this entire file to strict TypeScript

const db = require('../lib/db')

async function getUser(id) {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
  return user.rows[0]
}

async function updateUser(id, data) {
  const fields = Object.keys(data)
  const values = Object.values(data)
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ')
  await db.query(`UPDATE users SET ${setClause} WHERE id = $1`, [id, ...values])
  return getUser(id)
}

async function deleteUser(id) {
  await db.query('DELETE FROM users WHERE id = $1', [id])
  return { deleted: true, id }
}

async function listUsers(filters) {
  let query = 'SELECT * FROM users'
  const params = []
  if (filters && filters.email) {
    query += ' WHERE email LIKE $1'
    params.push(`%${filters.email}%`)
  }
  const result = await db.query(query, params)
  return result.rows
}

module.exports = { getUser, updateUser, deleteUser, listUsers }
