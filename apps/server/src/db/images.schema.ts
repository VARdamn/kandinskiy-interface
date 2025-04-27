import { Schema, model } from 'mongoose';

type TImage = {
    userId: string;
    status: 'pending' | 'fulfilled';
    kandinskiyUuid: string;
    image: string;
};

const ImageSchema = new Schema<TImage>(
    {
        userId: { type: String, required: true },
        status: { type: String, required: true },
        kandinskiyUuid: { type: String, required: false },
        image: { type: String, required: false },
    },
    {
        timestamps: true,
        id: true,
        versionKey: false,
    },
);

const ImageModel = model('image', ImageSchema);

export default ImageModel;
