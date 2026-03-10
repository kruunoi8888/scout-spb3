import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('scout_info.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    scout_status TEXT CHECK(scout_status IN ('ตั้งกองลูกเสือแล้ว', 'รอประเมิน', 'ยังไม่ได้ประเมิน')) DEFAULT 'ยังไม่ได้ประเมิน'
  );

  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    school_id INTEGER,
    qualification TEXT NOT NULL,
    scout_type TEXT,
    certificate_url TEXT,
    FOREIGN KEY (school_id) REFERENCES schools(id)
  );

  CREATE TABLE IF NOT EXISTS executives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    qualification TEXT NOT NULL,
    image_url TEXT,
    order_index INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

// Seed initial data if empty
const schoolCount = db.prepare('SELECT COUNT(*) as count FROM schools').get() as { count: number };
if (schoolCount.count === 0) {
  const districts = ['ด่านช้าง', 'เดิมบางนางบวช', 'สามชุก', 'หนองหญ้าไซ'];
  const statuses = ['ตั้งกองลูกเสือแล้ว', 'รอประเมิน', 'ยังไม่ได้ประเมิน'];
  
  for (let i = 1; i <= 20; i++) {
    db.prepare('INSERT INTO schools (name, district, scout_status) VALUES (?, ?, ?)').run(
      `โรงเรียนบ้านหนอง${i}`,
      districts[Math.floor(Math.random() * districts.length)],
      statuses[Math.floor(Math.random() * statuses.length)]
    );
  }

  const qualifications = ['BTC', 'ATC', 'WB', 'ALTC', 'ALT', 'LT'];
  const schoolIds = db.prepare('SELECT id FROM schools').all() as { id: number }[];
  
  for (let i = 1; i <= 100; i++) {
    db.prepare('INSERT INTO teachers (name, school_id, qualification) VALUES (?, ?, ?)').run(
      `ครูสมชาย ใจดี ${i}`,
      schoolIds[Math.floor(Math.random() * schoolIds.length)].id,
      qualifications[Math.floor(Math.random() * qualifications.length)]
    );
  }
}

// Default admin - Always ensure admin exists and has the correct password
db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)').run('admin', 'admin@spb3');
db.prepare('UPDATE users SET password = ? WHERE username = ?').run('admin@spb3', 'admin');

// Seed executives if empty
const execCount = db.prepare('SELECT COUNT(*) as count FROM executives').get() as { count: number };
if (execCount.count === 0) {
  const initialExecutives = [
    { name: 'นายผู้อำนวยการ นามสมมติ', position: 'ผู้อำนวยการ สพป.สุพรรณบุรี เขต 3', qualification: 'L.T.' },
    { name: 'นายอำนาจ นามสมมติ', position: 'รอง ผอ.สพป.สุพรรณบุรี เขต 3', qualification: 'A.L.T.C.' },
    { name: 'นางสาวสมศรี ใจดี', position: 'รอง ผอ.สพป.สุพรรณบุรี เขต 3', qualification: 'A.L.T.' },
    { name: 'นายสมชาย รักชาติ', position: 'ผู้อำนวยการกลุ่มนิเทศฯ', qualification: 'L.T.' },
    { name: 'นางสมรักษ์ พิทักษ์', position: 'ผู้อำนวยการกลุ่มส่งเสริมฯ', qualification: 'A.L.T.C.' },
    { name: 'นายวิชาญ ชำนาญ', position: 'ศึกษานิเทศก์', qualification: 'W.B.' },
    { name: 'นายกิตติพงษ์ จงเจริญ', position: 'ศึกษานิเทศก์', qualification: 'A.L.T.' },
    { name: 'นางสาววิไลวรรณ สุขสม', position: 'ผู้อำนวยการกลุ่มบริหารงานบุคคล', qualification: 'W.B.' },
    { name: 'นายประเสริฐ เลิศล้ำ', position: 'ผู้อำนวยการกลุ่มนโยบายและแผน', qualification: 'A.L.T.C.' },
    { name: 'นางนงนุช สุดสวย', position: 'ผู้อำนวยการกลุ่มการเงินและสินทรัพย์', qualification: 'B.T.C.' },
    { name: 'นายธนพล คนขยัน', position: 'ผู้อำนวยการกลุ่มอำนวยการ', qualification: 'W.B.' },
  ];
  const insertExec = db.prepare('INSERT INTO executives (name, position, qualification, order_index) VALUES (?, ?, ?, ?)');
  initialExecutives.forEach((exec, index) => {
    insertExec.run(exec.name, exec.position, exec.qualification, index);
  });
}

