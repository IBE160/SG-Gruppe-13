import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (request: VercelRequest, response: VercelResponse) {
  response.status(200).json({
    data: {
      reply: 'Hello from the backend!',
    },
  });
}