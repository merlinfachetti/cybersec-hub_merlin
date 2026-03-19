import { redirect } from 'next/navigation';

// Swagger UI is served as a static HTML file at /docs/api.html
// This avoids Next.js App Router issues with external scripts
export default function ApiDocsPage() {
  redirect('/docs/api.html');
}
