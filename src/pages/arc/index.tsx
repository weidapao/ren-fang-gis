import React, { useRef, useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { message } from 'antd';
import fetchUrl, { setMapProxy, formatCity } from '../utils';
import { levelScale, fontUrl, jiangSuList, mapConfig } from '../../configs';
import { searchSite, searchCity, getAllsite, getAnalysis, getDistrictNum } from '../services';
import LeftStatics from './components/LeftStatics';
import RightStatics from './components/RightStatics';
import CommitGroup from './components/CommitGrop';
import img from '../../assets/images/alarm.png';
import bg from '../../assets/images/bg.png';
import pointIMG from '../../assets/images/point.png';
import markerBg from '../../assets/images/newBg.png';

import styles from './index.less';

// hooks allow us to create a map component as a function

let map = null;
let oilAndGasLayer = null;
let oilAndGasLayer2 = null;
let oilAndGasLayer3 = null;
let showCircle = false

function EsriMap({ id }) {
  // create a ref to element to be used as the map's container
  const mapEl = useRef(null);
  const [cityValue, setCityValue] = useState('all');
  const [pointList, setPointList] = useState([]);
  const [alarmList, setAlarmList] = useState([]);
  const [cityInfo, setCityInfo] = useState({
    areaName: '江苏省',
    level: '1',
    longitude: 119.24,
    latitude: 32.94,
  });
  const [staticsData,setStaticsData] = useState({map:{}})
  const [cityList,setCityList] = useState([{num:0}])
  const [check, setCheck] = useState(0);
  const [total, setTotal] = useState(0);

  const getDetail = ({areaName,level})=>{
    return fetchUrl(getAnalysis, { areaName,level })
  }

  const gotoPlace = (text: string) => {
    if (!text) return;
    setMapProxy();
    loadModules(['esri/geometry/Point', 'esri/SpatialReference']).then(
      ([Point, SpatialReference]) => {
        fetchUrl(searchSite, { alarmSiteID: text }).then(data => {
          if (data.flag) {
            message.success('查询警报点成功！');
            const scale = check ? mapConfig[1].scale : mapConfig[0].scale;
            map.setScale(scale).then(() => {
              map.centerAt(
                new Point(
                  data.obj.longitude,
                  data.obj.latitude,
                  new SpatialReference({ wkid: 4490 }),
                ),
              );
            });
          } else {
            message.error('未搜索到警报点！');
          }
        });
      },
    );
  };

  const switchMap = value => {
    setCheck(value);
    switch (value) {
      case 1:
        const maxScale = mapConfig[1].maxScale;
        map._params.maxScale = maxScale;
        const scale = map.getScale();
        oilAndGasLayer.hide();
        oilAndGasLayer3.show();
        if (scale < maxScale) {
          map.setScale(maxScale);
        }
        break;
      case 0:
        map._params.maxScale = mapConfig[0].maxScale;
        oilAndGasLayer.show();
        oilAndGasLayer3.hide();
    }
  };

  const selectCity = (cityId, option) => {
    const length = option.length
    setCityInfo({
      areaName: option[length - 1].value,
      level: option[length - 1].level,
      longitude: option[length - 1].longitude,
      latitude: option[length - 1].latitude,
    });
  };

  const budiancesuan = value => {
    showCircle = value;
    switch (value) {
      case true:
        const scale = map.getScale();
        if (scale <= 7000) {
          alarmList.map(item => {
            map.graphics.add(item.circleGraphic);
            map.graphics.add(item.lineGraphic);
            map.graphics.add(item.textPointGraphic);
          });
        }
        break;
      case false:
        alarmList.map(item => {
          map.graphics.remove(item.circleGraphic);
          map.graphics.remove(item.lineGraphic);
          map.graphics.remove(item.textPointGraphic);
        });
    }
  };

  // use a side effect to create the map after react has rendered the DOM
  useEffect(
    () => {
      // define the view here so it can be referenced in the clean up function
      // the following code is based on this sample:
      // https://developers.arcgis.com/javascript/latest/sample-code/webmap-basic/index.html
      // first lazy-load the esri classes
      setMapProxy();
      loadModules([
        'esri/basemaps',
        'esri/map',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/TextSymbol',
        'esri/graphic',
        'esri/geometry/Circle',
        'esri/symbols/PictureMarkerSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/geometry/Polyline',
        'esri/InfoTemplate',
        'esri/Color',
        'esri/SpatialReference',
        'dojo/domReady!',
      ]).then(
        ([
          esriBasemaps,
          Map,
          ArcGISDynamicMapServiceLayer,
          Point,
          SimpleMarkerSymbol,
          TextSymbol,
          Graphic,
          Circle,
          PictureMarkerSymbol,
          SimpleFillSymbol,
          SimpleLineSymbol,
          Polyline,
          InfoTemplate,
          Color,
          SpatialReference,
        ]) => {
          oilAndGasLayer = new ArcGISDynamicMapServiceLayer(
            'http://218.94.0.22:8089/arcgis/rest/services/jssldt/MapServer',
            {
              id: 'oilAndGasLayer',
            },
          );
          oilAndGasLayer2 = new ArcGISDynamicMapServiceLayer(
            'http://218.94.0.22:8089/arcgis/rest/services/jszj/MapServer',
            {
              id: 'oilAndGasLayer2',
            },
          );

          oilAndGasLayer3 = new ArcGISDynamicMapServiceLayer(
            'http://218.94.0.22:8089/arcgis/rest/services/jsyx/MapServer',
            {
              id: 'oilAndGasLayer3',
            },
          );

          map = new Map(mapEl.current, {
            center: [118.78, 32.04], // long, lat
            scale: 2443008,
            minScale: 4305300, // User cannot zoom out beyond a scale of 1:500,000
            maxScale: 1850, // User can overzoom tiles
            autoResize: false,
            isScrollWheelZoom: false,
            isZoomSlider: false,
          });
          map.addLayer(oilAndGasLayer);
          map.addLayer(oilAndGasLayer3);
          map.addLayer(oilAndGasLayer2);
          map.hideZoomSlider();
          oilAndGasLayer3.hide();

          map.on('load', function() {
            Promise.all([fetchUrl(searchCity), fetchUrl(getAllsite), fetchUrl(getDistrictNum)])
              .then(([data1, data2, data3]) => {
                const cityList = data1.obj;
                const alarmList = data2.obj;
                data3.obj.longitude=119.24
                data3.obj.latitude=32.94
                // 各区县经纬度
                const areaList = data3.obj.list.map(item=>item.list)
                setCityList(formatCity([data3.obj]))
                // 红点代码
                const pointList = alarmList.map(item => {
                  var pt = new Point([item.longitude, item.latitude]);
                  var pointGraphic = new Graphic(
                    pt,
                    new PictureMarkerSymbol(pointIMG, 21.5, 27),
                  );
                  return { pointGraphic };
                });
                // 添加text、背景标签
                const cityNum = cityList.map(item => {
                  let textSymbol = new TextSymbol(
                    `${item.cityName}: ${item.num}个`,
                  ).setColor(new Color('white')).setOffset(0,-4);
                  let pictureMarkerSymbol = new PictureMarkerSymbol(
                    markerBg,
                    100,
                    24,
                  );
                  let pt = new Point([item.longitude, item.latitude]);
                  let graphic = new Graphic(pt, textSymbol, {
                    cityName: item.cityName,
                    longitude: item.longitude,
                    latitude: item.latitude,
                    level: '2'
                  });
                  let pictureGraphic = new Graphic(pt, pictureMarkerSymbol, {
                    cityName: item.cityName,
                    longitude: item.longitude,
                    latitude: item.latitude,
                    level: '2'
                  });
                  map.graphics.add(pictureGraphic);
                  map.graphics.add(graphic);
                });
                // 区县的标签
                const areaNum = areaList.map(item => {
                  return item.map(ditem=>{
                    let textSymbol = new TextSymbol(
                      `${ditem.name}: ${ditem.num}个`,
                    ).setColor(new Color('white')).setOffset(0,-4);
                    let pictureMarkerSymbol = new PictureMarkerSymbol(
                      markerBg,
                      100,
                      24,
                    );
                    let pt = new Point([ditem.longitude, ditem.latitude]);
                    let graphic = new Graphic(pt, textSymbol, {
                      cityName: ditem.name,
                      longitude: ditem.longitude,
                      latitude: ditem.latitude,
                      level: '3'
                    });
                    let pictureGraphic = new Graphic(pt, pictureMarkerSymbol, {
                      cityName: ditem.name,
                      longitude: ditem.longitude,
                      latitude: ditem.latitude,
                      level: '3'
                    });
                    return {pictureGraphic,graphic}
                  })
                });
                // 警报点代码
                const markerList = alarmList.map(item => {
                  var pt = new Point([item.longitude, item.latitude]);
                  var infoTemplate = new InfoTemplate(
                    `警报器id：${item.id}`,
                    `经度：${item.longitude}, 纬度：${item.latitude}`,
                  );
                  var pointGraphic = new Graphic(
                    pt,
                    new PictureMarkerSymbol(img, 36, 36),
                    { title: [item.id, item.longitude, item.latitude] },
                    infoTemplate,
                  );
                  var circleGeometry = new Circle({
                    center: pt,
                    radius: 80,
                    geodesic: true,
                  });
                  var circleSymb = new SimpleFillSymbol(
                    SimpleFillSymbol.STYLE_NULL,
                    new SimpleLineSymbol(
                      SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                      new Color([105, 105, 105]),
                      2,
                    ),
                    new Color([255, 255, 0, 0.25]),
                  );
                  var circleGraphic = new Graphic(circleGeometry, circleSymb);
                  var line = new Polyline({
                    paths: [
                      [
                        [circleGeometry.center.x, circleGeometry.center.y],
                        circleGeometry.rings[0][45],
                      ],
                    ],
                  });
                  var lineSymbol = new SimpleLineSymbol();
                  var lineGraphic = new Graphic(line, lineSymbol);
                  var textPoint = new Point([
                    (Number(circleGeometry.rings[0][45][0]) +
                      Number(circleGeometry.center.x)) /
                      2,
                    (Number(circleGeometry.rings[0][45][1]) +
                      Number(circleGeometry.center.y)) /
                      2 +
                      0.00005,
                  ]);
                  var textSymbol = new TextSymbol('半径:800米');
                  var textPointGraphic = new Graphic(textPoint, textSymbol);
                  return {
                    pointGraphic,
                    circleGraphic,
                    lineGraphic,
                    textPointGraphic,
                  };
                });
                setAlarmList(markerList);
                setPointList(pointList);
                const maxMInux = document.getElementById(
                  'esri.Map_0_zoom_slider',
                );
                if (maxMInux) maxMInux.style.display = 'none';
                let showAlarm = true;
                let showPoint = true;
                let showText = true;
                const switchAlarm = e => {
                  if (e <= 7000) {
                    if (showAlarm) {
                      markerList.forEach(item => {
                        map.graphics.add(item.pointGraphic);
                        if (showCircle) {
                          map.graphics.add(item.circleGraphic);
                          map.graphics.add(item.lineGraphic);
                          map.graphics.add(item.textPointGraphic);
                        }
                      });
                      showAlarm = false;
                    }
                  } else {
                    showAlarm = true;
                    markerList.forEach(item => {
                      map.graphics.remove(item.pointGraphic);
                      map.graphics.remove(item.circleGraphic);
                      map.graphics.remove(item.lineGraphic);
                      map.graphics.remove(item.textPointGraphic);
                    });
                  }
                };
                const switchPoint = e => {
                  if (e < 1221504 && e > 7000) {
                    if (showPoint) {
                      showPoint = false;
                      pointList.forEach(item => {
                        map.graphics.add(item.pointGraphic);
                      });
                    }
                  } else {
                    showPoint = true;
                    pointList.forEach(item => {
                      map.graphics.remove(item.pointGraphic);
                    });
                  }
                };
                const switchArea = e=>{
                  if (e < 152688) {
                    if(showText){
                      areaNum.map(item=>{
                        item.map(ditem=>{
                          map.graphics.add(ditem.pictureGraphic);
                          map.graphics.add(ditem.graphic);
                        })
                      })
                      showText = false
                    }
                  } else {
                    if(!showText){
                      showText = true
                      areaNum.map(item=>{
                        item.map(ditem=>{
                          map.graphics.remove(ditem.pictureGraphic);
                          map.graphics.remove(ditem.graphic);
                        })
                      })
                    }
                  }
                }
                map.on('zoom-end', function(evt) {
                  console.log(map.getScale())
                  switchAlarm(map.getScale());
                  switchPoint(map.getScale());
                  switchArea(map.getScale())
                });
                map.on('click', function(evt) {
                  if (evt.graphic && evt.graphic.attributes) {
                    console.log(evt.graphic.attributes);
                    const areaName = evt.graphic.attributes.cityName
                    const longitude = evt.graphic.attributes.longitude
                    const latitude = evt.graphic.attributes.latitude
                    const level = evt.graphic.attributes.level
                    setCityInfo({ areaName, longitude, latitude, level });
                  }
                });
              })
              .catch(e => {
                console.log(e);
              });
          });
        },
      );
      return () => {
        // clean up the map view
        // if (!!view) {
        //   view.destroy();
        //   view = null;
        // }
      };
    },
    // only re-load the map if the id has changed
    [id],
  );
  useEffect(()=>{
    if(map){
      setMapProxy();
      loadModules(['esri/geometry/Point', 'esri/SpatialReference']).then(
        ([Point, SpatialReference]) => {
          map.setScale(levelScale.get(cityInfo.level)).then(() => {
            map.centerAt(
              new Point(
                cityInfo.longitude,
                cityInfo.latitude,
                new SpatialReference({ wkid: 4490 }),
              ),
            );
          });
        },
      );
    }
    getDetail(cityInfo).then(data=>{
      setStaticsData(data.obj)
    }).catch(e=>{
      console.log(e);
    })
  },[cityInfo])
  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className={styles.topHead}>
        <span>江苏人防警报器资源分析</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: '440px',
          top: '84px',
          zIndex: 888,
        }}
      >
        <CommitGroup
          selectCity={selectCity}
          gotoPlace={gotoPlace}
          mapCheck={check}
          switchMap={switchMap}
          showCircle={showCircle}
          budiancesuan={budiancesuan}
          cityList={cityList}
        />
      </div>
      <div className={styles.statics}>
        <LeftStatics total={total} getDetail={getDetail} searchData={staticsData} cityList={cityList} cityInfo={cityInfo} />
      </div>
      <div className={styles.statics} style={{ right: '20px' }}>
        <RightStatics searchData={staticsData} />
      </div>
      <div style={{ minHeight: 'calc(100vh)' }} ref={mapEl} />
    </div>
  );
}

const Demo = () => <EsriMap id="e691172598f04ea8881cd2a4adaa45ba" />;

export default Demo;
