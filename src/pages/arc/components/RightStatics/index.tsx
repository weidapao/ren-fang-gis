import React, { useRef, useEffect, useState } from 'react';
import ChartLines from '../../../../components/ChartLines';
import ChartPie from '../../../../components/ChartPie';
import RadarChart from '../../../../components/RadarChart';
import styles from './index.less';

function RightStatics(props) {
  const [radarData, setRadarData] = useState([{ percent: 0, num: 0 }]);
  const [pieData, setPieData] = useState([{ name: '', value: 0 }]);
  const [yearnewData, setYearnewData] = useState([]);
  const [yearAdds, setYearAdds] = useState([]);
  useEffect(() => {
    if (props.searchData.malfunction) {
      const radar = [
        {
          percent: props.searchData.malfunction.percent,
          num: props.searchData.malfunction.num,
        },
        {
          percent: props.searchData.burnins.severity.percent,
          num: props.searchData.burnins.severity.num,
        },
        {
          percent: props.searchData.polling.percent,
          num: props.searchData.polling.num,
        },
        {
          percent: props.searchData.realName.percent,
          num: props.searchData.realName.num,
        },
        {
          percent: props.searchData.yearRenews[0].percent,
          num: props.searchData.yearRenews[0].num,
        },
        {
          percent: props.searchData.yearAdds[0].percent,
          num: props.searchData.yearAdds[0].num,
        },
      ];
      setRadarData(radar);
      const burnins = props.searchData.burnins;
      setPieData([
        { name: burnins.severity.burninLevel, value: burnins.severity.num },
        { name: burnins.normal.burninLevel, value: burnins.normal.num },
        { name: burnins.relative.burninLevel, value: burnins.relative.num },
      ]);
      setYearnewData(props.searchData.yearRenews);
      setYearAdds(props.searchData.yearAdds);
    }
  }, [props.searchData]);
  return (
    <div className={styles.container}>
      <div style={{ height: '190px' }}>
        <RadarChart data={radarData} />
      </div>
      {/* <div style={{ height: '100px'  }}>
        <ChartPie data={pieData} />
      </div> */}
      <div style={{ height: '160px' }}>
        <ChartLines title={'年度换新比例和数量'} data={yearnewData} />
      </div>
      <div style={{ height: '160px' }}>
        <ChartLines title={'年度新增比例和数量'} data={yearAdds} />
      </div>
    </div>
  );
}

export default RightStatics;
