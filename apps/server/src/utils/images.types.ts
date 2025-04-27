import { z } from 'zod';

export const GenerateImageRequestZod = z.object({
    userId: z.string().openapi({
        param: {
            name: 'userId',
        },
        type: 'string',
        example: 'ad160deb-c2e2-4432-87a0-ed502c41fe6a',
    }),
    type: z.literal('GENERATE').openapi({
        param: {
            name: 'type',
        },
        type: 'string',
        example: 'GENERATE',
    }),
    style: z.union([z.literal('DEFAULT'), z.literal('KANDINSKY'), z.literal('UHD'), z.literal('ANIME')]).openapi({
        param: {
            name: 'style',
        },
        type: 'string',
        example: 'UHD',
    }),
    width: z.coerce
        .number()
        .min(64)
        .max(1024)
        .openapi({
            param: {
                name: 'width',
            },
            type: 'number',
            example: 576,
        }),
    height: z.coerce
        .number()
        .min(64)
        .max(1024)
        .openapi({
            param: {
                name: 'height',
            },
            type: 'number',
            example: 576,
        }),
    numImages: z.coerce
        .number()
        .min(1)
        .max(1)
        .openapi({
            param: {
                name: 'width',
            },
            type: 'number',
            example: 1,
        }),
    generateParams: z.strictObject({
        query: z.string().openapi({
            param: {
                name: 'query',
            },
            type: 'string',
            example: 'Промпт картинки, которую хочется сгенерировать....',
        }),
    }),
    negativePromptDecoder: z
        .string()
        .optional()
        .openapi({
            param: {
                name: 'negativePromptDecoder',
            },
            type: 'string',
            example: 'То, что следует исключить при генерации картинки',
        }),
});

export type TGenerateImageRequest = z.infer<typeof GenerateImageRequestZod>;

export type TGenerateImageResponse = {
    status: 'INITIAL' | 'PROCESSING' | 'DONE' | 'FAIL';
    uuid: string;
    status_time: number;
};

export type TCheckStatusResponse = {
    status: string;
    image: string | null;
};
