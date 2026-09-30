import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, LeadStatus, LeadType } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is required");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try { jwt.verify(token, jwtSecret); next(); }
  catch { return res.status(401).json({ message: "Invalid or expired session" }); }
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/leads", async (req, res) => {
  try {
    const { name, phone, location, lookingFor, type } = req.body ?? {};
    if (!name || !phone || !location || !lookingFor || !["BUY", "SELL"].includes(type))
      return res.status(400).json({ message: "Please provide all required lead details" });
    const lead = await prisma.lead.create({
      data: {
        name: String(name).trim(), phone: String(phone).trim(), location: String(location).trim(),
        lookingFor: String(lookingFor).trim(), type: type as LeadType,
        statusEvents: { create: { status: LeadStatus.NEW } }
      }
    });
    return res.status(201).json({ id: lead.id, message: "Lead received" });
  } catch { return res.status(500).json({ message: "Could not save lead" }); }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const admin = await prisma.adminUser.findUnique({ where: { email: String(email || "").trim().toLowerCase() } });
    if (!admin || !(await bcrypt.compare(String(password || ""), admin.passwordHash)))
      return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign({ sub: admin.id, role: admin.role }, jwtSecret, { expiresIn: "8h" });
    return res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch { return res.status(500).json({ message: "Login failed" }); }
});

app.get("/api/admin/leads", auth, async (_req, res) => {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { statusEvents: { orderBy: { createdAt: "asc" } } }
  });
  res.json(leads);
});

app.patch("/api/admin/leads/:id", auth, async (req, res) => {
  const { status, assignedTo, notes } = req.body ?? {};
  if (status && !Object.values(LeadStatus).includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const lead = await prisma.lead.update({
    where: { id: req.params.id },
    data: {
      ...(status ? { status } : {}),
      ...(assignedTo !== undefined ? { assignedTo: assignedTo || null } : {}),
      ...(notes !== undefined ? { notes: notes || null } : {}),
      ...(status ? { statusEvents: { create: { status, note: notes || undefined } } } : {})
    },
    include: { statusEvents: { orderBy: { createdAt: "asc" } } }
  });
  res.json(lead);
});

app.listen(port, () => console.log("JMD API running on http://localhost:" + port));
