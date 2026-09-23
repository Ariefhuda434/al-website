import mysql from "mysql2/promise";

// Pool koneksi tunggal, dipakai ulang di semua request (penting di serverless).
declare global {
  var __mysqlPool: mysql.Pool | undefined;
}

function buildPool(): mysql.Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL belum diatur. Isi environment variable di Vercel.");
  }

  const caCertB64 = process.env.DATABASE_CA_CERT_BASE64;
  const ssl = caCertB64
    ? { ca: Buffer.from(caCertB64, "base64").toString("utf8") }
    : { rejectUnauthorized: true }; // fallback: tetap wajib TLS walau tanpa CA custom

  return mysql.createPool({
    uri: url,
    ssl,
    waitForConnections: true,
    connectionLimit: 8,
    maxIdle: 4,
    idleTimeout: 30_000,
    enableKeepAlive: true,
    dateStrings: false,
  });
}

export function pool(): mysql.Pool {
  if (!global.__mysqlPool) global.__mysqlPool = buildPool();
  return global.__mysqlPool;
}

type SqlParam = string | number | boolean | null | Date | Buffer;

function normalizeParams(params: readonly (SqlParam | undefined)[]): SqlParam[] {
  return params.map((p) => (p === undefined ? null : p));
}

export async function query<T = unknown>(
  sql: string,
  params: readonly (SqlParam | undefined)[] = [],
): Promise<T[]> {
  const [rows] = await pool().query(sql, normalizeParams(params));
  return rows as T[];
}

export async function queryOne<T = unknown>(
  sql: string,
  params: readonly (SqlParam | undefined)[] = [],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(
  sql: string,
  params: readonly (SqlParam | undefined)[] = [],
) {
  const [result] = await pool().execute(sql, normalizeParams(params));
  return result;
}

/** Transaksi kecil untuk operasi multi-statement (mis. simpan works + reorder). */
export async function withTransaction<T>(fn: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
