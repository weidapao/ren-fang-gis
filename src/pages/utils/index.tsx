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

// 方法定义 lat,lng 
export const GetDistance = ( point1, point2) => {
  var radLat1 = point1.y*Math.PI / 180.0;
  var radLat2 = point2.y*Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var  b = point1.x*Math.PI / 180.0 - point2.x*Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
  Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s *6378.137 ;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s.toFixed(2);
}

export default fetchUrl;
