import {AnyAction} from 'redux';
import { Video } from '../../util/models';
import { AxiosError } from 'axios';


export interface FileUpload{
    fileField: string; 
    fileName: string;
    progress: number;
    error?: AxiosError;
}

export interface Upload{
    video: Video;
    progress: number;
    files: FileUpload[];
}

export interface State{
    uploads: Upload[];
}

export interface AddUploadAction extends AnyAction{
    payload:{
        video: Video,
        files: Array<{file: File, fileField: string}>
    }
}
export interface RemoveUploadAction extends AnyAction{
    payload:{
        id: string;
    }
}
export interface RemoveUploadAction extends AnyAction{
    payload:{
        id: string;
    }
}
export interface UpdateProgressAction extends AnyAction{
    payload:{
        video: Video;
        fileField: string;
        progress: number;
    }
}
export interface SetUploadErrorAction extends AnyAction{
    payload:{
        video: Video;
        fileField: string;
        error: AxiosError;
    }
}

export type Actions = AddUploadAction | RemoveUploadAction | UpdateProgressAction | SetUploadErrorAction;