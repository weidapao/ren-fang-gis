import qs from 'qs';

const fetchUrl = (url, param = {}, method = 'POST') => {
  return fetch(`${url}?${param ? qs.stringify(param) : ''}`, {
    method,
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('fail');
      }
      return response.json();
    })
    .catch(e => {
      console.log(e);
    });
};

export default fetchUrl;
