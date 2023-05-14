import { normalizeAccount, normalizeStatus, normalizePoll } from './normalizer';

export const ACCOUNT_IMPORT  = 'ACCOUNT_IMPORT';
export const ACCOUNTS_IMPORT = 'ACCOUNTS_IMPORT';
export const STATUS_IMPORT   = 'STATUS_IMPORT';
export const STATUSES_IMPORT = 'STATUSES_IMPORT';
export const POLLS_IMPORT    = 'POLLS_IMPORT';
export const JAM_IMPORT    = 'JAMS_IMPORT';
export const FILTERS_IMPORT  = 'FILTERS_IMPORT';
export const JAMS_IMPORT    = 'JAMS_IMPORT';
export const JAM_INSTANCES_CREATE = 'JAM_INSTANCES_CREATE';

function pushUnique(array, object) {
  if (array.every(element => element.id !== object.id)) {
    array.push(object);
  }
}

export function importAccount(account) {
  return { type: ACCOUNT_IMPORT, account };
}

export function importAccounts(accounts) {
  return { type: ACCOUNTS_IMPORT, accounts };
}

export function importStatus(status) {
  return { type: STATUS_IMPORT, status };
}

export function importStatuses(statuses) {
  return { type: STATUSES_IMPORT, statuses };
}

export function importFilters(filters) {
  return { type: FILTERS_IMPORT, filters };
}

export function importPolls(polls) {
  return { type: POLLS_IMPORT, polls };
}

export function importJams(jams) {
  return { type: JAMS_IMPORT, jams };
}

export function createJamInstances(jamHosts, jamProxyBaseUrl, jamConfig) {
  return { type: JAM_INSTANCES_CREATE, jamHosts, jamProxyBaseUrl, jamConfig };
}


export function importJam(jam) {
  return { type: JAM_IMPORT, jam };
}


export function importFetchedAccount(account) {
  return importFetchedAccounts([account]);
}

export function importFetchedAccounts(accounts) {
  const normalAccounts = [];

  function processAccount(account) {
    pushUnique(normalAccounts, normalizeAccount(account));

    if (account.moved) {
      processAccount(account.moved);
    }
  }

  accounts.forEach(processAccount);

  return importAccounts(normalAccounts);
}

export function importFetchedStatus(status) {
  return importFetchedStatuses([status]);
}

export function importFetchedStatuses(statuses) {
  return (dispatch, getState) => {
    const accounts = [];
    const normalStatuses = [];
    const polls = [];
    const jams = [];
    const filters = [];
    const jamHosts = new Set();
    const jamProxyBaseUrl = getState().getIn(['meta', 'jam_proxy_base_url']);
    const jamConfig = getState().getIn(['meta', 'jam_config']);

    function processStatus(status) {
      pushUnique(normalStatuses, normalizeStatus(status, getState().getIn(['statuses', status.id])));
      pushUnique(accounts, status.account);

      if (status.filtered) {
        status.filtered.forEach(result => pushUnique(filters, result.filter));
      }

      if (status.reblog && status.reblog.id) {
        processStatus(status.reblog);
      }

      if (status.poll && status.poll.id) {
        pushUnique(polls, normalizePoll(status.poll));
      }

      if (status.jam && status.jam.id) {
        jamHosts.add(status.jam.jam_host);
        pushUnique(jams, status.jam);
      }
    }

    statuses.forEach(processStatus);

    dispatch(importPolls(polls));
    dispatch(createJamInstances(jamHosts, jamProxyBaseUrl, jamConfig));
    dispatch(importJams(jams));
    dispatch(importFetchedAccounts(accounts));
    dispatch(importStatuses(normalStatuses));
    dispatch(importFilters(filters));
  };
}

export function importFetchedPoll(poll) {
  return dispatch => {
    dispatch(importPolls([normalizePoll(poll)]));
  };
}

export function importFetchedJam(jam) {
  return dispatch => {
    dispatch(importJam(jam));
  };
}
