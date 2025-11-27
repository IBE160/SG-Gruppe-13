// api/chat.ts

export default function handler(req: any, res: any) {
  // Add headers to explicitly disable caching for this route
  res.setHeader(
    'Cache-Control', 
    'no-cache, no-store, max-age=0, must-revalidate'
  );

  if (req.method === 'GET') {
    // Now, send the 200 OK response with the body
    res.status(200).send('Hello from the backend!');
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}