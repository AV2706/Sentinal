# CreatorBridge

## Run locally

```bash
npm install
npm run dev
```

The Vite development server includes the authentication API at `/api/auth`.

## Build and deploy

```bash
npm run build
npm start
```

The production server serves `dist/` and exposes:

- `POST /api/auth/signup`
- `POST /api/auth/signin`

User accounts are stored in `server/data/users.json`, which is intentionally
ignored by Git. Set a persistent writable volume for that directory when
deploying. For multi-instance production deployments, replace this file store
with a shared database and session store.

Authentication passwords are hashed with Node's built-in `scrypt`; plaintext
passwords are never written to disk.