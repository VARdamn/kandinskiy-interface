import axios from 'axios';
import FormData from 'form-data'

type TGenerateImageRequest = {
    type: 'GENERATE'
    style: string
    width: number
    height: number
    numImages: 1
    negativePromptDecoder?: string
    generateParams: {
        query: string
	}
}

type TGenerateImageResponse = {
	status: 'INITIAL' | 'PROCESSING' | 'DONE' | 'FAIL'
	uuid: string
	status_time: number
}

type TCheckStatusResponse = {
	status: string;
	image: string | null
}

const api = axios.create({
	baseURL: 'https://api-key.fusionbrain.ai',
	headers: {
		'X-Key': `Key ${Bun.env.VITE_KANDINSKIY_API_KEY}`,
		'X-Secret': `Secret ${Bun.env.VITE_KANDINSKIY_SECRET_KEY}`
	}
})

const getPipelineId = async () => {
	return await api
		.get('/key/api/v1/pipelines')
		.then(res => res.data)
		.then(res => res[0].id)
		.catch(err => {
			console.log(err)
		})
}

const generateImage = async ({data, pipelineId}: {data: TGenerateImageRequest; pipelineId: string}): Promise<TGenerateImageResponse> => {
	const formData = new FormData();
	formData.append('pipeline_id', pipelineId);
	formData.append('params', JSON.stringify(data), {contentType: 'application/json'});
  	return await api
		.post('/key/api/v1/pipeline/run', formData, {
			headers: {
				...formData.getHeaders(),
				'Content-Type': 'multipart/form-data'
			},
		})
		.then(res => res.data)
		.catch(err => {
			console.log(err)
		})
}

const checkImageStatus = async (uuid: string): Promise<TCheckStatusResponse> => {
	return await api
		.get(`/key/api/v1/pipeline/status/${uuid}`)
		.then(res => res.data)
		.then(res => {
			if (res.status === 'DONE') {
				return {
					status: res.status,
					image: res.result.files[0]
				}
			}
			return {
				status: res.status,
				image: null
			}
		})
		.catch(err => {
			console.log(err)
			throw err
		})
}

export const $$kandinskiy = {
	getPipelineId,
	generateImage,
	checkImageStatus
}