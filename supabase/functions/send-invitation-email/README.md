# Send Invitation Email Function

## Overview
This Supabase Edge Function sends invitation emails to new users with their login credentials.

## Dependencies
The function has several email provider options that can be uncommented and configured based on your needs:

1. **SendGrid**
   - Import: `import { SendGridClient } from "https://deno.land/x/sendgrid@v2.0.0/mod.ts";`
   - Environment variable: `SENDGRID_API_KEY`

2. **Resend**
   - Import: `import { Resend } from "https://esm.sh/resend@1.0.0";`
   - Environment variable: `RESEND_API_KEY`

3. **SMTP**
   - Import: `import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";`
   - Environment variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`

## Setup Instructions

1. Choose your preferred email provider (SendGrid, Resend, or SMTP)
2. Uncomment the relevant import and implementation code in the function
3. Set the required environment variables in the Supabase dashboard:
   - Go to Project Settings > API > Edge Functions
   - Add the environment variables for your chosen email provider

## Usage
The function expects a JSON payload with the following fields:

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "password": "temporaryPassword123",
  "loginUrl": "https://yourdomain.com/login"
}
```

## Testing
You can test the function locally using the Supabase CLI:

```bash
supabase functions serve send-invitation-email --env-file .env.local
```

And then send a test request:

```bash
curl -X POST http://localhost:54321/functions/v1/send-invitation-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","role":"admin","password":"password123","loginUrl":"http://localhost:3000/login"}'
```
