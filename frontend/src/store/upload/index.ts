import { Actions, AddUploadAction } from "./types";
import { createActions, createReducer } from "reduxsauce";
import { State } from "../upload/types";

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
    
    return {
       
    }
}





