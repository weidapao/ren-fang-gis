import React, { useRef, useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { message } from 'antd';
import fetchUrl, { setMapProxy, formatCity, GetDistance, getInfoSHU } from '../utils';
import { levelScale, fontUrl, mapConfig } from '../../configs';
import { searchSiteSHU, searchCitySHU, getAllsiteSHU, getAnalysisSHU, getDistrictNumSHU } from '../services';
import LeftStatics from './components/LeftStatics';
import RightStatics from './components/RightStatics';
import CommitGroup from './components/CommitGroup';
import Lonlatutide from './components/Lonlatutide';
import img from '../../assets/images/alarm.png';
import bg from '../../assets/images/bg.png';
import pointIMG from '../../assets/images/point.png';
import markerBg from '../../assets/images/newBg.png';
import circleIMG from '../../assets/images/circle.png';
import removeIMG from '../../assets/images/remove.png';

import styles from './index.less';

// hooks allow us to create a map component as a function

let map = null;
let oilAndGasLayer = null;
let oilAndGasLayer2 = null;
let oilAndGasLayer3 = null;
let showCircle = false
let isdraw = false
let measurePoint = []
let measureList = []
let drawTemp = {total:0,graphic:[],measureId:''}
let timetemp = Date.now()
let toolbar = null
let measureId = 0

function EsriMap({ id }) {
  // create a ref to element to be used as the map's container
  const mapEl = useRef(null);
  const [cityValue, setCityValue] = useState('all');
  const [pointList, setPointList] = useState([]);
  const [alarmList, setAlarmList] = useState([]);
  const [positionInfo,setPositionInfo] = useState({longitude:0,latitude:0});
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
    return fetchUrl(getAnalysisSHU, { areaName,level })
  }

  const gotoPlace = (text: string) => {
    if (!text) return;
    setMapProxy();
    loadModules(['esri/geometry/Point', 'esri/SpatialReference']).then(
      ([Point, SpatialReference]) => {
        fetchUrl(searchSiteSHU, { name: text }).then(data => {
          if (data.flag) {
            message.success('查询疏散基地成功！');
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
            message.error('未搜索到疏散基地！');
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
        if (scale <= 60000) {
          alarmList.map(item => {
            if (item.alarmType !== '多媒体') {
              map.graphics.add(item.circleGraphic);
              map.graphics.add(item.lineGraphic);
              map.graphics.add(item.textPointGraphic);
            }
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

  const measure = () => {
    drawTemp.total = 0;
    drawTemp.graphic = []
    drawTemp.measureId = ''
    if (isdraw) {
      toolbar.deactivate();
      isdraw = false;
      return
    }
    setMapProxy();
    loadModules([
      'esri/toolbars/draw',
      'esri/symbols/CartographicLineSymbol',
      'esri/graphic',
      'esri/symbols/TextSymbol',
      'esri/geometry/Point'
    ]).then(([Draw, CartographicLineSymbol, Graphic, TextSymbol, Point]) => {
      toolbar = new Draw(map);
      const lineSymbol = new CartographicLineSymbol().setColor('red');
      isdraw = true;
      toolbar.activate(Draw.POLYLINE);
      function addToMap(evtObj) {
        measurePoint = [];
        isdraw = false;
        toolbar.deactivate();
        var geometry = evtObj.geometry;
        var graphic = new Graphic(geometry, lineSymbol);
        drawTemp.graphic.push(graphic);
        map.graphics.add(graphic);
      }
      toolbar.on('draw-end', addToMap);
    });
  }

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
        'esri/dijit/Scalebar',
        'esri/toolbars/draw',
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
        'esri/symbols/Font',
        'dojo/domReady!',
      ]).then(
        ([
          esriBasemaps,
          Map,
          Scalebar,
          Draw,
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
          Font,
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
            // basemap:'streets',
            center: [118.78, 32.04], // long, lat
            scale: 2443008,
            minScale: 4305300, // User cannot zoom out beyond a scale of 1:500,000
            maxScale: 1850, // User can overzoom tiles
            autoResize: false,
            isScrollWheelZoom: false,
            isZoomSlider: false,
            logo: false
          });
          var scalebar = new Scalebar({
            map: map,
            scalebarUnit: 'dual',
            attachTo: 'bottom-center',
          });
          map.addLayer(oilAndGasLayer);
          map.addLayer(oilAndGasLayer3);
          map.addLayer(oilAndGasLayer2);
          // map.hideZoomSlider();
          oilAndGasLayer3.hide();

          map.on('load', function() {
            Promise.all([
              fetchUrl(searchCitySHU),
              fetchUrl(getAllsiteSHU),
              fetchUrl(getDistrictNumSHU),
            ])
              .then(([data1, data2, data3]) => {
                const cityList = data1.obj;
                const alarmList = data2.obj;
                data3.obj.longitude = 119.24;
                data3.obj.latitude = 32.94;
                // 各区县经纬度
                const areaList = data3.obj.list.map(item => item.list);
                setCityList(formatCity([data3.obj]));
                // 红点代码
                const pointList = alarmList.map(item => {
                  var pt = new Point([item.longitude, item.latitude]);
                  var pointGraphic = new Graphic(
                    pt,
                    new PictureMarkerSymbol(pointIMG, 21.5, 27),
                  );
                  return { pointGraphic };
                });
                const textMaker = (name,num,item,level)=>{
                  let textSymbol = new TextSymbol(
                    `${name}: ${num}个`,
                  )
                    .setColor(new Color('blue'))
                    .setOffset(0, -4);
                  var font = new Font();
                  font.setSize('11pt');
                  font.setWeight(Font.WEIGHT_BOLD);
                  font.setFamily('黑体');
                  textSymbol.setFont(font);
                  let pictureMarkerSymbol = new PictureMarkerSymbol(
                    markerBg,
                    100,
                    24,
                  );
                  let pt = new Point([item.longitude, item.latitude]);
                  let graphic = new Graphic(pt, textSymbol, {
                    cityName: name,
                    longitude: item.longitude,
                    latitude: item.latitude,
                    level,
                  });
                  let pictureGraphic = new Graphic(pt, pictureMarkerSymbol, {
                    cityName: name,
                    longitude: item.longitude,
                    latitude: item.latitude,
                    level,
                  });
                  return {graphic,pictureGraphic}
                }
                // 添加text、背景标签
                const cityNum = cityList.map(item => {
                  const textObj = textMaker(item.cityName,item.num,item,'2')
                  map.graphics.add(textObj.graphic);
                  // map.graphics.add(textObj.pictureGraphic);
                  return textObj
                });
                // 区县的标签
                const areaNum = areaList.map(item => {
                  return item.map(ditem => {
                    const textObj = textMaker(ditem.name,ditem.num,ditem,'3')
                    return textObj;
                  });
                });
                // 警报点代码
                const markerList = alarmList.map(item => {
                  var pt = new Point([item.longitude, item.latitude]);
                  const str = getInfoSHU(item);
                  var pointGraphic = new Graphic(
                    pt,
                    new PictureMarkerSymbol(img, 36, 36),
                    {
                      title: item.id,
                      info: str,
                      longitude: item.longitude,
                      latitude: item.latitude,
                    },
                  );
                  var circleGeometry = new Circle({
                    center: pt,
                    radius: Number(item.radius),
                    geodesic: true,
                  });
                  var circleSymb = new SimpleFillSymbol(
                    SimpleFillSymbol.STYLE_NULL,
                    new SimpleLineSymbol(
                      SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                      new Color('red'),
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
                  lineSymbol.setColor('red');
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
                  var textSymbol = new TextSymbol(`半径:${item.radius}米`);
                  var textPointGraphic = new Graphic(textPoint, textSymbol);
                  return {
                    pointGraphic,
                    circleGraphic,
                    lineGraphic,
                    textPointGraphic,
                    alarmType: item.alarm_type
                  };
                });
                setAlarmList(markerList);
                setPointList(pointList);
                // 修改默认样式
                const scaleBar = document.getElementsByClassName('esriScalebar');
                scaleBar[0].style.left = '70%'
                const maxMInux = document.getElementById(
                  'esri.Map_0_zoom_slider',
                );
                if (maxMInux) maxMInux.style.display = 'none';
                let showAlarm = true;
                let showPoint = true;
                let showText = true;
                const switchAlarm = e => {
                  if (e <= 60000) {
                    if (showAlarm) {
                      markerList.forEach(item => {
                        map.graphics.add(item.pointGraphic);
                        if (showCircle) {
                          if (item.alarmType !== '多媒体') {
                            map.graphics.add(item.circleGraphic);
                            map.graphics.add(item.lineGraphic);
                            map.graphics.add(item.textPointGraphic);
                          }
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
                  if (e <= 60000 && e > 7000) {
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
                const switchArea = e => {
                  if (e < 152688 && e>60000) {
                    if (showText) {
                      areaNum.map(item => {
                        item.map(ditem => {
                          // map.graphics.add(ditem.pictureGraphic);
                          map.graphics.add(ditem.graphic);
                        });
                      });
                      showText = false;
                    }
                  } else {
                    if (!showText) {
                      showText = true;
                      areaNum.map(item => {
                        item.map(ditem => {
                          map.graphics.remove(ditem.pictureGraphic);
                          map.graphics.remove(ditem.graphic);
                        });
                      });
                    }
                  }
                };
                map.on('zoom-end', function(evt) {
                  console.log(map.getScale());
                  switchAlarm(map.getScale());
                  // switchPoint(map.getScale());
                  switchArea(map.getScale());
                });
                map.on('dbl-click', function(evt) {
                  if (isdraw) {
                    let textSymbol = new TextSymbol(
                      `总计${drawTemp.total.toFixed(2)}公里`,
                    ).setColor('white').setOffset(50, 40);
                    var totalGraphic = new Graphic(evt.mapPoint, textSymbol);
                    let pictureMarkerSymbol = new PictureMarkerSymbol(
                      markerBg,
                      120,
                      24,
                    ).setOffset(50, 45);
                    let removeSymbol = new PictureMarkerSymbol(
                      removeIMG,
                      24,
                      24,
                    ).setOffset(20, -20);
                    let removeGraphic = new Graphic(
                      evt.mapPoint,
                      removeSymbol,
                      {commit:'remove',id:measureId}
                    );
                    drawTemp.measureId = measureId
                    measureId++
                    let newPicture = new Graphic(evt.mapPoint, pictureMarkerSymbol);
                    drawTemp.graphic.push(newPicture);
                    drawTemp.graphic.push(totalGraphic);
                    drawTemp.graphic.push(removeGraphic);
                    map.graphics.add(newPicture);
                    map.graphics.add(totalGraphic);
                    map.graphics.add(removeGraphic);
                    measureList.push({total:drawTemp.total,graphic:drawTemp.graphic,measureId:drawTemp.measureId})
                  }
                });
                map.on('click', function(evt) {
                  if (evt.graphic && evt.graphic.attributes && evt.graphic.attributes.cityName) {
                    const areaName = evt.graphic.attributes.cityName;
                    const longitude = evt.graphic.attributes.longitude;
                    const latitude = evt.graphic.attributes.latitude;
                    const level = evt.graphic.attributes.level;
                    setCityInfo({ areaName, longitude, latitude, level });
                  }
                  if (evt.graphic && evt.graphic.attributes && evt.graphic.attributes.commit) {
                    const measureId = evt.graphic.attributes.id
                    console.log(measureId)
                    const measureLine = measureList.find(item=>item.measureId===measureId)
                    measureLine.graphic.map(item => {
                      map.graphics.remove(item);
                    });
                  }
                  if (isdraw) {
                    let clickTime = Date.now()
                    if (clickTime - timetemp < 300) {
                      timetemp = Date.now();
                      return;
                    }
                    timetemp = Date.now()
                    measurePoint.push(evt.mapPoint)
                    let pictureMarkerSymbol = new PictureMarkerSymbol(
                      circleIMG,
                      16,
                      16,
                    );
                    let pictureGraphic = new Graphic(
                      evt.mapPoint,
                      pictureMarkerSymbol,
                    );
                    const pointLength = measurePoint.length
                    if (pointLength > 1) {
                      let distance = GetDistance(measurePoint[pointLength-2],measurePoint[pointLength-1])
                      drawTemp.total+=  Number(distance)
                      let textSymbol = new TextSymbol(`${distance}公里`).setColor(new Color('white'))
                      .setOffset(10, 10);
                      let distanceGraphic = new Graphic(
                        evt.mapPoint,
                        textSymbol,
                      );
                      let pictureMarkerSymbol = new PictureMarkerSymbol(
                        markerBg,
                        70,
                        24,
                      ).setOffset(10, 15);
                      let newPicture = new Graphic(evt.mapPoint, pictureMarkerSymbol);
                      drawTemp.graphic.push(newPicture)
                      drawTemp.graphic.push(distanceGraphic)
                      map.graphics.add(newPicture);
                      map.graphics.add(distanceGraphic);
                    }
                    drawTemp.graphic.push(pictureGraphic)
                    map.graphics.add(pictureGraphic);
                  }
                });
                map.on('mouse-move', function(evt) {
                  setPositionInfo({
                    longitude: evt.mapPoint.x,
                    latitude: evt.mapPoint.y,
                  });
                });
                map.on('mouse-over', function(evt) {
                  if (
                    evt.graphic &&
                    evt.graphic.attributes &&
                    evt.graphic.attributes.title
                  ) {
                    var title = `警报器id:${evt.graphic.attributes.title}`;
                    var content = evt.graphic.attributes.info;
                    map.infoWindow.setTitle(title);
                    map.infoWindow.setContent(content);
                    // Show the info window
                    map.infoWindow.show(evt.mapPoint);
                  } else {
                    map.infoWindow.hide();
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
    if (map) {
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
        padding:0,
        margin:0,
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className={styles.topHead}>
        <span>疏散基地能力分析</span>
      </div>
      <div
        style={{
          position: 'absolute',
          width:'64vw',
          top: '84px',
          left:'18vw',
          right:'18vw',
          zIndex: 38,
        }}
      >
        <div style={{display:'flex',justifyContent:'space-between',padding:'24px'}}>
          <CommitGroup
            selectCity={selectCity}
            gotoPlace={gotoPlace}
            mapCheck={check}
            switchMap={switchMap}
            showCircle={showCircle}
            budiancesuan={budiancesuan}
            cityList={cityList}
            measure={measure}
          />
          <Lonlatutide longitude={positionInfo.longitude} latitude={positionInfo.latitude}/>
        </div>
      </div>
      <div className={styles.newStatics}>
        <LeftStatics
          total={total}
          getDetail={getDetail}
          searchData={staticsData}
          cityList={cityList}
          cityInfo={cityInfo}
        />
        <div style={{ flex: 1, minHeight: '100vh',paddingTop:'64px' }} ref={mapEl} />
        <RightStatics searchData={staticsData} />
      </div>
    </div>
  );
}

const Demo = () => <EsriMap id="e691172598f04ea8881cd2a4adaa45ba" />;

export default Demo;
