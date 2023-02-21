import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {ENVIRONMENT} from '@/config';

interface IReCaptchaResponse {
    success: true | false;
}

export default class ReCaptchaService {
    private client: AxiosInstance;
    public constructor() {
        this.client = axios.create({
            baseURL: 'https://www.google.com/recaptcha/api',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public verify = (recaptchaResponse: string): Promise<boolean> => {
        return new Promise(resolve => {
            this.client
                .post(
                    `/siteverify?secret=${ENVIRONMENT.TISC_CATPCHA_SECRET_KEY}&response=${recaptchaResponse}`
                )
                .then((response: AxiosResponse<IReCaptchaResponse>) => {
                    resolve(response.data.success);
                })
                .catch(error => {
                    console.error(error);
                    resolve(false);
                });
        });
    };
}
export const reCaptchaService = new ReCaptchaService();
