import { Types } from './index';
import { eventChannel } from 'redux-saga';
import { actionChannel, take, call } from 'redux-saga/effects';
import { AddUploadAction, FileUpload, FileInfo } from './types';
import { Video } from '../../util/models';
import videoHttp from '../../util/http/video-http';

export function* uploadWatcherSaga() {
    const newFilesChannel = yield actionChannel(Types.ADD_UPLOAD);
    while (true) {
        const { payload }: AddUploadAction = yield take(newFilesChannel);
        console.log(payload);
        for (const fileInfo of payload.files) {
            yield call(uploadFile, { video: payload.video, fileInfo: fileInfo })
        }
    }
}

function* uploadFile({ video, fileInfo }: { video: Video, fileInfo: FileInfo }) {
    console.log(video, fileInfo);
    const channel = yield call(sendUpload, { id: video.id, fileInfo: fileInfo });
    while (true) {
        try{
            const event = yield take(channel);
            console.log(event);
        }catch(e){
            console.log(e);
        }
        
    }

}

function* sendUpload({ id, fileInfo }: { id: string, fileInfo: FileInfo }) {
    return eventChannel(emitter => {
        videoHttp.partialUpdate(id, {
            _method: "PATCH",
            [fileInfo.fileField]: fileInfo.file
        }, {
            http: {
                usePost: true
            },
            config: {
                onUploadProgress(progressEvent) {
                    emitter(progressEvent);
                }
            }
        })
            .then(response => emitter(response))
            .catch(error => emitter(error));

        const unsubcribe = () => { }

        return unsubcribe;
    })
}