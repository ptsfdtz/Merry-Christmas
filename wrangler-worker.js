export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // === Handle CORS preflight ===
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // === Auth Endpoint - 登录验证 ===
    if (path === "/api/auth" && request.method === "POST") {
      let data;
      try {
        data = await request.json();
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
      }

      const { password } = data;
      const correctPassword = env.AUTH_PASSWORD || "Merry@Christmas#2025!";

      if (password === correctPassword) {
        return new Response(
          JSON.stringify({
            success: true,
            token: btoa(`${Date.now()}:${password}`),
            message: "Authentication successful",
          }),
          {
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid password" }),
          {
            status: 401,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    // === Email Endpoint - 需要认证的邮件服务 ===
    if (path === "/api/send-email" && request.method === "POST") {
      // 验证授权令牌
      const authHeader = request.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Unauthorized - missing token" }),
          {
            status: 401,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
      }

      const token = authHeader.substring(7);

      if (!token) {
        return new Response(
          JSON.stringify({ error: "Unauthorized - invalid token" }),
          {
            status: 401,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
      }

      // === Parse JSON body ===
      let data;
      try {
        data = await request.json();
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
      }

      const { to, subject, html } = data;

      if (!to || !subject || !html) {
        return new Response(
          JSON.stringify({ error: "to, subject, html are required" }),
          {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
      }

      // === Send to Resend ===
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.MAIL_FROM,
          to,
          subject,
          html,
        }),
      });

      const text = await resendRes.text();
      let json;

      try {
        json = JSON.parse(text);
      } catch {
        json = { result: text };
      }

      return new Response(JSON.stringify(json), {
        status: resendRes.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // === 404 ===
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  },
};
