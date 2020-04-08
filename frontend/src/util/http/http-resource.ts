import { AxiosInstance, AxiosResponse, AxiosRequestConfig, CancelTokenSource } from "axios";
import axios from "axios";
import { CardActions } from "@material-ui/core";
import {objectToFormData} from "object-to-formdata";
export default class HttpResource {

    private cancelList: CancelTokenSource | null = null;

    constructor(protected http: AxiosInstance, protected resource) {

    }

    list<T = any>(options?: { queryParams?}): Promise<AxiosResponse<T>> {
        if (this.cancelList) {
            this.cancelList.cancel('list Cancelled');
        }
        this.cancelList = axios.CancelToken.source();

        const config: AxiosRequestConfig = {
            cancelToken: this.cancelList.token
        };
        if (options && options.queryParams) {
            config.params = options.queryParams;
        }

        return this.http.get<T>(this.resource, config);

    }

    get<T = any>(id) {

        return this.http.get<T>(`${this.resource}/${id}`);
    }

    create<T = any>(data) {

        // const resource = id?`${this.resource}/${id}`:this.resource;
        let sendData = this.makeSendData(data);
        return this.http.post<T>(this.resource, sendData);
    }

    update<T = any>(id, data, options?: { http?: { usePost: boolean }, config?: AxiosRequestConfig }) {
        let sendData = data;
        if (this.containsFile(data)) {
            sendData = this.getFormData(data);
        }
        const { http } = (options || {}) as any;

        return !options || !http || !http.usePost
            ? this.http.put<T>(`${this.resource}/${id}`, sendData)
            : this.http.post<T>(`${this.resource}/${id}`, sendData)
    }

    delete<T = any>(id) {
        return this.http.delete<T>(`${this.resource}/${id}`);
    }
    deleteCollection<T = any>(queryParams) {
        const config: AxiosRequestConfig = {};
        if(queryParams){
            config['params']=queryParams;
        }
        return this.http.delete<T>(`${this.resource}`, config);
    }


    isCancelledRequest(error) {
        return axios.isCancel(error);
    }

    private makeSendData(data){
        return this.containsFile(data)? this.getFormData(data):data;
    }

    private getFormData(data){
        // const formData = new FormData();
        // Object
        //     .keys(data)
        //     .forEach((key)=>{
        //         let value = data[key];
        //         if(typeof value === 'undefined'){
        //             return null;
        //         }
        //         if(typeof value === 'boolean'){
        //             value = value ? 1 : 0;
        //         }

        //         if(value instanceof Array){
        //             value.forEach(v => formData.append(`${key}[]`,v));
        //         }

        //         formData.append(key, value);
        //     })
        return objectToFormData(data, {booleansAsIntegers: true})
    }

    private containsFile(data){
        return Object.values(data)
            .filter(el=> el instanceof File).length !== 0;
    }
}