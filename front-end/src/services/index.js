import { fetchAPI } from 'utils/fetch';

export const getSession = (address) => {
  return fetchAPI('users/login-session?address=' + address);
};

export const getAuth = ({ address }) => {
  return fetchAPI('auth/authenticate', {
    method: 'POST',
    body: JSON.stringify({
      address,
      trxId: '0xec66ccd8db5c082fe947aeae03ba1e323627fc9afad4734008cbb7b34231cac3',
    }),
  });
};

export const createRecruiment = (data) => {
  return fetchAPI('recruitments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const editRecruiment = ({ id, ...data }) => {
  return fetchAPI('recruitments/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getContract = (options) => {
  return fetchAPI('recruitments/?' + new URLSearchParams(options).toString());
};

export const getOneContract = (id) => {
  return fetchAPI('recruitments/' + id).catch((err) => {
    console.log('err', err);
  });
};

export const deleteContract = (id) => {
  return fetchAPI('recruitments/' + id, {
    method: 'DELETE',
  });
};

export const createContract = (id, trxId) => {
  return fetchAPI('recruitments/' + id + '/contract', {
    method: 'POST',
    body: JSON.stringify({ trxId }),
  });
};

export const signContract = (key, trxId) => {
  return fetchAPI('recruitments/' + key + '/sign', {
    method: 'POST',
    body: JSON.stringify({ trxId }),
  });
};

export const completeContract = (id, trxId) => {
  return fetchAPI('recruitments/' + id + '/approve', {
    method: 'PUT',
    body: JSON.stringify({ trxId }),
  });
};

export const getMyContract = (options) => {
  return fetchAPI('me/recruitments/?' + new URLSearchParams(options).toString());
};

export const getContractPrivateKey = (id) => {
  return fetchAPI('recruitments/' + id + '/slug');
};

export const getOneContractByKey = (key) => {
  return fetchAPI('recruitments/' + key + '/jd');
};

export const submitImages = (id, images) => {
  return fetchAPI('recruitments/' + id + '/submit', {
    method: 'POST',
    body: JSON.stringify(images),
  });
};

export const reportContract = (id) => {
  return fetchAPI('recruitments/' + id + '/report', {
    method: 'PUT',
  });
};
