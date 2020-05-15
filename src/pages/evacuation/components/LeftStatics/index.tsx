import React, { useRef, memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Table, message } from 'antd';
import { columnsBase, columnsBase2 } from '../../../../configs';
import { CheckOutlined } from '@ant-design/icons';
import fetchUrl from '../../../utils';
import { getBack } from '../../../services';
// import ChartBar from '../../../../components/ChartBar';
import styles from './index.less';

// TODO: 写在组件里不会改变
let level = '1';

function LeftStatics(props) {
  const [title, setTitle] = useState('江苏省');
  const [initial, setInitial] = useState('江苏省');
  const [isChildren, setIsChildren] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [subCount, setSubCount] = useState(0);
  const [cityCopy, setCityCopy] = useState({
    areaName: '江苏省',
    level: '1',
    longitude: 119.24,
    latitude: 32.94,
  });
  const onClick = e => {
    if (props.cityInfo.level == 1 && !isChildren) {
      setTitle(e.name);
      setIsChildren(true);
      props.getDetail({ areaName: e.name, level: 2 }).then(data => {
        const dataMap = data.obj.map;
        setSubCount(data.obj.alarmCount);
        let dataArray = [];
        if (dataMap) {
          for (let i in dataMap) {
            dataArray.push({ name: i, value: dataMap[i] });
          }
          setSubData(dataArray);
        }
      });
    }
  };
  const getColumn = () => {
    const level = props.cityInfo.level;
    const columnList = [columnsBase, columnsBase, columnsBase2];
    return columnList[Number(level) - 1];
  };
  const clickRow = (e, record) => {
    switch (level) {
      case '1':
        props.setCityInfo({
          areaName: record.name,
          level: '2',
          longitude: record.longitude,
          latitude: record.latitude,
        });
        break;
      case '2':
        props.setCityInfo({
          areaName: record.name,
          level: '3',
          longitude: record.longitude,
          latitude: record.latitude,
        });
        break;
      case '3':
        props.goPoint(record.longitude, record.latitude);
        break;
    }
  };
  const goBack = () => {
    console.log(props.authInfo);
    switch (level) {
      case '2':
        if (props.authInfo.domainLevel != '1') {
          message.error('对不起，您无权限访问！');
          console.log('shashashashasha');
          break;
          return;
        }
        props.setCityInfo({
          areaName: '江苏省',
          level: '1',
          longitude: 119.24,
          latitude: 32.94,
        });
        break;
      case '3':
        if (props.authInfo.domainLevel == '3') {
          message.error('对不起，您无权限访问！');
          return;
        }
        fetchUrl(getBack, {
          district: title,
          ...props.authInfo,
        }).then(data => {
          props.setCityInfo({
            areaName: data.obj.cityName,
            level: '2',
            longitude: data.obj.longitude,
            latitude: data.obj.latitude,
          });
        });
        break;
    }
  };

  const changeOld = (index, showIndex) => {
    if (showIndex !== props.numSelect) {
      const newShow = [false, false, false];
      newShow[index] = !newShow[index];
      props.setOldShow(newShow);
      props.setNumSelect(showIndex);
    } else {
      const newOld = [...props.oldShow];
      newOld[index] = !newOld[index];
      props.setOldShow(newOld);
    }
  };

  const getTableData = () => {
    switch (props.numSelect) {
      case true:
        const oldName = ['正常', '相对老化', '严重老化'];
        if (props.cityInfo.level == '3') {
          if (!props.oldShow[0] && !props.oldShow[1] && !props.oldShow[2]) {
            return props.searchData.alarmLeftDatas;
          }
          if (props.oldShow[0] && props.oldShow[1] && props.oldShow[2]) {
            return props.searchData.alarmLeftDatas;
          }
          return props.searchData.alarmLeftDatas.filter(item => {
            const index = oldName.findIndex(
              oldItem => oldItem === item.burnin_status,
            );
            return props.oldShow[index];
          });
        }
        return props.searchData.alarmLeftDatas;
      case false:
        const oldName2 = ['电声', '电动', '多媒体'];
        if (props.cityInfo.level == '3') {
          if (!props.oldShow[0] && !props.oldShow[1] && !props.oldShow[2]) {
            return props.searchData.alarmLeftDatas;
          }
          if (props.oldShow[0] && props.oldShow[1] && props.oldShow[2]) {
            return props.searchData.alarmLeftDatas;
          }
          return props.searchData.alarmLeftDatas.filter(item => {
            const index = oldName2.findIndex(
              oldItem => item.alarm_type.indexOf(oldItem) > -1,
            );
            return props.oldShow[index];
          });
        }
        console.log(props.searchData.alarmLeftDatas);
        return props.searchData.alarmLeftDatas;
    }
  };

  useEffect(() => {
    setIsChildren(false);
    level = props.cityInfo.level;
    setTitle(props.cityInfo.areaName);
    setTotal(props.cityList[0].num);
    const dataMap = props.searchData.map;
    let dataArray = [];
    if (dataMap) {
      for (let i in dataMap) {
        dataArray.push({ name: i, value: dataMap[i] });
      }
      setData(dataArray);
    }
  }, [props.cityList, props.cityInfo, props.searchData]);
  return (
    <div className={styles.container}>
      <div style={{ paddingLeft: '12px' }}>
        <div className={styles.headContainer}>
          <p className={styles.title}>{title}</p>
          <div className={styles.goback}>
            {level != '1' && (
              <Button shape="round" onClick={goBack}>
                返回
              </Button>
            )}
          </div>
        </div>
        <p className={styles.subTitle}>疏散基地总数</p>
        <p className={styles.alarmNum}>{props.searchData.evaBaseCount}</p>
      </div>
      <div className={styles.tagList}>
        <div className={styles.tagItem4}>
          <span>{props.oldShow[0] && <CheckOutlined />}总面积(㎡)</span>
          <span>
            {props.searchData.evaBaseLeftData &&
              `${props.searchData.evaBaseLeftData[0].sumArea}`}
          </span>
        </div>
        <div className={styles.tagItem4}>
          <span>{props.oldShow[1] && <CheckOutlined />}人数上限</span>
          <span>
            {props.searchData.evaBaseLeftData &&
              `${props.searchData.evaBaseLeftData[0].sumMaxPeople}`}
          </span>
        </div>
      </div>
      <div className={styles.newScroll}>
        <Scrollbars
          style={{ width: '100%', height: '100%' }}
          renderThumbVertical={(...props) => (
            <div
              {...props}
              style={{ background: 'rgb(15, 83, 190)', borderRadius: '2px' }}
            />
          )}
        >
          <div style={{ paddingRight: '12px', paddingBottom: '6px' }}>
            <Table
              size="small"
              onRow={record => {
                return {
                  onClick: e => clickRow(e, record), // 点击行
                };
              }}
              rowClassName={(record, index) => {
                let className = styles.lightRow;
                if (index % 2 === 1) className = styles.darkRow;
                return className;
              }}
              // scroll={{ y: '50vh' }}
              pagination={false}
              dataSource={props.searchData.evaBaseTable}
              columns={getColumn()}
            />
          </div>
        </Scrollbars>
      </div>
    </div>
  );
}

export default memo(LeftStatics);
