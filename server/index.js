import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import multer from "multer";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "community-db.json");
const port = Number(process.env.API_PORT || 8787);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const jwtSecret = process.env.JWT_SECRET || "dev-only-change-this-secret";
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && jwtSecret === "dev-only-change-this-secret") {
  throw new Error("Set JWT_SECRET before running the API in production.");
}

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 4 },
  fileFilter: (_req, file, callback) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "application/pdf",
    ];
    callback(null, allowed.includes(file.mimetype));
  },
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(cors({ origin:clientOrigin, credentials:true }));
app.use(express.json({ limit:"350kb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs:15 * 60 * 1000, limit:300, standardHeaders:true, legacyHeaders:false }));

const authLimiter = rateLimit({ windowMs:15 * 60 * 1000, limit:25, standardHeaders:true, legacyHeaders:false });

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  password: z.string().min(8).max(160),
  role: z.string().max(80).default("Community Member"),
  location: z.string().max(100).default("Middletown, Delaware"),
  interests: z.array(z.string().max(50)).max(12).default([]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const postSchema = z.object({
  text: z.string().max(2000).default(""),
  category: z.string().max(80).default("Resource Tip"),
  attachments: z.array(z.object({
    name: z.string().max(180),
    type: z.enum(["image", "video", "file"]),
    url: z.string().max(250000),
    mime: z.string().max(120).optional(),
  })).max(4).default([]),
});

const commentSchema = z.object({
  text: z.string().min(1).max(500),
});

const eventRegistrationSchema = z.object({
  attendee: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email().max(160),
  }),
  event: z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string().min(1).max(160),
    date: z.string().min(1).max(80),
    time: z.string().min(1).max(80),
    location: z.string().min(1).max(180),
    desc: z.string().max(1200).default(""),
    category: z.string().max(80).optional(),
  }),
});

async function ensureDb() {
  await fs.mkdir(dataDir, { recursive:true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({ users:[], posts:[] }, null, 2));
  }
}

async function readDb() {
  await ensureDb();
  return JSON.parse(await fs.readFile(dbPath, "utf8"));
}

async function writeDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function setAuthCookie(res, user) {
  const token = jwt.sign({ sub:user.id, email:user.email }, jwtSecret, { expiresIn:"7d" });
  res.cookie("cc_session", token, {
    httpOnly:true,
    sameSite:"lax",
    secure:isProduction,
    maxAge:7 * 24 * 60 * 60 * 1000,
  });
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.cc_session;
    if (!token) return res.status(401).json({ error:"Authentication required." });

    const decoded = jwt.verify(token, jwtSecret);
    const db = await readDb();
    const user = db.users.find(account => account.id === decoded.sub);
    if (!user) return res.status(401).json({ error:"Session user not found." });

    req.user = user;
    req.db = db;
    next();
  } catch {
    res.status(401).json({ error:"Invalid session." });
  }
}

function createTransport() {
  const smtpReady = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  if (!smtpReady) {
    return {
      mode: "preview",
      transporter: nodemailer.createTransport({ jsonTransport:true }),
    };
  }

  return {
    mode: "sent",
    transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok:true, service:"community-compass-api" });
});

app.post("/api/auth/signup", authLimiter, async (req, res) => {
  const payload = signupSchema.parse(req.body);
  const db = await readDb();
  const email = payload.email.toLowerCase();

  if (db.users.some(user => user.email === email)) {
    return res.status(409).json({ error:"An account already exists for that email." });
  }

  const user = {
    id:nanoid(),
    name:payload.name,
    email,
    passwordHash:await bcrypt.hash(payload.password, 12),
    role:payload.role,
    location:payload.location,
    interests:payload.interests,
    avatarGradient:"linear-gradient(135deg, #0B1F3A, #1D9E75)",
    createdAt:new Date().toISOString(),
  };

  db.users.push(user);
  await writeDb(db);
  setAuthCookie(res, user);
  res.status(201).json({ user:publicUser(user) });
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const db = await readDb();
  const user = db.users.find(account => account.email === payload.email.toLowerCase());

  if (!user || !(await bcrypt.compare(payload.password, user.passwordHash))) {
    return res.status(401).json({ error:"Invalid email or password." });
  }

  setAuthCookie(res, user);
  res.json({ user:publicUser(user) });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("cc_session");
  res.json({ ok:true });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user:publicUser(req.user) });
});

