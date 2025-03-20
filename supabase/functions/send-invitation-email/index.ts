// Follow this setup guide to integrate the Deno runtime into your Supabase project:
// https://supabase.com/docs/guides/functions/deno-runtime

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

    // In a real implementation, you would use a proper email service
    // For example, with SendGrid:
    // const apiKey = Deno.env.get('SENDGRID_API_KEY');
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email }] }],
    //     from: { email: 'noreply@yourdomain.com', name: 'Your Company' },
    //     subject: 'Welcome to Our Platform',
    //     content: [{ type: 'text/html', value: emailHtml }],
    //   }),
    // });

    // For this demo, we'll just log the email content and return success
    console.log(`Sending invitation email to ${email}`);
    console.log(
      `Subject: Welcome to Our Platform - Your Account Has Been Created`,
    );
    console.log(
      `Body: Hello ${name}, your account has been created with role: ${formattedRole}. Your temporary password is: ${password}. Please login at ${loginUrl} and change your password.`,
    );

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
