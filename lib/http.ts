import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public code?: string,
    ) {
        super(message);
    }
}

export function handleError(error: unknown) {
    if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    if (error instanceof ZodError) {
        return NextResponse.json(
            { error: error.issues[0]?.message ?? "Invalid input", code: "INVALID_INPUT" },
            { status: 400 },
        );
    }
    console.error(error);
    return NextResponse.json({ error: "Something went wrong", code: "SERVER_ERROR" }, { status: 500 });
}

export function getClientIp(req: Request): string {
    return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}