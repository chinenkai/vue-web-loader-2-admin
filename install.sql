-- attachment表
DROP TABLE IF EXISTS "attachment";
CREATE TABLE "attachment" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "uid" INTEGER NOT NULL DEFAULT 0,
  "type" TEXT NOT NULL DEFAULT '',
  "name" TEXT NOT NULL DEFAULT '',
  "url" TEXT NOT NULL,
  "size" INTEGER NOT NULL DEFAULT 0,
  "width" INTEGER NOT NULL DEFAULT 0,
  "height" INTEGER NOT NULL DEFAULT 0,
  "remark" TEXT,
  "status" INTEGER NOT NULL DEFAULT 1,
  "createtime" INTEGER NOT NULL DEFAULT 0,
  "updatetime" INTEGER NOT NULL DEFAULT 0
);

-- config表
DROP TABLE IF EXISTS "config";
CREATE TABLE IF NOT EXISTS "config" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "group" TEXT NOT NULL DEFAULT '',
  "name" TEXT NOT NULL DEFAULT '',
  "value" TEXT,
  "listorder" INTEGER NOT NULL DEFAULT 0,
  "status" INTEGER NOT NULL DEFAULT 1,
  "createtime" INTEGER NOT NULL DEFAULT 0,
  "updatetime" INTEGER NOT NULL DEFAULT 0
);

-- demo表
DROP TABLE IF EXISTS "demo";
CREATE TABLE "demo" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "uid" INTEGER NOT NULL DEFAULT 0,
  "remark" TEXT NOT NULL DEFAULT '',
  "listorder" INTEGER NOT NULL DEFAULT 0,
  "status" INTEGER NOT NULL DEFAULT 1,
  "createtime" INTEGER NOT NULL DEFAULT 0,
  "updatetime" INTEGER NOT NULL DEFAULT 0
);

-- errmsg表
DROP TABLE IF EXISTS "errmsg";
CREATE TABLE "errmsg" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "uid" INTEGER NOT NULL DEFAULT 0,
  "action" TEXT NOT NULL DEFAULT '',
  "remark" TEXT NOT NULL DEFAULT '',
  "postdata" TEXT,
  "listorder" INTEGER NOT NULL DEFAULT 0,
  "status" INTEGER NOT NULL DEFAULT 1,
  "createtime" INTEGER NOT NULL DEFAULT 0,
  "updatetime" INTEGER NOT NULL DEFAULT 0
);

-- logs表
DROP TABLE IF EXISTS "logs";
CREATE TABLE IF NOT EXISTS "logs" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "uid" INTEGER NOT NULL DEFAULT 0,
  "username" TEXT NOT NULL DEFAULT '',
  "controller" TEXT NOT NULL DEFAULT '',
  "action" TEXT NOT NULL DEFAULT '',
  "ip" TEXT NOT NULL DEFAULT '',
  "remark" TEXT,
  "createtime" INTEGER NOT NULL DEFAULT 0,
  "updatetime" INTEGER NOT NULL DEFAULT 0
);

-- manager表
DROP TABLE IF EXISTS "manager";
CREATE TABLE IF NOT EXISTS "manager" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL DEFAULT '',
  "password" TEXT NOT NULL DEFAULT '',
  "email" TEXT NOT NULL DEFAULT '',
  "status" INTEGER DEFAULT 1,
  "factor" TEXT NOT NULL DEFAULT '',
  "remark" TEXT,
  "createtime" INTEGER NOT NULL DEFAULT 0,
  "updatetime" INTEGER NOT NULL DEFAULT 0
);

-- user表
DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL DEFAULT '',
  "phone" TEXT NOT NULL DEFAULT '',
  "password" TEXT NOT NULL DEFAULT '',
  "openid" TEXT NOT NULL DEFAULT '',
  "nickname" TEXT NOT NULL DEFAULT '',
  "sex" INTEGER NOT NULL DEFAULT 1,
  "city" TEXT NOT NULL DEFAULT '',
  "country" TEXT NOT NULL DEFAULT '',
  "province" TEXT NOT NULL DEFAULT '',
  "language" TEXT NOT NULL DEFAULT '',
  "headimgurl" TEXT NOT NULL DEFAULT '',
  "address" TEXT,
  "ua" TEXT,
  "remark" TEXT NOT NULL DEFAULT '',
  "ip" TEXT NOT NULL DEFAULT '',
  "listorder" INTEGER NOT NULL DEFAULT 0,
  "status" INTEGER NOT NULL DEFAULT 1,
  "createtime" INTEGER NOT NULL DEFAULT 0,
  "updatetime" INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX "idx_username" ON "manager" ("username");
CREATE INDEX "idx_uid" ON "errmsg" ("uid");
CREATE INDEX "idx_action" ON "errmsg" ("action");
CREATE INDEX "idx_phone" ON "user" ("phone");
CREATE INDEX "idx_openid" ON "user" ("openid");
CREATE INDEX "idx_ip" ON "user" ("ip");
-- 插入数据
INSERT INTO "manager" ("username", "password", "email", "status", "factor", "remark", "createtime", "updatetime") VALUES
('vue-web-loader-2-admin', '07c582764929d8d1cc88cbe6fa8af39ee4266101b6ca4fde28861846106c184f', '', 1, '13zguk8a', '管理员', 0, 0);
