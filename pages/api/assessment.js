// import fs from 'fs';
// import path from 'path';

// const dataFilePath = path.join(process.cwd(), 'data', 'assessments.json');

// export default function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
//       res.status(200).json(data);
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to load data' });
//     }
//   } else if (req.method === 'POST') {
//     try {
//       const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
//       const newAssessment = req.body;
//       data.push(newAssessment);
//       fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//       res.status(201).json(newAssessment);
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to save data' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }

// import clientPromise from '../../lib/mongodb';

// export default async function handler(req, res) {
//   const client = await clientPromise;
//   const db = client.db('assessment');

//   if (req.method === 'POST') {
//     const newAssessment = req.body;
//     const result = await db.collection('assessments').insertOne(newAssessment);
//     res.status(201).json(result.ops[0]);
//   } else if (req.method === 'GET') {
//     const assessments = await db.collection('assessments').find({}).toArray();
//     res.status(200).json(assessments);
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }

import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('assessment');

    if (req.method === 'POST') {
      const newAssessment = req.body;

      console.log('Request Body:', newAssessment);

      if (!newAssessment.title || typeof newAssessment.title !== 'string') {
        console.log('Invalid assessment data');
        return res.status(400).json({ message: 'Invalid assessment data' });
      }

      const result = await db.collection('assessments').insertOne(newAssessment);

      console.log('Insertion Result:', result);

      if (result && result.insertedId) {
        const insertedDocument = await db.collection('assessments').findOne({ _id: result.insertedId });
        console.log('Inserted Document:', insertedDocument);
        res.status(201).json(insertedDocument);
      } else {
        res.status(500).json({ message: 'Failed to insert document' });
      }
    } else if (req.method === 'GET') {
      const assessments = await db.collection('assessments').find({}).toArray();

      console.log('Fetched Assessments:', assessments);

      res.status(200).json(assessments);
    } else {
      console.log('Method not allowed');
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}




