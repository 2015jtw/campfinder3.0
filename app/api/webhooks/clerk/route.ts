// app/api/webhooks/clerk/route.ts
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // Get the webhook secret from your environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the event type
  const eventType = evt.type;

  // Initialize Supabase client
  const supabase = createRouteHandlerClient({ cookies });

  if (eventType === "user.created") {
    // Extract relevant user data from Clerk webhook payload
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    try {
      // Insert the new user into your Supabase users table
      const { error } = await supabase.from("users").insert([
        {
          clerk_id: id,
          email: primaryEmail,
          first_name: first_name || null,
          last_name: last_name || null,
          avatar_url: image_url || null,
        },
      ]);

      if (error) throw error;

      return new Response("User successfully created in Supabase", {
        status: 200,
      });
    } catch (error) {
      console.error("Error creating user in Supabase:", error);
      return new Response("Error creating user in Supabase", {
        status: 500,
      });
    }
  }

  return new Response("Webhook received", {
    status: 200,
  });
}
