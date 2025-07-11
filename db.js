const pgp = require("pg-promise")();
const db = pgp(
  "postgresql://neondb_owner:npg_W8DrYu6ZHJwM@ep-floral-dust-a16ijyg0-pooler.ap-southeast-1.aws.neon.tech/mygarage?sslmode=require&channel_binding=require"
);

module.exports = db;
