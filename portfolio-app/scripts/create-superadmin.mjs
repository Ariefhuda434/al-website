#!/usr/bin/env node
/**
 * Jalankan sekali di awal buat bikin akun superadmin pertama.
 * Pakai: DATABASE_URL="mysql://..." node scripts/create-superadmin.mjs email@kamu.com "PasswordKuat123!"
 */
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";

const [, , email, password] = process.argv;
if (!email || !password || password.length < 10) {
  console.error('Pakai: node scripts/create-superadmin.mjs email@kamu.com "PasswordMinimal10Karakter"');
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL belum diatur di environment.");
  process.exit(1);
}

let ssl = { rejectUnauthorized: true };
if (process.env.DATABASE_CA_CERT_BASE64) {
  ssl = { ca: Buffer.from(process.env.DATABASE_CA_CERT_BASE64, "base64").toString("utf8") };
} else if (process.env.DATABASE_CA_CERT_FILE) {
  ssl = { ca: readFileSync(process.env.DATABASE_CA_CERT_FILE, "utf8") };
}

const conn = await mysql.createConnection({ uri: url, ssl });
const hash = await bcrypt.hash(password, 12);

try {
  await conn.execute(
    `INSERT INTO admins (email, password_hash, role) VALUES (?, ?, 'superadmin')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'superadmin', is_active = 1`,
    [email.toLowerCase().trim(), hash],
  );
  console.log(`Superadmin siap: ${email}`);
} finally {
  await conn.end();
}
