import mongoose from 'mongoose';

Bun.env.MONGO_CONNECTION_STRING &&
    (await mongoose.connect(Bun.env.MONGO_CONNECTION_STRING, {
        dbName: 'kandinskiy',
    }));
