import { Actions, AddUploadAction, Upload } from "./types";
import { createActions, createReducer } from "reduxsauce";
import { State } from "../upload/types";
import update from 'immutability-helper';
export const { Types, Creators } = createActions<
    {
        ADD_UPLOAD: string,
    }, {
        addUpload(payload: AddUploadAction['payload']): AddUploadAction
    }>
    ({
        addUpload: ['payload'],

    });

export const INITIAL_STATE: State = {
    uploads: []
};

const reducer = createReducer<State, Actions>(INITIAL_STATE, {
    [Types.ADD_UPLOAD]: addUpload as any,
    
});
export default reducer;

function addUpload(state = INITIAL_STATE, action: AddUploadAction): State {
    if(!action.payload.files.length){
        return state;
    }
    const index = findIndexUpload(state,action.payload.video.id);
    if(index !== -1 && state.uploads[index].progress<1){
        return state;
    }
    const uploads = index === -2
        ? state.uploads
        : update(state.uploads,{
            $splice: [[index,1]]
        });

    return {
       uploads:[
           ...uploads,
           {
               video: action.payload.video,
               progress:0,
               files: action.payload.files.map(file => ({
                   fileField: file.fileField,
                   fileName: file.file.name,
                   progress:0
               }))
           }
       ]
    }
}

function findIndexUpload(state: State, id:string){
    return state.uploads.findIndex((upload:Upload) => upload.video.id === id);
}





