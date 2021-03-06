import { Types, Creators } from './index';
import { eventChannel, END } from 'redux-saga';
import { actionChannel, take, call, put, select} from 'redux-saga/effects';
import { AddUploadAction, FileUpload, FileInfo } from './types';
import { Video } from '../../util/models';
import videoHttp from '../../util/http/video-http';

export function* uploadWatcherSaga() {
    const newFilesChannel = yield actionChannel(Types.ADD_UPLOAD);
    while (true) {
        const { payload }: AddUploadAction = yield take(newFilesChannel);
        console.log(yield select((state) => state));
        console.log(payload);
        for (const fileInfo of payload.files) {
            try {
                yield call(uploadFile, { video: payload.video, fileInfo: fileInfo })    
            } catch (error) {
                
            }
            
        }
    }
}

function* uploadFile({ video, fileInfo }: { video: Video, fileInfo: FileInfo }) {
    console.log(video, fileInfo);
    const channel = yield call(sendUpload, { id: video.id, fileInfo: fileInfo });
    while (true) {
        try{
            const {progress,response} = yield take(channel);
            if(response){
                return response;
            }
            yield put(Creators.updateProgress({
                video,
                fileField:fileInfo.fileField,
                progress
            }))
            console.log("atualizar progresso");
        }catch(e){
            yield put(Creators.setUploadError({
                video,
                fileField:fileInfo.fileField,
                error:e
            }))
            throw e;
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
                headers: {
                    ignoreLoading:true
                },
                onUploadProgress(progressEvent: ProgressEvent) {
                    if(progressEvent.lengthComputable){
                        const progress = progressEvent.loaded / progressEvent.total;
                        emitter({progress});
                    }
                    
                }
            }
        })
            .then(response => emitter({response}))
            .catch(error => emitter(error))
            .finally(()=>emitter(END));

        const unsubcribe = () => { }

        return unsubcribe;
    })
}