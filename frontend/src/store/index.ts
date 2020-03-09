import { createStore } from "redux";
import reducer from "./upload";

const store = createStore(
    reducer
);
store.getState();
export default store;