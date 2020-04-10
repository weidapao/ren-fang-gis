import React, { useRef, useEffect } from 'react';
import { setDefaultOptions, loadModules } from 'esri-loader';
import { Input, message } from 'antd';
import fetchUrl from '../utils';
import { searchSite, searchCity, getAllsite } from '../services';
import img from '../assets/alarm.png';

import styles from './index.less';

// hooks allow us to create a map component as a function
const jiangSuList = [
  { name: '南京', lng: 118.78, lat: 32.04 },
  { name: '徐州', lng: 117.2, lat: 34.26 },
  { name: '连云港', lng: 119.16, lat: 34.59 },
  { name: '南通', lng: 120.86, lat: 32.01 },
  { name: '苏州', lng: 120.62, lat: 31.32 },
  { name: '无锡', lng: 120.29, lat: 31.59 },
  { name: '常州', lng: 119.95, lat: 31.79 },
  { name: '淮安', lng: 119.15, lat: 33.5 },
  { name: '盐城', lng: 120.13, lat: 33.38 },
  { name: '扬州', lng: 119.42, lat: 32.39 },
  { name: '泰州', lng: 119.9, lat: 32.49 },
  { name: '镇江', lng: 119.44, lat: 32.2 },
  { name: '宿迁', lng: 118.3, lat: 33.96 },
];

let view = null;

