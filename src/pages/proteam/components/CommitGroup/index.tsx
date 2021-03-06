import React, { useRef, useEffect, useState } from 'react';
import { Input, message, Select, Switch, Cascader, Button } from 'antd';
import debounce from 'lodash/debounce';
import fetchUrl from '../../../utils';
import { mapTypes } from '../../../../configs';
import { searchTeam } from '../../../services';
import styles from './index.less';

const { Option } = Select;

function CommitGroup(props) {
  const [alarmText, setAlarmText] = useState('');
  const [baseList, setBaseList] = useState([]);

  const searchSite = text => {
    if (!text) return;
    fetchUrl(searchTeam, {
      name: text,
      ...props.authInfo,
      ...props.cityInfo,
    }).then(data => {
      if (data.obj) {
        setBaseList(data.obj);
      } else {
        setBaseList([]);
      }
    });
  };

  const handleChange = (value, option) => {
    const baseinfo = option.baseinfo;
    console.log(baseinfo);
    props.gotoPlace(baseinfo);
  };

  return (
    <div className={styles.container}>
      <Cascader
        defaultValue={[]}
        style={{ width: '110px', marginRight: '6px', height: '32px' }}
        options={props.cityList}
        onChange={props.selectCity}
        changeOnSelect
        placeholder="请选择地址"
        allowClear={false}
      />
      <Select
        showSearch
        labelInValue
        placeholder="搜索专业队"
        filterOption={false}
        onSearch={debounce(searchSite, 800)}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: '200px' }}
        onChange={handleChange}
        style={{ width: '100px', marginRight: '6px', height: '32px' }}
      >
        {baseList.map(d => (
          <Option baseinfo={d} key={d.id}>
            {d.professionalTeamName}
          </Option>
        ))}
      </Select>
      <Select
        style={{ width: '70px', marginRight: '6px' }}
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
      {/* <span style={{ color: 'white' }}>布点测算：</span>
      <Switch onChange={props.budiancesuan} /> */}
      <Button style={{ marginLeft: '12px' }} onClick={props.measure}>
        测距
      </Button>
    </div>
  );
}

export default CommitGroup;
