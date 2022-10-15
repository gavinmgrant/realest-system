export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/xml");

  // Instructing the Vercel edge to cache the file
  res.setHeader("Cache-control", "stale-while-revalidate, s-maxage=3600");

  // generate sitemap here
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    <url>
      <loc>http://www.realestsystem.com/</loc>
      <priority>1.0</priority>
      <lastmod>2022-10-14</lastmod>
    </url>
    <url>
      <loc>http://www.realestsystem.com/pricing</loc>
      <priority>0.9</priority>
      <lastmod>2022-10-14</lastmod>
    </url>
    <url>
      <loc>http://www.realestsystem.com/about</loc>
      <priority>0.7</priority>
      <lastmod>2022-10-14</lastmod>
    </url>
    <url>
      <loc>http://www.realestsystem.com/faq</loc>
      <priority>0.7</priority>
      <lastmod>2022-10-14</lastmod>
    </url>
    <url>
      <loc>http://www.realestsystem.com/contact</loc>
      <priority>0.7</priority>
      <lastmod>2022-10-14</lastmod>
    </url>
    </urlset>`;

  res.end(xml);
}
