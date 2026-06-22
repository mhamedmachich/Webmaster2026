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
const clientDistDir = path.join(__dirname, "..", "dist");
const clientIndexPath = path.join(clientDistDir, "index.html");
const port = Number(process.env.API_PORT || 8787);
const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);
const jwtSecret = process.env.JWT_SECRET || "dev-only-change-this-secret";
const isProduction = process.env.NODE_ENV === "production";
const hasClientBuild = await fs.access(clientIndexPath).then(() => true).catch(() => false);

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
app.use(cors({
  origin(origin, callback) {
    if (!origin || clientOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS."));
  },
  credentials:true,
}));
app.use(express.json({ limit:"350kb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs:15 * 60 * 1000, limit:300, standardHeaders:true, legacyHeaders:false }));

const authLimiter = rateLimit({ windowMs:15 * 60 * 1000, limit:25, standardHeaders:true, legacyHeaders:false });
const writeLimiter = rateLimit({ windowMs:60 * 1000, limit:60, standardHeaders:true, legacyHeaders:false });

const BOT_USERS = [
  {
    id:"bot-resource-navigator",
    name:"Avery Compass",
    email:"avery@communitycompass.local",
    handle:"averycompass",
    role:"Verified Resource Navigator",
    location:"Middletown, Delaware",
    bio:"Sharing verified resource updates, service reminders, and local support tips.",
    interests:["Resources", "Housing", "Food"],
    avatarImage:"/avatars/avatar-1.svg",
    bannerGradient:"linear-gradient(135deg, #0B1F3A, #1D9E75 58%, #EF9F27)",
    accentColor:"#1D9E75",
    emailVerified:true,
    verified:true,
    isBot:true,
    createdAt:new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id:"bot-volunteer-lead",
    name:"Maya Service",
    email:"maya@communitycompass.local",
    handle:"mayaservice",
    role:"Verified Volunteer Lead",
    location:"New Castle County",
    bio:"Posting volunteer openings, service recaps, and student leadership opportunities.",
    interests:["Volunteering", "Events", "Students"],
    avatarImage:"/avatars/avatar-2.svg",
    bannerGradient:"linear-gradient(135deg, #534AB7, #378ADD)",
    accentColor:"#378ADD",
    emailVerified:true,
    verified:true,
    isBot:true,
    createdAt:new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
  },
  {
    id:"bot-student-hub",
    name:"Jordan Student Hub",
    email:"jordan@communitycompass.local",
    handle:"studenthub",
    role:"Verified Student Support",
    location:"Appoquinimink Area",
    bio:"Highlighting tutoring, library spaces, school support, and youth programs.",
    interests:["Student Support", "Tutoring", "Youth"],
    avatarImage:"/avatars/avatar-3.svg",
    bannerGradient:"linear-gradient(135deg, #EF9F27, #D85A30)",
    accentColor:"#EF9F27",
    emailVerified:true,
    verified:true,
    isBot:true,
    createdAt:new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
  },
];

const BOT_MESSAGES = [
  ["Resource update", "Food Bank of Delaware remains a strong first stop for pantry-style support. Use the Resource Finder to compare food, SNAP, and family support listings."],
  ["Volunteer win", "A local service team filled several event roles this week. If you want to help, check Volunteering and filter for roles that match your availability."],
  ["Student support", "Library learning spaces are useful when students need Wi-Fi, quiet study areas, public computers, or youth programs after school."],
  ["Event recap", "Resume workshops are one of the clearest ways to turn community support into action. Save events you care about so they appear in your action plan."],
  ["Question", "What resource category should Community Compass expand next: childcare, transportation, disability services, or veteran support?"],
];

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  password: z.string().min(8).max(160),
  role: z.string().max(80).default("Community Member"),
  location: z.string().max(100).default("Middletown, Delaware"),
  interests: z.array(z.string().max(50)).max(12).default([]),
});

const profileSchema = z.object({
  name: z.string().min(2).max(80),
  handle: z.string().min(2).max(24).regex(/^[a-z0-9_]+$/),
  role: z.string().max(80).default("Community Member"),
  location: z.string().max(100).default("Middletown, Delaware"),
  bio: z.string().max(220).default(""),
  website: z.string().max(180).default(""),
  interests: z.array(z.string().max(50)).max(12).default([]),
  avatarImage: z.string().max(250000).default(""),
  avatarGradient: z.string().max(120).default("linear-gradient(135deg, #0B1F3A, #1D9E75)"),
  bannerImage: z.string().max(250000).default(""),
  bannerGradient: z.string().max(160).default("linear-gradient(135deg, #0B1F3A, #1D9E75 58%, #EF9F27)"),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#1D9E75"),
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
    await fs.writeFile(dbPath, JSON.stringify({ users:[], posts:[], meta:{} }, null, 2));
  }
  const db = JSON.parse(await fs.readFile(dbPath, "utf8"));
  db.users ||= [];
  db.posts ||= [];
  db.meta ||= {};
  let changed = false;
  for (const bot of BOT_USERS) {
    if (!db.users.some(user => user.id === bot.id)) {
      db.users.push({ ...bot, passwordHash:"bot-account" });
      changed = true;
    }
  }
  if (db.posts.length === 0) {
    db.posts.push(...BOT_MESSAGES.slice(0, 3).map(([category, text], index) => {
      const bot = BOT_USERS[index % BOT_USERS.length];
      return buildPost(bot, { category, text, attachments:[] }, Date.now() - (index + 1) * 1000 * 60 * 18);
    }));
    changed = true;
  }
  if (changed) await writeDb(db);
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

function makeHandle(name, email) {
  const base = (name || email.split("@")[0] || "member").toLowerCase().replace(/[^a-z0-9_]+/g, "").slice(0, 20);
  return base || "member";
}

function buildPost(user, payload, timestamp = Date.now()) {
  return {
    id:nanoid(),
    authorId:user.id,
    authorName:user.name,
    authorHandle:user.handle || makeHandle(user.name, user.email || "member@example.com"),
    authorRole:user.role,
    avatarGradient:user.avatarGradient,
    avatarImage:user.avatarImage || "",
    accentColor:user.accentColor || "#1D9E75",
    verified:Boolean(user.emailVerified || user.verified),
    isBot:Boolean(user.isBot),
    category:payload.category,
    text:payload.text.trim(),
    attachments:payload.attachments || [],
    likedBy:[],
    comments:[],
    createdAt:new Date(timestamp).toISOString(),
  };
}

function maybeAddBotPost(db) {
  const lastBotPost = db.posts
    .filter(post => post.isBot)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const enoughTimePassed = !lastBotPost || Date.now() - new Date(lastBotPost.createdAt).getTime() > 1000 * 45;
  if (!enoughTimePassed) return false;
  const index = Number(db.meta.botIndex || 0);
  const [category, text] = BOT_MESSAGES[index % BOT_MESSAGES.length];
  const bot = BOT_USERS[index % BOT_USERS.length];
  db.posts.push(buildPost(bot, { category, text, attachments:[] }));
  db.meta.botIndex = index + 1;
  return true;
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
  res.json({ ok:true, service:"community-compass-api", client:hasClientBuild });
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
    handle:makeHandle(payload.name, email),
    passwordHash:await bcrypt.hash(payload.password, 12),
    role:payload.role,
    location:payload.location,
    bio:"Exploring local resources and community opportunities.",
    website:"",
    interests:payload.interests,
    avatarGradient:"linear-gradient(135deg, #0B1F3A, #1D9E75)",
    avatarImage:"/avatars/avatar-default.svg",
    bannerGradient:"linear-gradient(135deg, #0B1F3A, #1D9E75 58%, #EF9F27)",
    bannerImage:"",
    accentColor:"#1D9E75",
    emailVerified:false,
    verified:false,
    isBot:false,
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
  if (maybeAddBotPost(db)) await writeDb(db);
  res.json({ posts:db.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

app.patch("/api/users/me/profile", writeLimiter, requireAuth, async (req, res) => {
  const payload = profileSchema.parse(req.body);
  const handleTaken = req.db.users.some(user => user.id !== req.user.id && user.handle === payload.handle);
  if (handleTaken) return res.status(409).json({ error:"That handle is already taken." });

  Object.assign(req.user, payload);
  await writeDb(req.db);
  res.json({ user:publicUser(req.user) });
});

app.post("/api/auth/verify-email", writeLimiter, requireAuth, async (req, res) => {
  req.user.emailVerified = true;
  req.user.verified = true;
  await writeDb(req.db);
  res.json({ user:publicUser(req.user), verified:true });
});

app.post("/api/community/posts", writeLimiter, requireAuth, async (req, res) => {
  const payload = postSchema.parse(req.body);
  if (!payload.text.trim() && payload.attachments.length === 0) {
    return res.status(400).json({ error:"A post needs text or media." });
  }

  const post = buildPost(req.user, payload);

  req.db.posts.push(post);
  await writeDb(req.db);
  res.status(201).json({ post });
});

app.post("/api/community/posts/:postId/like", writeLimiter, requireAuth, async (req, res) => {
  const post = req.db.posts.find(item => item.id === req.params.postId);
  if (!post) return res.status(404).json({ error:"Post not found." });

  post.likedBy = post.likedBy.includes(req.user.id)
    ? post.likedBy.filter(id => id !== req.user.id)
    : [...post.likedBy, req.user.id];

  await writeDb(req.db);
  res.json({ post });
});

app.post("/api/community/posts/:postId/comments", writeLimiter, requireAuth, async (req, res) => {
  const payload = commentSchema.parse(req.body);
  const post = req.db.posts.find(item => item.id === req.params.postId);
  if (!post) return res.status(404).json({ error:"Post not found." });

  const comment = {
    id:nanoid(),
    authorName:req.user.name,
    authorHandle:req.user.handle,
    verified:Boolean(req.user.emailVerified || req.user.verified),
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

if (hasClientBuild) {
  app.use(express.static(clientDistDir));
  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(clientIndexPath);
  });
}

app.use((error, _req, res, _next) => {
  if (error.message === "Origin not allowed by CORS.") {
    return res.status(403).json({ error:"Origin not allowed." });
  }
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
