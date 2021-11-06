import {
	TODO_LOADING,
	TODO_LIST,
	TODO_ITEM_LOADING,
	TODO_ITEM_LIST,
	TODO_ITEM_SORTER
} from "@constants/ActionTypes";
import axios from "@util/Api";
import RouteAccess from "@config/RouteAccess";
import {setError, showMessage} from "@reduxActions/Common";

const email = 'luqni.maulana@email.com';

export const createTodo = (callback) =>
{
	return async (dispatch, getState) =>
	{
		const {todo} = getState();
		const {data} = todo;

		try {
			const payload = {
				title: `New Activity Group ${(data && data.length) ? data.length : ''}`,
	    		email: email
			};
			await axios.post(RouteAccess.getApi('TODO_ACTIVITY'), payload);
			dispatch(getTodo());
		} catch(error) {
			dispatch(setError(error));
		} finally {
			if (typeof callback === 'function') callback();
		}
	}
}

export const deleteTodo = (id, callback) =>
{
	return async (dispatch) =>
	{
		try {
			await axios.delete(RouteAccess.getApi('TODO_ACTIVITY_ID', {id}));
			dispatch(getTodo());
			dispatch(showMessage('Activity berhasil dihapus'));
		} catch(error) {
			dispatch(setError(error));
		} finally {
			if (typeof callback === 'function') callback();
		}
	}
}

export const getTodo = () =>
{
	return async (dispatch) =>
	{
		try {
			dispatch({type: TODO_LOADING, payload: true});
			const request = await axios.get(RouteAccess.getApi('TODO_ACTIVITY'), {params:{email}});
			const {data} = request?.data ?? {};
			dispatch({type: TODO_LIST, payload: (data && data.length) ? data : null});
		} catch(error) {
			dispatch(setError(error));
		} finally {
			dispatch({type: TODO_LOADING, payload: false});
		}
	}
}

export const resetTodoItems = () =>
{
	return {type: TODO_ITEM_LIST, payload: null};
}

export const getTodoItems = (id) =>
{
	return async (dispatch) =>
	{
		try {
			dispatch({type: TODO_ITEM_LOADING, payload: true});
			const request = await axios.get(RouteAccess.getApi('TODO_ACTIVITY_ITEM'), {params: {activity_group_id: id}});
			const {data} = request?.data ?? {};
			dispatch({type: TODO_ITEM_LIST, payload: (data && data.length) ? data : null});
		} catch(error) {
			dispatch(setError(error));
		} finally {
			dispatch({type: TODO_ITEM_LOADING, payload: false});
		}
	}
}

export const setActiveItem = (id, active, callback) =>
{
	return async (dispatch) =>
	{
		try {
			const payload = {is_active: active ? 1 : 0};
			await axios.patch(RouteAccess.getApi('TODO_ACTIVITY_ITEM_ID', {id}), payload);
			if (typeof callback === 'function') callback();
		} catch(error) {
			dispatch(setError(error));
		}
	}
}

export const deleteItem = (id, callback) =>
{
	return async (dispatch) =>
	{
		try {
			await axios.delete(RouteAccess.getApi('TODO_ACTIVITY_ITEM_ID', {id}));
			if (typeof callback === 'function') callback();
		} catch(error) {
			dispatch(setError(error));
		}
	}
}

export const sortItems = (value) =>
{
	return (dispatch, getState) =>
	{
		const {todo} = getState();
		const {item_data} = todo;

		if (item_data && item_data.length)
		{
			switch (value)
			{
				case 'newest':
					item_data.sort((a, b) => {
					    if (a.id > b.id) return -1;
					    if (a.id < b.id) return 1;
					    return 0;
					});
				break;
				case 'oldest':
					item_data.sort((a, b) => {
					    if (a.id < b.id) return -1;
					    if (a.id > b.id) return 1;
					    return 0;
					});
				break;
				case 'az':
					item_data.sort((a, b) => {
					    if (a.title < b.title) return -1;
					    if (a.title > b.title) return 1;
					    return 0;
					});
				break;
				case 'za':
					item_data.sort((a, b) => {
					    if (a.title > b.title) return -1;
					    if (a.title < b.title) return 1;
					    return 0;
					});
				break;
				case 'unifinished':
					item_data.sort((a, b) => {
					    if (a.is_active > b.is_active) return -1;
					    if (a.is_active < b.is_active) return 1;
					    return 0;
					});
				break;
				default:
					return null;
			}
		}

		dispatch({type: TODO_ITEM_SORTER, payload: value});
	}
}