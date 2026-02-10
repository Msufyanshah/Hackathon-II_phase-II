import { auth } from "@/lib/auth"; // double check this path
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);