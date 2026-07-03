export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const securityHeaders = {
      "Content-Security-Policy": [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        "object-src 'none'",
        "img-src 'self' data:",
        "script-src 'self' 'sha256-U7qyfD13yUnmUxqS39zUsYPHGdaFu3WKz6Zg9tzOUuU=' 'sha256-10cAHQyTpbKBxUCnWpyQA1p4eI1x9ocho6xooIfvAQI=' 'sha256-1s/VkvvNRqLu8DcTDMirQ0LpKaGcupvcRN4PqbEYk+E=' 'sha256-ytZpEug61vJoDuTgfkTAu8z6NxvdzgO1b37KyiYrwjg=' 'sha256-t3m+liQ1dBKz32EsJcWPPjQ7YH8rnJLxqGhVMe1ZWto=' 'sha256-ElBGhLH3wc0gVz6rJw8e2RTA0w4BHzZ96Lr9jG9goEs=' 'sha256-rnnZ2qHBiey+E7FMSNiieqtYkJNhZP3zk32MTLjnDdo=' 'sha256-5cs/twmeT9Ic2CCWBNvC7Ma5AbTQHDHTKOirsCnYlVw=' 'sha256-8jE4hAzOA8QLt7/IiOYNf5aHf1Ap/9gWWGxOgawAYn0=' 'sha256-h8LUEezhttz4c4gdY457PbJ5SAvUYXBdHfKtn1JO9yg=' 'sha256-3csvI4wESiHzrXeehDRmre+GU6nD3IVWnGS291a44lM=' https://static.cloudflareinsights.com",
        "script-src-attr 'none'",
        "style-src 'self'",
        "style-src-attr 'none'",
        "font-src 'self'",
        "manifest-src 'self'",
        "frame-src 'none'",
        "media-src 'none'",
        "worker-src 'none'",
        "connect-src 'self' https://cloudflareinsights.com",
        "upgrade-insecure-requests",
      ].join("; "),
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Permitted-Cross-Domain-Policies": "none",
    };
    const withSecurityHeaders = (response) => {
      const headers = new Headers(response.headers);
      headers.delete("Access-Control-Allow-Origin");
      Object.entries(securityHeaders).forEach(([name, value]) => {
        headers.set(name, value);
      });
      const contentType = headers.get("Content-Type") || "";
      if (
        contentType.includes("text/html") ||
        contentType.includes("text/plain") ||
        contentType.includes("application/manifest+json") ||
        contentType.includes("application/xml")
      ) {
        headers.set("Content-Language", "zh-Hant-TW");
      }
      if (response.status === 404 || url.pathname === "/404.html") {
        headers.set("X-Robots-Tag", "noindex, nofollow");
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    };
    const redirect = (target) => withSecurityHeaders(Response.redirect(target, 301));

    if (url.hostname === "www.twvita.com.tw") {
      url.hostname = "twvita.com.tw";
      return redirect(url.toString());
    }

    if (url.pathname === "/404" || url.pathname === "/404.html") {
      const notFoundUrl = new URL("/404", url);
      const notFoundAsset = await env.ASSETS.fetch(new Request(notFoundUrl, request));
      const headers = new Headers(notFoundAsset.headers);
      headers.set("Content-Type", "text/html; charset=utf-8");
      headers.set("Cache-Control", "no-store");
      return withSecurityHeaders(new Response(notFoundAsset.body, {
        status: 404,
        statusText: "Not Found",
        headers,
      }));
    }

    if (url.pathname === "/robots.txt") {
      const response = await env.ASSETS.fetch(request);
      const headers = new Headers(response.headers);
      headers.set("Content-Type", "text/plain; charset=utf-8");
      headers.set("Cache-Control", "public, max-age=3600, must-revalidate, no-transform");
      return withSecurityHeaders(new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      }));
    }

    const htmlRedirects = new Map([
      ["/index.html", "/"],
      ["/about.html", "/about"],
      ["/roof-waterproofing.html", "/roof-waterproofing"],
      ["/tank-pool-waterproofing.html", "/tank-pool-waterproofing"],
      ["/projects.html", "/projects"],
      ["/contact.html", "/contact"],
    ]);
    const canonicalPath = htmlRedirects.get(url.pathname);
    if (canonicalPath) {
      url.pathname = canonicalPath;
      return redirect(url.toString());
    }

    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.replace(/\/+$/, "");
      return redirect(url.toString());
    }

    if (url.pathname === "/assets/styles.css" || /^\/assets\/styles-20260617-audit(?:6[2-9]|7[0-9]|8[0-9]|9[0-5])\.css$/.test(url.pathname)) {
      return withSecurityHeaders(new Response("Not found", {
        status: 404,
        headers: {
          "Cache-Control": "public, max-age=0, must-revalidate, no-transform",
          "Content-Type": "text/plain; charset=utf-8",
        },
      }));
    }

    const response = await env.ASSETS.fetch(request);
    const lastSegment = url.pathname.split("/").pop() || "";
    if (response.status === 200 && url.pathname !== "/" && !lastSegment.includes(".")) {
      const headers = new Headers(response.headers);
      headers.set("Content-Type", "text/html; charset=utf-8");
      return withSecurityHeaders(new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      }));
    }

    return withSecurityHeaders(response);
  },
};
