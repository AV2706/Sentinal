import type { IncomingMessage, ServerResponse } from "node:http"

export function handleAuthRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean>

export function getSessionUser(token: string): unknown
