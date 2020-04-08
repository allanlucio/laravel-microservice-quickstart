import {Types} from './index';
import {actionChannel, take, call} from 'redux-saga/effects';
import { AddUploadAction, FileUpload, FileInfo } from './types';
import { Video } from '../../util/models';

export function* uploadWatcherSaga(){
    const newFilesChannel = yield actionChannel(Types.ADD_UPLOAD);
    while(true){
        const {payload}:AddUploadAction = yield take(newFilesChannel);
        console.log(payload);
        for(const fileInfo of payload.files){
            yield call(uploadFile, {video:payload.video,fileInfo:fileInfo})
        }
    }
}

function* uploadFile({video, fileInfo}:{video:Video,fileInfo:FileInfo}){
    console.log(video,fileInfo);
}