import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'assessments.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to load data' });
    }
  } else if (req.method === 'POST') {
    try {
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      const newAssessment = req.body;
      data.push(newAssessment);
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
      res.status(201).json(newAssessment);
    } catch (error) {
      res.status(500).json({ message: 'Failed to save data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
