// @ts-check

export const FLOATING_JAM_DEPLOY = 'FLOATING_JAM_DEPLOY';
export const PICTURE_IN_PICTURE_DEPLOY = 'PICTURE_IN_PICTURE_DEPLOY';
export const PICTURE_IN_PICTURE_REMOVE = 'PICTURE_IN_PICTURE_REMOVE';

/**
 * @typedef MediaProps
 * @property {string} src
 * @property {boolean} muted
 * @property {number} volume
 * @property {number} currentTime
 * @property {string} poster
 * @property {string} backgroundColor
 * @property {string} foregroundColor
 * @property {string} accentColor
 */

/**
 * @param {string} statusId
 * @param {string} accountId
 * @param {string} playerType
 * @param {MediaProps} props
 * @return {object}
 */
export const deployPictureInPicture = (statusId, accountId, playerType, props) => {
  return (dispatch, getState) => {
    // Do not open a player for a toot that does not exist
    if (getState().hasIn(['statuses', statusId])) {
      dispatch({
        type: PICTURE_IN_PICTURE_DEPLOY,
        statusId,
        accountId,
        playerType,
        props,
      });
    }
  };
};

/**
 * @param {string} statusId
 * @param {string} accountId
 * @param {string} jamId
 * @return {object}
 */
export const deployFloatingJam = (statusId, accountId, jamId) => {
  return (dispatch, getState) => {
    if (getState().hasIn(['statuses', statusId])) {
      dispatch({
        type: FLOATING_JAM_DEPLOY,
        statusId,
        accountId,
        jamId,
      });
    }
  };
};

/*
 * @return {object}
 */
export const removePictureInPicture = () => ({
  type: PICTURE_IN_PICTURE_REMOVE,
});
