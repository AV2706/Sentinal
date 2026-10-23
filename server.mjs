import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { handleAuthRequest } from "./server/auth-api.mjs"

const root = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(root, "dist")
const port = Number(process.env.PORT || 8443)
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
}

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith("/api/auth/")) {
    await handleAuthRequest(req, res)
    return
  }
  const requestPath = new URL(req.url || "/", `http://${req.headers.host}`).pathname
  const relativePath = requestPath === "/" ? "index.html" : requestPath.slice(1)
  const filePath = path.resolve(dist, relativePath)
  const relativeToDist = path.relative(dist, filePath)
  const safePath =
    relativeToDist && !relativeToDist.startsWith("..") && !path.isAbsolute(relativeToDist)
      ? filePath
      : path.join(dist, "index.html")
  const target = fs.existsSync(safePath) && fs.statSync(safePath).isFile() ? safePath : path.join(dist, "index.html")
  res.writeHead(200, { "Content-Type": mimeTypes[path.extname(target)] || "text/plain; charset=utf-8" })
  fs.createReadStream(target).pipe(res)
})

server.listen(port, "0.0.0.0", () => {
  console.log(`CreatorBridge is running at http://localhost:${port}`)
})
