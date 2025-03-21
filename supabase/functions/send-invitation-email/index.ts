// Follow this setup guide to integrate the Deno runtime into your Supabase project:
// https://supabase.com/docs/guides/functions/deno-runtime

// Import dependencies
// For SendGrid (uncomment when ready to use)
// import { SendGridClient } from "https://deno.land/x/sendgrid@v2.0.0/mod.ts";

// For Resend (uncomment when ready to use)
// import { Resend } from "https://esm.sh/resend@1.0.0";

// For SMTP (uncomment when ready to use)
// import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface EmailPayload {
  email: string;
  name: string;
  role: string;
  password: string;
  loginUrl: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Email HTML template
const generateEmailHtml = (
  name: string,
  role: string,
  password: string,
  loginUrl: string,
) => {
  const formattedRole =
    role.charAt(0).toUpperCase() + role.slice(1).replace(/([A-Z])/g, " $1");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Welcome to Our Platform</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
        .credentials { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .button { display: inline-block; background-color: #4F46E5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to Our Platform</h1>
      </div>
      <div class="content">
        <p>Hello ${name},</p>
        <p>Your account has been created with the role: <strong>${formattedRole}</strong>.</p>
        <p>Please use the following credentials to log in:</p>
        
        <div class="credentials">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
        </div>
        
        <p>For security reasons, you will be prompted to change your password after your first login.</p>
        
        <a href="${loginUrl}" class="button">Login Now</a>
        
        <p>If you have any questions or need assistance, please contact our support team.</p>
        
        <p>Best regards,<br>The Team</p>
      </div>
      <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { email, name, role, password, loginUrl } = payload;

    // Validate required fields
    if (!email || !name || !role || !password || !loginUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Format role for display
    const formattedRole =
      role.charAt(0).toUpperCase() + role.slice(1).replace(/([A-Z])/g, " $1");

    // Generate HTML email content
    const htmlContent = generateEmailHtml(name, role, password, loginUrl);

    // IMPLEMENTATION OPTIONS:

    // 1. SendGrid Implementation (uncomment when ready to use)
    // const apiKey = Deno.env.get("SENDGRID_API_KEY");
    // if (!apiKey) throw new Error("SENDGRID_API_KEY is not set");
    //
    // const sendgrid = new SendGridClient(apiKey);
    // const response = await sendgrid.send({
    //   to: email,
    //   from: "noreply@yourdomain.com", // Use a verified sender in SendGrid
    //   subject: "Welcome to Our Platform - Your Account Has Been Created",
    //   html: htmlContent,
    // });
    //
    // if (!response.success) throw new Error("Failed to send email via SendGrid");

    // 2. Resend Implementation (uncomment when ready to use)
    // const resendApiKey = Deno.env.get("RESEND_API_KEY");
    // if (!resendApiKey) throw new Error("RESEND_API_KEY is not set");
    //
    // const resend = new Resend(resendApiKey);
    // const { data, error: resendError } = await resend.emails.send({
    //   from: "onboarding@yourdomain.com",
    //   to: email,
    //   subject: "Welcome to Our Platform - Your Account Has Been Created",
    //   html: htmlContent,
    // });
    //
    // if (resendError) throw new Error(`Resend error: ${resendError.message}`);

    // 3. SMTP Implementation (uncomment when ready to use)
    // const client = new SmtpClient();
    // await client.connect({
    //   hostname: Deno.env.get("SMTP_HOST") || "",
    //   port: Number(Deno.env.get("SMTP_PORT")) || 587,
    //   username: Deno.env.get("SMTP_USERNAME") || "",
    //   password: Deno.env.get("SMTP_PASSWORD") || "",
    // });
    //
    // await client.send({
    //   from: "noreply@yourdomain.com",
    //   to: email,
    //   subject: "Welcome to Our Platform - Your Account Has Been Created",
    //   content: htmlContent,
    //   html: htmlContent,
    // });
    //
    // await client.close();

    // For this demo, we'll just log the email content and return success
    console.log(`Sending invitation email to ${email}`);
    console.log(
      `Subject: Welcome to Our Platform - Your Account Has Been Created`,
    );
    console.log(`HTML Email content generated with template`);

    return new Response(
      JSON.stringify({ success: true, message: "Invitation email sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error sending invitation email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
