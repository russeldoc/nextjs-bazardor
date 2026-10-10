export function safeNextPath(path: string | null | undefined) {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : "/";
}
