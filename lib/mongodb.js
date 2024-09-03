import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = global._mongoClientPromise = client.connect();
  }
} else {
  clientPromise = client.connect();
}

export default clientPromise;


