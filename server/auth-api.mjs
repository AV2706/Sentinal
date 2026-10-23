import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const dataPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "data",
  "users.json",
)
const sessions = new Map()

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf8"))
  } catch (error) {
    if (error.code !== "ENOENT") throw error
    return []
  }
}

function writeUsers(users) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true })
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2) + "\n")
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error)
      else resolve(`${salt}:${derivedKey.toString("hex")}`)
    })
  })
}

function verifyPassword(password, storedHash) {
  const [salt, expected] = storedHash.split(":")
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error)
      else {
        const actual = derivedKey.toString("hex")
        resolve(
          expected.length === actual.length &&
            crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual)),
        )
      }
    })
  })
}

function json(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  })
  res.end(JSON.stringify(payload))
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk
      if (body.length > 10_000) {
        reject(new Error("Request body is too large"))
        req.destroy()
      }
    })
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"))
      } catch {
        reject(new Error("Request body must be valid JSON"))
      }
    })
    req.on("error", reject)
  })
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function handleAuthRequest(req, res) {
  const url = new URL(req.url, "http://localhost")
  if (!url.pathname.startsWith("/api/auth/")) return false
  if (req.method !== "POST") {
    json(res, 405, { error: "Method not allowed" })
    return true
  }

  try {
    const input = await parseBody(req)
    const email = String(input.email || "").trim().toLowerCase()
    const password = String(input.password || "")
    const role = input.role === "creator" ? "creator" : "business"
    if (!email || !email.includes("@") || password.length < 8) {
      json(res, 400, { error: "Enter a valid email and a password of at least 8 characters." })
      return true
    }

    const users = readUsers()
    if (url.pathname === "/api/auth/signup") {
      const name = String(input.name || "").trim()
      if (!name) {
        json(res, 400, { error: "Name is required to create an account." })
        return true
      }
      if (users.some((user) => user.email === email)) {
        json(res, 409, { error: "An account with this email already exists." })
        return true
      }
      const user = {
        id: crypto.randomUUID(),
        name,
        email,
        role,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
      }
      users.push(user)
      writeUsers(users)
      const token = crypto.randomBytes(32).toString("hex")
      sessions.set(token, user.id)
      json(res, 201, { token, user: publicUser(user) })
      return true
    }

    if (url.pathname === "/api/auth/signin") {
      const user = users.find((candidate) => candidate.email === email)
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        json(res, 401, { error: "Email or password is incorrect." })
        return true
      }
      const token = crypto.randomBytes(32).toString("hex")
      sessions.set(token, user.id)
      json(res, 200, { token, user: publicUser(user) })
      return true
    }

    json(res, 404, { error: "Authentication route not found." })
  } catch (error) {
    console.error("Authentication request failed", error)
    json(res, 500, { error: "Authentication is temporarily unavailable." })
  }
  return true
}

export function getSessionUser(token) {
  const userId = sessions.get(token)
  return userId ? readUsers().find((user) => user.id === userId) : null
}
