import React, { useRef, memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Table } from 'antd';
import { columns1, columns2, columns3 } from '../../../../configs';
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
    const columnList = [columns1, columns2, columns3];
    return columnList[Number(level) - 1];
  };
  const clickRow = (e, record) => {
    switch (level) {
      case '1':
        setIsChildren(true);
        props.setCityInfo({
          areaName: record.areaName,
          level: '2',
          longitude: record.longitude,
          latitude: record.latitude,
        });
        break;
      case '2':
        setIsChildren(true);
        props.setCityInfo({
          areaName: record.areaName,
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
    switch (level) {
      case '2':
        setIsChildren(true);
        props.setCityInfo({
          areaName: '江苏省',
          level: '1',
          longitude: 119.24,
          latitude: 32.94,
        });
        break;
      case '3':
        fetchUrl(getBack, {
          district: title,
        }).then(data => {
          props.setCityInfo({
            areaName: data.obj.cityName,
            level: '2',
            longitude: data.obj.longitude,
            latitude: data.obj.longitude,
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
        <p className={styles.subTitle}>警报器总数</p>
        <p className={styles.alarmNum}>{props.searchData.alarmCount}</p>
      </div>
      <div className={styles.tagList}>
        <div onClick={() => changeOld(0, true)} className={styles.tagItem1}>
          <span>
            {props.numSelect && props.oldShow[0] && <CheckOutlined />}正 常
          </span>
          <span>
            {props.searchData.burnins && props.searchData.burnins.normal.num}
          </span>
        </div>
        <div onClick={() => changeOld(1, true)} className={styles.tagItem2}>
          <span>
            {props.numSelect && props.oldShow[1] && <CheckOutlined />}相对老化
          </span>
          <span>
            {props.searchData.burnins && props.searchData.burnins.relative.num}
          </span>
        </div>
        <div onClick={() => changeOld(2, true)} className={styles.tagItem3}>
          <span>
            {props.numSelect && props.oldShow[2] && <CheckOutlined />}严重老化
          </span>
          <span>
            {props.searchData.burnins && props.searchData.burnins.severity.num}
          </span>
        </div>
      </div>
      <div className={styles.tagList}>
        <div onClick={() => changeOld(0, false)} className={styles.tagItem1}>
          <span>
            {!props.numSelect && props.oldShow[0] && <CheckOutlined />}电声
          </span>
          <span>
            {props.searchData.alarmTypeCounts &&
              props.searchData.alarmTypeCounts.ds.num}
          </span>
        </div>
        <div onClick={() => changeOld(1, false)} className={styles.tagItem2}>
          <span>
            {!props.numSelect && props.oldShow[1] && <CheckOutlined />}电动
          </span>
          <span>
            {props.searchData.alarmTypeCounts &&
              props.searchData.alarmTypeCounts.dd.num}
          </span>
        </div>
        <div onClick={() => changeOld(2, false)} className={styles.tagItem3}>
          <span>
            {!props.numSelect && props.oldShow[2] && <CheckOutlined />}多媒体
          </span>
          <span>
            {props.searchData.alarmTypeCounts &&
              props.searchData.alarmTypeCounts.media.num}
          </span>
        </div>
      </div>
      <div style={{ height: '26vh' }}>
        <Scrollbars
          style={{ width: '100%', height: '100%' }}
          renderThumbVertical={(...props) => (
            <div
              {...props}
              style={{ background: 'rgb(15, 83, 190)', borderRadius: '2px' }}
            />
          )}
        >
          {/* <ChartBar onClick={onClick} data={isChildren ? subData : data} /> */}
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
              dataSource={getTableData()}
              columns={getColumn()}
            />
          </div>
        </Scrollbars>
      </div>
    </div>
  );
}

export default memo(LeftStatics);
