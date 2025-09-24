import fs from 'fs';
import path from 'path';

// The secure passcode, stored on the server, not the front-end
const SECURE_PASSCODE = "PMFC2025"; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { passcode, filename } = req.body;

  if (passcode !== SECURE_PASSCODE) {
    return res.status(401).json({ error: 'Incorrect passcode!' });
  }

  const sanitizedFilename = path.basename(filename);
  const filePath = path.join(process.cwd(), 'reports', sanitizedFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found.' });
  }

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}