import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router, Request, Response } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
router.get('/', (req: Request, res: Response) => {
  try {
    if (req.query.clear) {
      // Implement logic to clear search history
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  } catch(error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }

  });

export default router;