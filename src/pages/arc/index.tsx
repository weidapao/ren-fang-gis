import React, { useRef, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { Input } from 'antd';
import img from '../assets/alarm.png'

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

  const gotoPlace = () => {
    console.log(view);
    loadModules(['esri/geometry/Point']).then(([Point]) => {
      console.log('success');
      view.center = new Point({
        x: 118.78,
        y: 32.04,
        spatialReference: 4490,
      });
      view.goTo({ scale: 19000 });
    });
  };

  // use a side effect to create the map after react has rendered the DOM
  useEffect(
    () => {
      // define the view here so it can be referenced in the clean up function
      // the following code is based on this sample:
      // https://developers.arcgis.com/javascript/latest/sample-code/webmap-basic/index.html
      // first lazy-load the esri classes
      console.log('render');
      loadModules(
        [
          'esri/Map',
          'esri/views/MapView',
          'esri/layers/MapImageLayer',
          'esri/Graphic',
          'esri/layers/GraphicsLayer',
          'esri/geometry/Circle',
          'esri/Basemap',
        ],
        {
          css: true,
        },
      ).then(
        ([
          Map,
          MapView,
          MapImageLayer,
          Graphic,
          GraphicsLayer,
          Circle,
          Basemap,
        ]) => {
          // then we load a web map from an id
          var permitsLayer = new MapImageLayer({
            url:
              'http://218.94.0.22:8089/arcgis/rest/services/jssldt/MapServer',
          });
          var permitsLayer2 = new MapImageLayer({
            url: 'http://218.94.0.22:8089/arcgis/rest/services/jszj/MapServer',
          });
          var alarmList = [{ lng: 119.55, lat: 32.43,text:'aaaaaa' },{ lng: 120.55, lat: 32.42,text:'bbbbbbb' }];
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
            maxScale: 0, // User can overzoom tiles
            rotationEnabled: false, // Disables map rotation
            scale: 2443008,
          };
          var graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);
          // 警报点代码
          const markerList = alarmList.map(item => {
            let point = {
              type: 'point',
              longitude: item.lng,
              latitude: item.lat,
            };
            var pointGraphic = new Graphic({
              title:item.text,
              geometry: point,
              symbol: {
                type: 'picture-marker',
                url:img,
                width: '36px',
                height: '36px',
              },
            });

            var circle = new Circle({
              radius: 800,
              center: [item.lng, item.lat],
            });
            var circleGraphic = new Graphic(circle, {
              type: 'simple-fill', // autocasts as new SimpleFillSymbol()
              color: 'hsla(120, 100%, 50%, 0.5)',
              outline: {
                // autocasts as new SimpleLineSymbol()
                color: 'red',
                width: '0.5px',
                style: 'dash',
              },
            });
            graphicsLayer.add(circleGraphic)
            return pointGraphic;
          });
          // 添加text、背景标签
          const cityNum = jiangSuList.map(item => {
            let point = {
              type: 'point',
              longitude: item.lng,
              latitude: item.lat,
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
                text: '300',
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
            return {backGraphic,textGraphic}
          });
          cityNum.forEach(item=>{
            graphicsLayer.add(item.backGraphic);
            graphicsLayer.add(item.textGraphic);
          })
          let showPoint = true;
          view.watch('scale', function(e) {
            console.log(e);
            if (e < 1645249.5334976788) {
              if (showPoint) {
                markerList.forEach(item=>{
                  graphicsLayer.add(item);
                })
                cityNum.forEach(item=>{
                  graphicsLayer.remove(item.backGraphic);
                  graphicsLayer.remove(item.textGraphic);
                })
                showPoint = false;
              }
            } else {
              showPoint = true;
              markerList.forEach(item=>{
                graphicsLayer.remove(item);
              })
              cityNum.forEach(item=>{
                graphicsLayer.add(item.backGraphic);
                graphicsLayer.add(item.textGraphic);
              })
            }
          });
          view.on('pointer-move',function(e){
            view.hitTest(e).then(data=>{
              if (data.results.length) {
                const graphic = data.results[0]
                if(!graphic.graphic.title) return
                console.log(graphic)
                view.popup.location = null
                view.popup.open({
                  title: graphic.graphic.title,
                  content: 'hhhh',
                  location:graphic.mapPoint
                });
              }else{
                view.popup.close()
              }
            });
          })
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
        />
      </div>
      <div style={{ height: '100vh' }} ref={mapEl} />
    </div>
  );
}

const Demo = () => <EsriMap id="e691172598f04ea8881cd2a4adaa45ba" />;

export default Demo;
