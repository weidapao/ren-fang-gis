import React, { useRef, useEffect, useState } from 'react';
import { Input, message, Select, Switch, Cascader, Button } from 'antd';
import { mapTypes } from '../../../../configs';
import styles from './index.less';

const { Option } = Select;

function CommitGroup(props) {
  const [alarmText, setAlarmText] = useState('');
  return (
    <div className={styles.container}>
      <Cascader
        defaultValue={['江苏省']}
        style={{ width: '180px', marginRight: '20px' }}
        options={props.cityList}
        onChange={props.selectCity}
        changeOnSelect
        placeholder="请选择地址"
        allowClear={false}
      />
      <Input
        value={alarmText}
        onChange={e => setAlarmText(e.target.value)}
        style={{ width: '140px', marginRight: '20px' }}
        placeholder="搜索报警器名称"
        onPressEnter={() => props.gotoPlace(alarmText)}
      />
      <Select
        style={{ width: '80px', marginRight: '20px' }}
        placeholder="选择地图"
        value={props.mapCheck}
        onChange={props.switchMap}
      >
        {mapTypes.map(item => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
      <span style={{color:'white'}}>布点测算：</span>
      <Switch onChange={props.budiancesuan} />
      <Button onClick={props.measure}>测距</Button>
    </div>
  );
}

export default CommitGroup;
