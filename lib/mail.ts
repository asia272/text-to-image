import { env } from "@/lib/env";

async function sendMail(to: string, subject: string, html: string) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": env("BREVO_API_KEY"),
            "content-type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            sender: { name: env("MAIL_FROM_NAME"), email: env("MAIL_FROM_EMAIL") },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }),
    });

    if (!res.ok) {
        throw new Error(`Brevo error ${res.status}: ${await res.text()}`);
    }
}

export async function sendVerificationEmail(to: string, token: string) {
    const url = `${env("NEXT_PUBLIC_APP_URL")}/verify-email?token=${encodeURIComponent(token)}`;
    await sendMail(
        to,
        "Verify your email",
        `<div style="font-family:Arial,sans-serif;max-width:480px">
       <h2>Welcome!</h2>
       <p>Click the button below to verify your email. This link expires in 24 hours.</p>
       <p><a href="${url}" style="background:#7648ff;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;display:inline-block">Verify email</a></p>
       <p style="color:#666;font-size:12px">If you did not create an account, you can ignore this email.</p>
     </div>`,
    );
}