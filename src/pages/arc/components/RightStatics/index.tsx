import React, { useRef, useEffect, useState } from 'react';
import ChartLines from '../../../../components/ChartLines';
import ChartPie from '../../../../components/ChartPie';
import RadarChart from '../../../../components/RadarChart';
import styles from './index.less';

function RightStatics(props) {
  const [radarData,setRadarData] = useState([])
  const [pieData,setPieData] = useState([{name:'',value:0}]) 
  const [yearnewData,setYearnewData] = useState([]) 
  const [yearAdds,setYearAdds] = useState([]) 
  useEffect(()=>{
    if(props.searchData.malfunction){
      const radar = [
        props.searchData.malfunction.percent,
        props.searchData.burnins.severity.percent,
        props.searchData.polling.percent,
        props.searchData.realName.percent,
        props.searchData.yearRenews[0].percent,
        props.searchData.yearAdds[0].percent,
      ];
      setRadarData(radar)
      const burnins = props.searchData.burnins
      setPieData([
        { name: burnins.severity.burninLevel, value: burnins.severity.num },
        { name: burnins.normal.burninLevel, value: burnins.normal.num },
        { name: burnins.relative.burninLevel, value: burnins.relative.num },
      ]);
      setYearnewData(props.searchData.yearRenews)
      setYearAdds(props.searchData.yearAdds)
    }
  },[props.searchData])
  return (
    <div className={styles.container}>
      <div style={{ height: 'calc(25vh)' }}>
        <RadarChart data={radarData} />
      </div>
      <div style={{ height: 'calc(20vh)'  }}>
        <ChartPie data={pieData} />
      </div>
      <div style={{ height: 'calc(20vh)'  }}>
        <ChartLines title={'年度换新比例和数量'} data={yearnewData} />
      </div>
      <div style={{ height: 'calc(20vh)'  }}>
        <ChartLines title={'年度新增比例和数量'} data={yearAdds} />
      </div>
    </div>
  );
}

export default RightStatics;
