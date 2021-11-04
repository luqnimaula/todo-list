import {combineReducers} from "redux";
import {connectRouter} from 'connected-react-router';
import Common from "./Common";
import Todo from "./Todo";

export default (history) => combineReducers({
    router: connectRouter(history),
    common: Common,
    todo: Todo,
});