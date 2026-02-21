import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("infinityhub.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'user',
    tier INTEGER DEFAULT 1,
    balance REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    tier INTEGER,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS nysc_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'pending',
    payment REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    category TEXT,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS affiliate_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    link TEXT,
    commission_rate REAL,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", platform: "InfinityHub" });
  });

  // User Auth (Simple for demo, ready for OAuth)
  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      db.prepare("INSERT INTO users (email) VALUES (?)").run(email);
      user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    }
    res.json(user);
  });

  // Revenue & Stats (Godmode)
  app.get("/api/admin/stats", (req, res) => {
    const totalRevenue = db.prepare("SELECT SUM(amount) as total FROM revenue_logs").get().total || 0;
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
    const activeTasks = db.prepare("SELECT COUNT(*) as count FROM nysc_tasks WHERE status = 'pending'").get().count;
    res.json({ totalRevenue, userCount, activeTasks });
  });

  // NYSC Portal API
  app.get("/api/nysc/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM nysc_tasks ORDER BY created_at DESC").all();
    res.json(tasks);
  });

  app.post("/api/nysc/tasks", (req, res) => {
    const { user_id, title, description, payment } = req.body;
    db.prepare("INSERT INTO nysc_tasks (user_id, title, description, payment) VALUES (?, ?, ?, ?)").run(user_id, title, description, payment);
    res.json({ status: "Task created" });
  });

  // Blog & Content Engine
  app.get("/api/blog/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM blog_posts ORDER BY published_at DESC").all();
    res.json(posts);
  });

  // Affiliate Engine
  app.get("/api/affiliate/links", (req, res) => {
    const links = db.prepare("SELECT * FROM affiliate_links").all();
    res.json(links);
  });

  // Tier Unlock Logic
  app.post("/api/user/unlock-tier", (req, res) => {
    const { user_id, tier } = req.body;
    db.prepare("UPDATE users SET tier = ? WHERE id = ?").run(tier, user_id);
    res.json({ status: `Tier ${tier} unlocked` });
  });

  // Autopilot Simulation (Backend only)
  app.post("/api/autopilot/hunt", (req, res) => {
    // Logic for finding clients/leads
    const leads = [
      { name: "TechCorp", interest: "High", source: "LinkedIn" },
      { name: "DesignStudio", interest: "Medium", source: "Twitter" }
    ];
    res.json({ status: "Hunting complete", leads });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`InfinityHub running on http://localhost:${PORT}`);
  });
}

startServer();
