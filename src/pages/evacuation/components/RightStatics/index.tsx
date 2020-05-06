import React, { useRef, useEffect, useState } from 'react';
import RadarChart from '../EvaRadar';
import styles from './index.less';

function RightStatics(props) {
  const [radarData,setRadarData] = useState([{percent:0,num:0}])
  useEffect(()=>{
    if(props.searchData.malfunction){
      const radar = [
        {percent:props.searchData.conversionEvaBase,num:props.searchData.conversionEvaBase},
        {percent:props.searchData.settleEvaBase,num:props.searchData.settleEvaBase},
        {percent:props.searchData.lifeSupEvaBase,num:props.searchData.lifeSupEvaBase},
        {percent:props.searchData.managementCapaEvaBase,num:props.searchData.managementCapaEvaBase},
        {percent:props.searchData.necessaryFacEvaBase,num:props.searchData.necessaryFacEvaBase}
      ];
      setRadarData(radar)
    }
  },[props.searchData])
  return (
    <div className={styles.container}>
      <div style={{ height: '400px' }}>
        <RadarChart data={radarData} />
      </div>
    </div>
  );
}

export default RightStatics;
