import ImageModel from 'db/images.schema';
import { $$kandinskiy } from 'entities/kandinskiy';
import scheduler from 'node-schedule';

const checkPendingImages = async () => {
    const pendingImages = await ImageModel.find({ status: 'pending' });

    console.log(`[checkPendingImages] Checking ${pendingImages.length} images`);
    for (const pendingImage of pendingImages) {
        const { status, image } = await $$kandinskiy.checkImageStatus(pendingImage.kandinskiyUuid);

        if (status === 'DONE' && image) {
            await ImageModel.findOneAndUpdate({ _id: pendingImage._id }, { status: 'fulfilled', image });
        }
    }
};

scheduler.scheduleJob('*/5 * * * * *', checkPendingImages);
