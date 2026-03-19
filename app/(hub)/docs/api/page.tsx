export default function ApiDocsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.14em', marginBottom: 8 }}>
            DOCS / API
          </div>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 24, color: '#e6eef8', marginBottom: 4 }}>
            API Reference
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(155,176,198,0.5)' }}>
            Documentação interativa dos endpoints REST do CYBERSEC LAB
          </p>
        </div>
      </div>

      {/* Swagger UI via CDN */}
      <div id="swagger-ui" style={{ minHeight: '80vh' }} />

      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var script = document.createElement('script');
              script.src = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js';
              script.onload = function() {
                SwaggerUIBundle({
                  url: '/swagger.json',
                  dom_id: '#swagger-ui',
                  presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
                  layout: 'BaseLayout',
                  deepLinking: true,
                  theme: 'dark',
                });
              };
              document.body.appendChild(script);
            })();
          `
        }}
      />
    </div>
  );
}
