export type TGenerateImageRequest = {
    userId: string;
    type: 'GENERATE';
    style: string;
    width: number;
    height: number;
    numImages: 1;
    negativePromptDecoder?: string;
    generateParams: {
        query: string;
    };
};

export type TGenerateImageResponse = {
    status: 'INITIAL' | 'PROCESSING' | 'DONE' | 'FAIL';
    uuid: string;
    status_time: number;
};

export type TCheckStatusResponse = {
    status: string;
    image: string | null;
};
