import express from 'express';
import { createClient } from '@libsql/client';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Database setup using Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:database.sqlite',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';
const ADMIN_USER = process.env.ADMIN_USER || 'asmarburjaliyeva1!';
const ADMIN_PASS = process.env.ADMIN_PASS || '238492@';

// Initialize Database
async function initDb() {
  // Yorumlara onay sütunu ekle (Eğer daha önce yoksa)
try {
  await db.execute('ALTER TABLE blog_comments ADD COLUMN approved BOOLEAN DEFAULT 0');
} catch (e) { /* Sütun zaten varsa hata vermez, yoksayar */ }
try {
    await db.executeMultiple(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        target_audience TEXT,
        active BOOLEAN DEFAULT 1,
        archived BOOLEAN DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        url TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        summary TEXT,
        content TEXT NOT NULL,
        image_url TEXT,
        likes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        archived BOOLEAN DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS blog_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        review TEXT NOT NULL,
        image_url TEXT,
        approved BOOLEAN DEFAULT 0,
        archived BOOLEAN DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        service TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS faq (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT NOT NULL,
        visit_date DATE DEFAULT CURRENT_DATE,
        UNIQUE(ip, visit_date)
      );
    `);

    // Insert dummy data if empty
    const courseCount = await db.execute('SELECT COUNT(*) as count FROM courses');
    if ((courseCount.rows[0].count as number) === 0) {
      await db.execute({ sql: 'INSERT INTO courses (title, description, target_audience, active) VALUES (?, ?, ?, ?)', args: ['Speaking Club', 'Practice speaking in a friendly, relaxed environment with peers.', 'All levels', 1] });
      await db.execute({ sql: 'INSERT INTO courses (title, description, target_audience, active) VALUES (?, ?, ?, ?)', args: ['English Corner', 'Interactive sessions focusing on real-life conversation and practical vocabulary.', 'Intermediate learners', 1] });
      await db.execute({ sql: 'INSERT INTO courses (title, description, target_audience, active) VALUES (?, ?, ?, ?)', args: ['Teacher Training Program', 'A specialized program for aspiring English teachers to build confidence and skills.', 'Teachers', 1] });
      
      await db.execute({ sql: 'INSERT INTO blog_posts (title, summary, content) VALUES (?, ?, ?)', args: ['How to Overcome the Fear of Speaking English', 'Practical tips to build confidence and start speaking without fear.', 'Speaking is often the hardest part of learning a new language. Here are some practical tips to help you build confidence and start speaking without fear.'] });
      await db.execute({ sql: 'INSERT INTO blog_posts (title, summary, content) VALUES (?, ?, ?)', args: ['Top 10 Practical Expressions for Daily Conversation', 'Sound more natural with these 10 practical expressions used by native speakers.', 'Stop using textbook phrases and start sounding more natural with these 10 practical expressions used by native speakers every day.'] });
      
      await db.execute({ sql: 'INSERT INTO materials (title, category, description, url) VALUES (?, ?, ?, ?)', args: ['Everyday Vocabulary Guide', 'Vocabulary', 'A comprehensive guide to everyday vocabulary used in real-life conversations.', '/material1.pdf'] });
      await db.execute({ sql: 'INSERT INTO materials (title, category, description, url) VALUES (?, ?, ?, ?)', args: ['Speaking Confidence Workbook', 'Speaking', 'Exercises and tips to help you overcome the fear of speaking English.', '/material2.pdf'] });
      await db.execute({ sql: 'INSERT INTO materials (title, category, description, url) VALUES (?, ?, ?, ?)', args: ['Common Idioms Cheat Sheet', 'Vocabulary', 'A quick reference guide for the most common English idioms.', '/material3.pdf'] });
      
      await db.execute({ sql: 'INSERT INTO feedback (name, review, image_url, approved) VALUES (?, ?, ?, ?)', args: ['Alex', 'Asmar is a fantastic teacher! My speaking improved so much and I finally feel confident.', '/feedback1.png', 1] });
      await db.execute({ sql: 'INSERT INTO feedback (name, review, image_url, approved) VALUES (?, ?, ?, ?)', args: ['Maria', 'The Speaking Club was exactly what I needed to overcome my fear of making mistakes.', '/feedback2.png', 1] });
      await db.execute({ sql: 'INSERT INTO feedback (name, review, image_url, approved) VALUES (?, ?, ?, ?)', args: ['David', 'Highly recommend the Teacher Training Program. It gave me the practical skills I was missing.', '/feedback3.png', 1] });

      await db.execute({ sql: 'INSERT INTO faq (question, answer) VALUES (?, ?)', args: ['Are the lessons online or offline?', 'I offer both! Online lessons are conducted via Zoom, and offline lessons are available in my studio.'] });
      await db.execute({ sql: 'INSERT INTO faq (question, answer) VALUES (?, ?)', args: ['How long does a course last?', 'The duration depends on the program. Speaking Clubs and English Corner are ongoing, while the Teacher Training Program has a specific schedule.'] });
      await db.execute({ sql: 'INSERT INTO faq (question, answer) VALUES (?, ?)', args: ['How many students are in a group?', 'Groups are kept small (4-6 students) to ensure everyone gets plenty of speaking time and personal attention.'] });
      await db.execute({ sql: 'INSERT INTO faq (question, answer) VALUES (?, ?)', args: ['Do you focus only on speaking?', 'While speaking is the core focus, we also cover essential grammar and vocabulary in a practical, conversational context.'] });
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initDb();

// ZİYARETÇİ SAYACI (YENİ EKLENDİ)
app.post('/api/track-visit', async (req, res) => {
  // Vercel'in karmaşık IP formatından sadece asıl IP'yi alıyoruz
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ip = String(rawIp).split(',')[0].trim(); 
  
  try {
    await db.execute({ sql: 'INSERT OR IGNORE INTO visitors (ip) VALUES (?)', args: [ip] });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
});// ZİYARETÇİ SAYACI (YENİ EKLENDİ)
app.post('/api/track-visit', async (req, res) => {
  // Vercel'in karmaşık IP formatından sadece asıl IP'yi alıyoruz
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ip = String(rawIp).split(',')[0].trim(); 
  
  try {
    await db.execute({ sql: 'INSERT OR IGNORE INTO visitors (ip) VALUES (?)', args: [ip] });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
});

// Auth middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};



// Auth
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Helper to upload to Cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// API Routes

// Courses
app.get('/api/courses', async (req, res) => {
  const result = await db.execute('SELECT * FROM courses WHERE active = 1 AND archived = 0');
  res.json(result.rows);
});
app.get('/api/admin/courses', requireAuth, async (req, res) => {
  const result = await db.execute('SELECT * FROM courses');
  res.json(result.rows);
});
app.post('/api/admin/courses', requireAuth, async (req, res) => {
  const { title, description, target_audience } = req.body;
  const result = await db.execute({ sql: 'INSERT INTO courses (title, description, target_audience) VALUES (?, ?, ?)', args: [title, description, target_audience] });
  res.json({ id: result.lastInsertRowid });
});
app.put('/api/admin/courses/:id', requireAuth, async (req, res) => {
  const { title, description, target_audience, active } = req.body;
  await db.execute({ sql: 'UPDATE courses SET title = ?, description = ?, target_audience = ?, active = ? WHERE id = ?', args: [title, description, target_audience, active ? 1 : 0, req.params.id] });
  res.json({ success: true });
});
app.put('/api/admin/courses/:id/archive', requireAuth, async (req, res) => {
  const { archived } = req.body;
  await db.execute({ sql: 'UPDATE courses SET archived = ? WHERE id = ?', args: [archived ? 1 : 0, req.params.id] });
  res.json({ success: true });
});
app.delete('/api/admin/courses/:id', requireAuth, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM courses WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});

// Blog
app.get('/api/blog', async (req, res) => {
  const { sort } = req.query;
  let query = 'SELECT * FROM blog_posts WHERE archived = 0 ORDER BY created_at DESC';
  if (sort === 'likes') {
    query = 'SELECT * FROM blog_posts WHERE archived = 0 ORDER BY likes DESC, created_at DESC';
  }
  const result = await db.execute(query);
  res.json(result.rows);
});
app.get('/api/admin/blog', requireAuth, async (req, res) => {
  const result = await db.execute('SELECT * FROM blog_posts ORDER BY created_at DESC');
  res.json(result.rows);
});
app.get('/api/blog/:id', async (req, res) => {
  const postResult = await db.execute({ sql: 'SELECT * FROM blog_posts WHERE id = ? AND archived = 0', args: [req.params.id] });
  const post = postResult.rows[0];
  if (!post) return res.status(404).json({ error: 'Not found' });
  const commentsResult = await db.execute({ sql: 'SELECT * FROM blog_comments WHERE post_id = ? AND approved = 1 ORDER BY created_at DESC', args: [req.params.id] });
  res.json({ ...post, comments: commentsResult.rows });
});
app.post('/api/blog/:id/like', async (req, res) => {
  await db.execute({ sql: 'UPDATE blog_posts SET likes = likes + 1 WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});
app.post('/api/blog/:id/comments', async (req, res) => {
  const { name, comment } = req.body;
  const result = await db.execute({ sql: 'INSERT INTO blog_comments (post_id, name, comment) VALUES (?, ?, ?)', args: [req.params.id, name, comment] });
  res.json({ id: result.lastInsertRowid });
});
app.post('/api/admin/blog', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    let image_url = null;
    if (req.file) {
      image_url = await uploadToCloudinary(req.file.buffer, 'blog');
    }
    const result = await db.execute({ sql: 'INSERT INTO blog_posts (title, summary, content, image_url) VALUES (?, ?, ?, ?)', args: [title, summary, content, image_url] });
    res.json({ id: result.lastInsertRowid, image_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});
app.put('/api/admin/blog/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    if (req.file) {
      const image_url = await uploadToCloudinary(req.file.buffer, 'blog');
      await db.execute({ sql: 'UPDATE blog_posts SET title = ?, summary = ?, content = ?, image_url = ? WHERE id = ?', args: [title, summary, content, image_url, req.params.id] });
    } else {
      await db.execute({ sql: 'UPDATE blog_posts SET title = ?, summary = ?, content = ? WHERE id = ?', args: [title, summary, content, req.params.id] });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});
app.put('/api/admin/blog/:id/archive', requireAuth, async (req, res) => {
  const { archived } = req.body;
  await db.execute({ sql: 'UPDATE blog_posts SET archived = ? WHERE id = ?', args: [archived ? 1 : 0, req.params.id] });
  res.json({ success: true });
});
app.delete('/api/admin/blog/:id', requireAuth, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM blog_posts WHERE id = ?', args: [req.params.id] });
  await db.execute({ sql: 'DELETE FROM blog_comments WHERE post_id = ?', args: [req.params.id] });
  res.json({ success: true });
});
app.post('/api/admin/upload', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      const url = await uploadToCloudinary(req.file.buffer, 'uploads');
      res.json({ url });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});
app.get('/api/admin/comments', requireAuth, async (req, res) => {
  const result = await db.execute(`
    SELECT c.*, p.title as post_title 
    FROM blog_comments c 
    JOIN blog_posts p ON c.post_id = p.id 
    ORDER BY c.created_at DESC
  `);
  res.json(result.rows);
});
app.put('/api/admin/comments/:id/approve', requireAuth, async (req, res) => {
  await db.execute({ sql: 'UPDATE blog_comments SET approved = 1 WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});
app.delete('/api/admin/comments/:id', requireAuth, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM blog_comments WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});

// FAQ
app.get('/api/faq', async (req, res) => {
  const result = await db.execute('SELECT * FROM faq');
  res.json(result.rows);
});
app.post('/api/admin/faq', requireAuth, async (req, res) => {
  const { question, answer } = req.body;
  const result = await db.execute({ sql: 'INSERT INTO faq (question, answer) VALUES (?, ?)', args: [question, answer] });
  res.json({ id: result.lastInsertRowid });
});
app.put('/api/admin/faq/:id', requireAuth, async (req, res) => {
  const { question, answer } = req.body;
  await db.execute({ sql: 'UPDATE faq SET question = ?, answer = ? WHERE id = ?', args: [question, answer, req.params.id] });
  res.json({ success: true });
});
app.delete('/api/admin/faq/:id', requireAuth, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM faq WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});

// Feedback
app.get('/api/feedback', async (req, res) => {
  const result = await db.execute('SELECT * FROM feedback WHERE approved = 1 AND archived = 0');
  res.json(result.rows);
});
app.get('/api/admin/feedback', requireAuth, async (req, res) => {
  const result = await db.execute('SELECT * FROM feedback');
  res.json(result.rows);
});
app.post('/api/admin/feedback', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, review } = req.body;
    let image_url = null;
    if (req.file) {
      image_url = await uploadToCloudinary(req.file.buffer, 'feedback');
    }
    const result = await db.execute({ sql: 'INSERT INTO feedback (name, review, image_url, approved) VALUES (?, ?, ?, 1)', args: [name, review, image_url] });
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});
app.put('/api/admin/feedback/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, review } = req.body;
    if (req.file) {
      const image_url = await uploadToCloudinary(req.file.buffer, 'feedback');
      await db.execute({ sql: 'UPDATE feedback SET name = ?, review = ?, image_url = ? WHERE id = ?', args: [name, review, image_url, req.params.id] });
    } else {
      await db.execute({ sql: 'UPDATE feedback SET name = ?, review = ? WHERE id = ?', args: [name, review, req.params.id] });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});
app.put('/api/admin/feedback/:id/approve', requireAuth, async (req, res) => {
  await db.execute({ sql: 'UPDATE feedback SET approved = 1 WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});
app.put('/api/admin/feedback/:id/archive', requireAuth, async (req, res) => {
  const { archived } = req.body;
  await db.execute({ sql: 'UPDATE feedback SET archived = ? WHERE id = ?', args: [archived ? 1 : 0, req.params.id] });
  res.json({ success: true });
});
app.delete('/api/admin/feedback/:id', requireAuth, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM feedback WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});

// Requests
app.post('/api/requests', async (req, res) => {
  const { first_name, last_name, phone, email, service, message } = req.body;
  const result = await db.execute({ sql: 'INSERT INTO requests (first_name, last_name, phone, email, service, message) VALUES (?, ?, ?, ?, ?, ?)', args: [first_name, last_name, phone, email, service, message] });
  res.json({ id: result.lastInsertRowid });
});
app.get('/api/admin/requests', requireAuth, async (req, res) => {
  const result = await db.execute('SELECT * FROM requests ORDER BY created_at DESC');
  res.json(result.rows);
});
app.put('/api/admin/requests/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;
  await db.execute({ sql: 'UPDATE requests SET status = ? WHERE id = ?', args: [status, req.params.id] });
  res.json({ success: true });
});
app.put('/api/admin/requests/:id', requireAuth, async (req, res) => {
  const { first_name, last_name, phone, email, service, message } = req.body;
  await db.execute({ sql: 'UPDATE requests SET first_name = ?, last_name = ?, phone = ?, email = ?, service = ?, message = ? WHERE id = ?', args: [first_name, last_name, phone, email, service, message, req.params.id] });
  res.json({ success: true });
});
app.delete('/api/admin/requests/:id', requireAuth, async (req, res) => {
  await db.execute({ sql: 'DELETE FROM requests WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});

// Stats & Analytics
app.get('/api/admin/stats', requireAuth, async (req, res) => {
  const result = await db.execute("SELECT COUNT(*) as count FROM requests WHERE status = 'Pending'");
  res.json({ pendingRequests: result.rows[0].count });
});

// --- SITE SETTINGS (HOME IMAGES) ---
app.get('/api/settings', async (req, res) => {
  try {
    // Tablo yoksa otomatik oluşturur (ilk çalışmada)
    await db.execute('CREATE TABLE IF NOT EXISTS site_settings (setting_key TEXT PRIMARY KEY, setting_value TEXT)');
    const result = await db.execute('SELECT * FROM site_settings');
    const settings: Record<string, string> = {};
    result.rows.forEach((row: any) => { settings[row.setting_key] = row.setting_value; });
    res.json(settings);
  } catch (e) { 
    res.json({}); 
  }
});

app.post('/api/admin/settings', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { key } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    await db.execute('CREATE TABLE IF NOT EXISTS site_settings (setting_key TEXT PRIMARY KEY, setting_value TEXT)');
    const url = await uploadToCloudinary(req.file.buffer, 'settings');
    
    // Veritabanına kaydet veya varsa güncelle
    await db.execute({ 
      sql: 'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON CONFLICT(setting_key) DO UPDATE SET setting_value = ?', 
      args: [key, url, url] 
    });
    
    res.json({ success: true, url });
  } catch (error) {
    console.error('Settings upload error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

app.get('/api/admin/analytics', requireAuth, async (req, res) => {
  const { filter } = req.query; // 'day', 'month', 'year', 'all'
  
  let dateCondition = "";
  if (filter === 'day') dateCondition = "WHERE visit_date = CURRENT_DATE";
  else if (filter === 'month') dateCondition = "WHERE strftime('%Y-%m', visit_date) = strftime('%Y-%m', CURRENT_DATE)";
  else if (filter === 'year') dateCondition = "WHERE strftime('%Y', visit_date) = strftime('%Y', CURRENT_DATE)";
  
  const visitorsResult = await db.execute(`SELECT COUNT(DISTINCT ip) as unique_visitors, COUNT(ip) as total_visitors FROM visitors ${dateCondition}`);
  const visitors = visitorsResult.rows[0] as any;
  
  const blogStatsResult = await db.execute("SELECT SUM(likes) as total_likes, (SELECT COUNT(*) FROM blog_comments) as total_comments, COUNT(*) as total_posts FROM blog_posts");
  const blogStats = blogStatsResult.rows[0] as any;

  res.json({ 
    visitors: {
      total: visitors.total_visitors || 0,
      unique: visitors.unique_visitors || 0
    },
    blog: {
      totalPosts: blogStats.total_posts || 0,
      totalLikes: blogStats.total_likes || 0,
      totalComments: blogStats.total_comments || 0
    }
  });
});

export default app;
