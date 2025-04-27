import { ConnectionOptions, Job, Queue, Worker } from 'bullmq';
import ImageModel from 'db/images.schema';
import { $$kandinskiy } from 'entities/kandinskiy';
import mongoose from 'mongoose';
import { TGenerateImageRequest } from 'utils/images.types';

if (!Bun.env.REDIS_HOST || !Bun.env.REDIS_PORT) throw new Error('No redis config provided');

const connection: ConnectionOptions = {
    host: Bun.env.REDIS_HOST,
    port: +Bun.env.REDIS_PORT,
};

const queueNames = {
    generateImage: 'generate-image',
    checkImageStatus: 'check-image-status',
} as const;

new Worker(
    queueNames.generateImage,
    async (job: Job<TGenerateImageRequest & { id: string }>) => {
        const { id, userId, ...data } = job.data;
        const pipelineId: string = await $$kandinskiy.getPipelineId();
        const { uuid } = await $$kandinskiy.generateImage({ data, pipelineId });
        await ImageModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { kandinskiyUuid: uuid });
    },
    { connection },
);

export const generateImageQueue = new Queue(queueNames.generateImage, { connection });
