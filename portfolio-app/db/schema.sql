-- =========================================================
-- Skema database Aiven MySQL untuk portfolio-app
-- Menggantikan Vercel Blob JSON store (PATHS.content, PATHS.works, dst)
-- =========================================================

CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,       -- bcrypt/argon2 hash, JANGAN plaintext
  role          ENUM('admin','superadmin') NOT NULL DEFAULT 'admin',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by    INT NULL,                    -- superadmin yang membuat akun ini
  last_login_at DATETIME NULL,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sessions (
  id            VARCHAR(64) PRIMARY KEY,     -- token acak (bukan JWT statis)
  admin_id      INT NOT NULL,
  ip            VARCHAR(64),
  user_agent    VARCHAR(300),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at    DATETIME NOT NULL,
  revoked_at    DATETIME NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  INDEX idx_sessions_admin (admin_id),
  INDEX idx_sessions_expires (expires_at)
) ENGINE=InnoDB;

-- Konten situs (hero, about, skills, contact, dsb) sebagai key-value versioned
CREATE TABLE IF NOT EXISTS site_content (
  content_key   VARCHAR(120) PRIMARY KEY,    -- contoh: 'hero', 'about', 'contact'
  content_json  JSON NOT NULL,               -- versi yang TAYANG di situs publik
  draft_json    JSON NULL,                   -- draft belum di-publish, sumber untuk live preview
  draft_by      INT NULL,
  draft_at      DATETIME NULL,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by    INT NULL,
  FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL,
  FOREIGN KEY (draft_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Riwayat versi konten (buat rollback / audit, dan basis "preview")
CREATE TABLE IF NOT EXISTS site_content_history (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  content_key   VARCHAR(120) NOT NULL,
  content_json  JSON NOT NULL,
  saved_by      INT NULL,
  saved_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (saved_by) REFERENCES admins(id) ON DELETE SET NULL,
  INDEX idx_history_key (content_key, saved_at)
) ENGINE=InnoDB;

-- Karya / portfolio items
CREATE TABLE IF NOT EXISTS works (
  id            VARCHAR(64) PRIMARY KEY,
  title         VARCHAR(120) NOT NULL DEFAULT '',
  description   VARCHAR(400) NOT NULL DEFAULT '',
  description_id VARCHAR(400) NOT NULL DEFAULT '',  -- versi 'idn' di kode lama
  image_url     VARCHAR(600) NOT NULL DEFAULT '',
  aspect_class  VARCHAR(60)  NOT NULL DEFAULT 'aspect-[3/4]',
  tone_class    VARCHAR(80)  NOT NULL DEFAULT 'from-mauve to-butter',
  sort_order    INT NOT NULL DEFAULT 999,
  is_published  TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_works_order (sort_order)
) ENGINE=InnoDB;

-- Statistik pengunjung (view/click)
CREATE TABLE IF NOT EXISTS visit_stats (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  ts            BIGINT NOT NULL,             -- epoch ms, biar kompatibel kode lama
  visit_date    DATE NOT NULL,
  event_type    ENUM('view','click') NOT NULL,
  path          VARCHAR(160) NOT NULL DEFAULT '/',
  label         VARCHAR(160) NULL,
  referrer      VARCHAR(300) NULL,
  ip_hash       CHAR(64) NULL,                -- HASH ip, bukan ip mentah (privasi)
  user_agent    VARCHAR(300) NULL,
  INDEX idx_stats_date (visit_date),
  INDEX idx_stats_type (event_type),
  INDEX idx_stats_label (label)
) ENGINE=InnoDB;

-- Audit log aksi admin (login, edit konten, upload, dsb)
CREATE TABLE IF NOT EXISTS admin_logs (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  ts            BIGINT NOT NULL,
  admin_id      INT NULL,
  action        VARCHAR(60) NOT NULL,
  result        VARCHAR(30) NULL,             -- success / failed / denied
  detail        VARCHAR(500) NULL,
  level         VARCHAR(20) NOT NULL DEFAULT 'info',
  suspicious    TINYINT(1) NOT NULL DEFAULT 0,
  ip_hash       CHAR(64) NULL,
  user_agent    VARCHAR(300) NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
  INDEX idx_logs_ts (ts),
  INDEX idx_logs_action (action)
) ENGINE=InnoDB;

-- Pengaturan situs (owner, daftar email admin yang diizinkan didaftarkan superadmin)
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key   VARCHAR(80) PRIMARY KEY,
  setting_value JSON NOT NULL
) ENGINE=InnoDB;

-- Rate limit login (multi-instance safe; dihitung per rate_key dalam window)
CREATE TABLE IF NOT EXISTS login_attempts (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  rate_key      VARCHAR(190) NOT NULL,        -- "login:{ip}:{email}"
  attempted_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_attempts_key_time (rate_key, attempted_at)
) ENGINE=InnoDB;

-- Upload file metadata (Vercel Blob tetap dipakai untuk FILE-nya sendiri,
-- MySQL cukup catat metadata; lihat catatan di bawah)
CREATE TABLE IF NOT EXISTS uploads (
  id            VARCHAR(64) PRIMARY KEY,
  url           VARCHAR(600) NOT NULL,
  original_name VARCHAR(200) NOT NULL,
  content_type  VARCHAR(100) NOT NULL,
  size_bytes    INT NOT NULL,
  uploaded_by   INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;
