import qs from 'qs';
import {fetch as fetchPolyfill} from 'whatwg-fetch'
import { setDefaultOptions } from 'esri-loader';
import { apiUrl, cssUrl, fontUrl } from '../../configs';

const fetchUrl = (url, param = {}, method = 'POST') => {
  return fetchPolyfill(`${url}?${param ? qs.stringify(param) : ''}`, {
    method,
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('fail');
      }
      return response.json();
    })
    .catch(e => {
      console.log('服务器异常', e);
    });
};

export const setMapProxy = () => {
  setDefaultOptions({
    url: apiUrl,
    css: cssUrl,
  });
};

export const formatCity = data => {
  return data.map(item => {
    if (item.list) {
      return {
        value: item.name,
        label: item.name,
        children: formatCity(item.list),
        ...item,
      };
    } else {
      return {
        value: item.name,
        label: item.name,
        ...item,
      };
    }
  });
};

export default fetchUrl;
