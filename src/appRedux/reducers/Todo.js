import {
	TODO_LOADING,
	TODO_LIST,
	TODO_ITEM_LOADING,
	TODO_ITEM_LIST,
	TODO_ITEM_SORTER
} from "@constants/ActionTypes";

const INIT_STATE = {
    loading: false,
	data: null,
    item_loading: false,
	item_data: null,
	item_sorter: null,
};

export default (state = INIT_STATE, action) =>
{
    switch (action.type)
    {
        case TODO_LOADING: {
            return {...state, loading: action.payload ? true : false};
        }

        case TODO_LIST: {
            return {...state, data: action.payload};
        }

        case TODO_ITEM_LOADING: {
            return {...state, item_loading: action.payload ? true : false};
        }

        case TODO_ITEM_LIST: {
            return {...state, item_data: action.payload};
        }
        
        case TODO_ITEM_SORTER: {
            return {...state, item_sorter: action.payload};
        }

        default:
            return state;
    }
}