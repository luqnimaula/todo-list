import {FETCH_ERROR, FETCH_START, FETCH_SUCCESS, HIDE_MESSAGE, SHOW_MESSAGE} from "../../constants/ActionTypes";

export const fetchStart = () => {
  return {
    type: FETCH_START
  }
};

export const fetchSuccess = () => {
  return {
    type: FETCH_SUCCESS
  }
};

export const fetchError = (error) => {
  return {
    type: FETCH_ERROR,
    payload: error
  }
};

export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  }
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE
  }
};

export const setError = (error) => {
  return (dispatch) => {
    const response = error.request;
    const responseText = response && response.responseText;

    let msg = error && error.hasOwnProperty('message') ? error.message : 'Error!';
    try {
      const resJson = JSON.parse(responseText);
      const {message} = resJson ? resJson : {};

      if (message) dispatch(fetchError(message));
    } catch(e) {
      if (responseText) {
        msg = responseText;
      } else {
        msg = response && response.hasOwnProperty('statusText') ? response.statusText : msg;
      }
      dispatch(fetchError(msg));
    }
  }
}