// Seed settings if empty
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
if (settingsCount.count === 0) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('org_name', 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสุพรรณบุรี เขต 3');
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('org_affiliation', 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/stats', (req, res) => {
    const schoolStats = db.prepare(`
      SELECT scout_status, COUNT(*) as count 
      FROM schools 
      GROUP BY scout_status
    `).all();

    const qualStats = db.prepare(`
      SELECT qualification, COUNT(*) as count 
      FROM teachers 
      GROUP BY qualification
    `).all();

    const districtStats = db.prepare(`
      SELECT s.district, COUNT(DISTINCT s.id) as school_count, COUNT(t.id) as teacher_count
      FROM schools s
      LEFT JOIN teachers t ON s.id = t.school_id
      GROUP BY s.district
    `).all();

    const districtQualStatsRaw = db.prepare(`
      SELECT s.district, t.qualification, COUNT(*) as count
      FROM teachers t
      JOIN schools s ON t.school_id = s.id
      GROUP BY s.district, t.qualification
    `).all() as { district: string, qualification: string, count: number }[];

    // Format for Recharts LineChart
    const districts = [...new Set(districtQualStatsRaw.map(d => d.district))];
    const qualifications = ['BTC', 'ATC', 'WB', 'ALTC', 'ALT', 'LT'];
    
    const districtQualStats = districts.map(d => {
      const row: any = { district: d };
      qualifications.forEach(q => {
        const match = districtQualStatsRaw.find(r => r.district === d && r.qualification === q);
        row[q] = match ? match.count : 0;
      });
      return row;
    });

    res.json({ schoolStats, qualStats, districtStats, districtQualStats });
  });

  app.get('/api/schools', (req, res) => {
    const schools = db.prepare('SELECT * FROM schools').all();
    res.json(schools);
  });

  app.get('/api/teachers', (req, res) => {
    const teachers = db.prepare(`
      SELECT t.*, s.name as school_name, s.district 
      FROM teachers t 
      LEFT JOIN schools s ON t.school_id = s.id
    `).all();
    res.json(teachers);
  });

  app.post('/api/teachers', (req, res) => {
    const { name, school_id, qualification, scout_type, certificate_url } = req.body;
    const result = db.prepare('INSERT INTO teachers (name, school_id, qualification, scout_type, certificate_url) VALUES (?, ?, ?, ?, ?)').run(name, school_id, qualification, scout_type, certificate_url);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/teachers/:id', (req, res) => {
    const { name, school_id, qualification, scout_type, certificate_url } = req.body;
    db.prepare('UPDATE teachers SET name = ?, school_id = ?, qualification = ?, scout_type = ?, certificate_url = ? WHERE id = ?').run(name, school_id, qualification, scout_type, certificate_url, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/teachers/:id', (req, res) => {
    db.prepare('DELETE FROM teachers WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.put('/api/schools/:id/status', (req, res) => {
    const { scout_status } = req.body;
    db.prepare('UPDATE schools SET scout_status = ? WHERE id = ?').run(scout_status, req.params.id);
    res.json({ success: true });
  });

  app.get('/api/executives', (req, res) => {
    const execs = db.prepare('SELECT * FROM executives ORDER BY order_index ASC').all();
    res.json(execs);
  });

  app.post('/api/executives', (req, res) => {
    const { name, position, qualification, image_url, order_index } = req.body;
    const result = db.prepare('INSERT INTO executives (name, position, qualification, image_url, order_index) VALUES (?, ?, ?, ?, ?)').run(name, position, qualification, image_url, order_index);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/executives/:id', (req, res) => {
    const { name, position, qualification, image_url, order_index } = req.body;
    db.prepare('UPDATE executives SET name = ?, position = ?, qualification = ?, image_url = ? , order_index = ? WHERE id = ?').run(name, position, qualification, image_url, order_index, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/executives/:id', (req, res) => {
    db.prepare('DELETE FROM executives WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/settings', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post('/api/settings', (req, res) => {
    const settings = req.body;
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    Object.entries(settings).forEach(([key, value]) => {
      upsert.run(key, value);
    });
    res.json({ success: true });
  });

  app.get('/api/documents', (req, res) => {
    const docs = db.prepare('SELECT * FROM documents ORDER BY upload_date DESC').all();
    res.json(docs);
  });

  app.post('/api/documents', (req, res) => {
    const { title, file_url, file_size } = req.body;
    const result = db.prepare('INSERT INTO documents (title, file_url, file_size) VALUES (?, ?, ?)').run(title, file_url, file_size);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/documents/:id', (req, res) => {
    db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  app.post('/api/schools', (req, res) => {
    const { name, district, scout_status } = req.body;
    const result = db.prepare('INSERT INTO schools (name, district, scout_status) VALUES (?, ?, ?)').run(name, district, scout_status);
    res.json({ id: result.lastInsertRowid });
  });

  app.post('/api/teachers', (req, res) => {
    const { name, school_id, qualification } = req.body;
    const result = db.prepare('INSERT INTO teachers (name, school_id, qualification) VALUES (?, ?, ?)').run(name, school_id, qualification);
    res.json({ id: result.lastInsertRowid });
  });

  app.patch('/api/schools/:id', (req, res) => {
    const { scout_status } = req.body;
    db.prepare('UPDATE schools SET scout_status = ? WHERE id = ?').run(scout_status, req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
