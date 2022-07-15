import api from '../api';
import { importFetchedJam } from './importer';

export const JAM_FETCH_REQUEST = 'JAM_FETCH_REQUEST';
export const JAM_FETCH_SUCCESS = 'JAM_FETCH_SUCCESS';
export const JAM_FETCH_FAIL    = 'JAM_FETCH_FAIL';

export const fetchJam = (id)  => {
  return (dispatch, getState) => {
    const skipLoading = getState().getIn(['jams', id], null) !== null;

    if (skipLoading) {
      return;
    }

    dispatch(fetchJamRequest(id, skipLoading));

    api(getState).get(`/api/v1/jams/${id}`).then(response => {
      dispatch(importFetchedJam(response.data));
      dispatch(fetchJamSuccess(skipLoading));
    }).catch(error => {
      dispatch(fetchJamFail(id, error, skipLoading));
    });
  };
};


export const fetchJamRequest = (id, skipLoading) => {
  return {
    type: JAM_FETCH_REQUEST,
    id,
    skipLoading,
  };
};

export const fetchJamSuccess = (skipLoading) => {
  return {
    type: JAM_FETCH_SUCCESS,
    skipLoading,
  };
};


export const fetchJamFail = (id, error, skipLoading) => {
  return {
    type: JAM_FETCH_FAIL,
    id,
    error,
    skipLoading,
    skipAlert: true,
  };
};