app.get("/api/community/posts", async (_req, res) => {
  const db = await readDb();
  res.json({ posts:db.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

app.post("/api/community/posts", requireAuth, async (req, res) => {
  const payload = postSchema.parse(req.body);
  if (!payload.text.trim() && payload.attachments.length === 0) {
    return res.status(400).json({ error:"A post needs text or media." });
  }

  const post = {
    id:nanoid(),
    authorId:req.user.id,
    authorName:req.user.name,
    authorRole:req.user.role,
    avatarGradient:req.user.avatarGradient,
    category:payload.category,
    text:payload.text.trim(),
    attachments:payload.attachments,
    likedBy:[],
    comments:[],
    createdAt:new Date().toISOString(),
  };

  req.db.posts.push(post);
  await writeDb(req.db);
  res.status(201).json({ post });
});

app.post("/api/community/posts/:postId/like", requireAuth, async (req, res) => {
  const post = req.db.posts.find(item => item.id === req.params.postId);
  if (!post) return res.status(404).json({ error:"Post not found." });

  post.likedBy = post.likedBy.includes(req.user.id)
    ? post.likedBy.filter(id => id !== req.user.id)
    : [...post.likedBy, req.user.id];

  await writeDb(req.db);
  res.json({ post });
});

app.post("/api/community/posts/:postId/comments", requireAuth, async (req, res) => {
  const payload = commentSchema.parse(req.body);
  const post = req.db.posts.find(item => item.id === req.params.postId);
  if (!post) return res.status(404).json({ error:"Post not found." });

  const comment = {
    id:nanoid(),
    authorName:req.user.name,
    text:payload.text.trim(),
    createdAt:new Date().toISOString(),
  };

  post.comments.push(comment);
  await writeDb(req.db);
  res.status(201).json({ comment });
});

app.post("/api/community/uploads", requireAuth, upload.array("media", 4), (req, res) => {
  const files = (req.files || []).map(file => ({
    id:nanoid(),
    name:file.originalname,
    mime:file.mimetype,
    size:file.size,
    type:file.mimetype.startsWith("image/") ? "image" : file.mimetype.startsWith("video/") ? "video" : "file",
    url:`data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
  }));
  res.status(201).json({ files });
});

app.post("/api/registrations/events", async (req, res) => {
  const payload = eventRegistrationSchema.parse(req.body);
  const { transporter, mode } = createTransport();
  const from = process.env.MAIL_FROM || "Community Compass <no-reply@communitycompass.local>";
  const subject = `Community Compass registration: ${payload.event.title}`;
  const text = [
    `Hi ${payload.attendee.name},`,
    "",
    `You registered for ${payload.event.title}.`,
    `Date: ${payload.event.date}`,
    `Time: ${payload.event.time}`,
    `Location: ${payload.event.location}`,
    "",
    payload.event.desc,
    "",
    "Community Compass",
  ].join("\n");

  const info = await transporter.sendMail({
    from,
    to:payload.attendee.email,
    subject,
    text,
    html:`
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#102033">
        <h2 style="color:#0B1F3A">You registered for ${payload.event.title}</h2>
        <p><strong>Date:</strong> ${payload.event.date}</p>
        <p><strong>Time:</strong> ${payload.event.time}</p>
        <p><strong>Location:</strong> ${payload.event.location}</p>
        <p>${payload.event.desc}</p>
        <p style="color:#647084;font-size:13px">Sent by Community Compass.</p>
      </div>
    `,
  });

  res.json({ ok:true, mode, messageId:info.messageId });
});

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error:"Invalid request data.", details:error.flatten() });
  }
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error:"File is too large." });
  }
  console.error(error);
  res.status(500).json({ error:"Server error." });
});

await ensureDb();
app.listen(port, () => {
  console.log(`Community Compass API running at http://localhost:${port}`);
});
