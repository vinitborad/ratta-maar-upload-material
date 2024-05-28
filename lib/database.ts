import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL_CODE || 'your_default_mongodb_connection_string';

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
//TODO: add proper types below later
// @ts-ignore
let cached = global.mongoose;

//TODO: add proper types below later
if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
        console.log("mongodb connected ! from dbConnect function")
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