function EsriMap({ id }) {
  // create a ref to element to be used as the map's container
  const mapEl = useRef(null);
  const gotoPlace = (text: string) => {
    if (!text) return;
    // setDefaultOptions({
    //   url: `http://192.168.206.72:8084/arcgis_js_v414_api/arcgis_js_api/library/4.14/init.js`,
    //   css: `http://192.168.206.72:8084/arcgis_js_v414_api/arcgis_js_api/library/4.14/esri/themes/light/main.css`,
    // });
    loadModules(['esri/geometry/Point']).then(([Point]) => {
      fetchUrl(searchSite, { alarmSiteID: text }).then(data => {
        if (data.flag) {
          message.success('查询警报点成功！');
          view.center = new Point({
            x: data.obj.longitude,
            y: data.obj.latitude,
            spatialReference: 4490,
          });
          view.goTo({ scale: 3548.0843865217253 });
        } else {
          message.error('未搜索到警报点！');
        }
      });
    });
  };

  // use a side effect to create the map after react has rendered the DOM
  useEffect(
    () => {
      // define the view here so it can be referenced in the clean up function
      // the following code is based on this sample:
      // https://developers.arcgis.com/javascript/latest/sample-code/webmap-basic/index.html
      // first lazy-load the esri classes
      // setDefaultOptions({
      //   url: `http://192.168.206.72:8084/arcgis_js_v414_api/arcgis_js_api/library/4.14/init.js`,
      //   css: `http://192.168.206.72:8084/arcgis_js_v414_api/arcgis_js_api/library/4.14/esri/themes/light/main.css`,
      // });
      loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/MapImageLayer',
        'esri/Graphic',
        'esri/layers/GraphicsLayer',
        'esri/geometry/Circle',
        'esri/Basemap',
        'esri/geometry/Polyline',
        'esri/geometry/Polygon',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/TextSymbol',
        'esri/geometry/Point',
      ],{css:true}).then(
        ([
          Map,
          MapView,
          MapImageLayer,
          Graphic,
          GraphicsLayer,
          Circle,
          Basemap,
          Polyline,
          Polygon,
          SimpleLineSymbol,
          SimpleFillSymbol,
          TextSymbol,
          Point,
        ]) => {
          // then we load a web map from an id
          var permitsLayer = new MapImageLayer({
            url:
              'http://218.94.0.22:8089/arcgis/rest/services/jssldt/MapServer',
          });
          var permitsLayer2 = new MapImageLayer({
            url: 'http://218.94.0.22:8089/arcgis/rest/services/jszj/MapServer',
          });
          // var alarmList = [
          //   { lng: 119.55, lat: 32.43, text: 'aaaaaa' },
          //   { lng: 120.55, lat: 32.42, text: 'bbbbbbb' },
          // ];
          var Basemap = new Basemap({
            baseLayers: [permitsLayer, permitsLayer2],
          });
          var map = new Map({
            basemap: Basemap,
          });

          view = new MapView({
            container: mapEl.current,
            map: map,
            scale: 2443008,
          });
          view.constraints = {
            minScale: 4305300, // User cannot zoom out beyond a scale of 1:500,000
            maxScale: 1850, // User can overzoom tiles
            rotationEnabled: false, // Disables map rotation
            scale: 2443008,
          };
          var graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);
          Promise.all([fetchUrl(searchCity), fetchUrl(getAllsite)])
            .then(([data1, data2]) => {
              const cityList = data1.obj;
              const alarmList = data2.obj;
              // 警报点代码
              const markerList = alarmList.map(item => {
                let point = {
                  type: 'point',
                  longitude: item.longitude,
                  latitude: item.latitude,
                };
                var pointGraphic = new Graphic({
                  title: [item.id, item.longitude, item.latitude],
                  geometry: point,
                  symbol: {
                    type: 'picture-marker',
                    url: img,
                    width: '36px',
                    height: '36px',
                  },
                });

                var circle = new Circle({
                  radius: 80,
                  center: [item.longitude, item.latitude],
                });
                var circleGraphic = new Graphic(circle, {
                  type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                  color: null,
                  outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: 'red',
                    width: '0.5px',
                    style: 'dash',
                  },
                });
                var line = new Polyline({
                  paths: [
                    [[circle.center.x, circle.center.y], circle.rings[0][30]],
                  ],
                });
                var lineSymbol = new SimpleLineSymbol();
                var lineGraphic = new Graphic(line, lineSymbol);
                var textPoint = new Point(
                  (circle.rings[0][30][0] + circle.center.x) / 2,
                  (circle.rings[0][30][1] + circle.center.y) / 2 + 0.00005,
                );
                var textSymbol = new TextSymbol({ text: '半径:800米' });
                var textPointGraphic = new Graphic(textPoint, textSymbol);
                return {
                  pointGraphic,
                  circleGraphic,
                  lineGraphic,
                  textPointGraphic,
                };
              });
              // 添加text、背景标签
              const cityNum = cityList.map(item => {
                let point = {
                  type: 'point',
                  longitude: item.longitude,
                  latitude: item.latitude,
                };
                let textGraphic = new Graphic({
                  geometry: point,
                  symbol: {
                    type: 'text', // autocasts as new TextSymbol()
                    xoffset: '-15px',
                    yoffset: '-14px',
                    font: {
                      size: 8,
                    },
                    text: item.num,
                  },
                });
                let backGraphic = new Graphic({
                  geometry: point,
                  symbol: {
                    type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                    style: 'square',
                    color: 'white',
                    size: '24px', // pixels
                    yoffset: '-10px',
                    xoffset: '-15px',
                  },
                });
                return { backGraphic, textGraphic };
              });
              cityNum.forEach(item => {
                graphicsLayer.add(item.backGraphic);
                graphicsLayer.add(item.textGraphic);
              });
              // 红点代码
              const pointList = alarmList.map(item => {
                let point = {
                  type: 'point',
                  longitude: item.longitude,
                  latitude: item.latitude,
                };
                var pointGraphic = new Graphic({
                  geometry: point,
                  symbol: {
                    type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                    color: [226, 119, 40],
                    size: '32px',
                    outline: {
                      // autocasts as new SimpleLineSymbol()
                      color: 'black',
                      width: 1,
                    },
                  },
                });
                // graphicsLayer.add(pointGraphic);
                return { pointGraphic };
              });
              let showAlarm = true;
              let showPoint = true;
              let showText = true;
              view.watch('scale', function(e) {
                // console.log(e);
                if (e <= 3548.0843865217253) {
                  if (showAlarm) {
                    markerList.forEach(item => {
                      graphicsLayer.add(item.pointGraphic);
                      graphicsLayer.add(item.circleGraphic);
                      graphicsLayer.add(item.lineGraphic);
                      graphicsLayer.add(item.textPointGraphic);
                    });
                    showAlarm = false;
                  }
                } else {
                  showAlarm = true;
                  markerList.forEach(item => {
                    graphicsLayer.remove(item.pointGraphic);
                    graphicsLayer.remove(item.circleGraphic);
                    graphicsLayer.remove(item.lineGraphic);
                    graphicsLayer.remove(item.textPointGraphic);
                  });
                }
                if (e < 1221504 && e > 3548.0843865217253) {
                  if (showPoint) {
                    showPoint = false;
                    pointList.forEach(item => {
                      graphicsLayer.add(item.pointGraphic);
                    });
                  }
                } else {
                  showPoint = true;
                  pointList.forEach(item => {
                    graphicsLayer.remove(item.pointGraphic);
                  });
                }
                if (e >= 1221504) {
                  if (showText) {
                    showText = false;
                    cityNum.forEach(item => {
                      graphicsLayer.add(item.backGraphic);
                      graphicsLayer.add(item.textGraphic);
                    });
                  }
                } else {
                  showText = true;
                  cityNum.forEach(item => {
                    graphicsLayer.remove(item.backGraphic);
                    graphicsLayer.remove(item.textGraphic);
                  });
                }
              });
            })
            .catch(e => {
              console.log(e);
            });

          document.getElementsByClassName('esri-ui-top-left')[0].style.top =
            '40px';
          view.on('pointer-move', function(e) {
            view.hitTest(e).then(data => {
              if (data.results.length) {
                const graphic = data.results[0];
                if (!graphic.graphic.title) return;
                view.popup.location = null;
                view.popup.open({
                  title: `警报器编号：${graphic.graphic.title[0]}`,
                  content: `经度:${graphic.graphic.title[1]}，纬度:${graphic.graphic.title[2]}`,
                  location: graphic.mapPoint,
                });
              } else {
                view.popup.close();
              }
            });
          });
        },
      );
      return () => {
        // clean up the map view
        if (!!view) {
          view.destroy();
          view = null;
        }
      };
    },
    // only re-load the map if the id has changed
    [id],
  );
  return (
    <div style={{ background: '#f0f2f5' }}>
      {/* <button onClick={gotoPlace}>aa</button> */}
      <div id="left-panel" className={styles.leftPanel}>
        <Input.Search
          style={{ width: '425px' }}
          placeholder="请输入地址或设备编号"
          enterButton
          onSearch={gotoPlace}
        />
      </div>
      <div style={{ height: '100vh' }} ref={mapEl} />
    </div>
  );
}

const Demo = () => <EsriMap id="e691172598f04ea8881cd2a4adaa45ba" />;

export default Demo;
