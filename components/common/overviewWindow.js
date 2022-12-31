import React, { useState } from "react";
import { Empty, Radio, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
const OverviewWindow = () => {
  const [size, setSize] = useState("small");
  const onChange = (e) => {
    setSize(e.target.value);
  };
  const items = [
    {
      label: `Overview`,
      key: 1,
      children: `<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />`,
    },
    {
      label: `New task`,
      key: 3,
      children: ``,
    },
  ];
  return (
    <div>
      <Tabs  defaultActiveKey="1" type="card" size={size} >
        <TabPane tab="Overview" key="1">
          <Empty />
        </TabPane>
        <TabPane tab="New Task" key="2">
          
        </TabPane>
  
      </Tabs>
    </div>
  );
};
export default OverviewWindow;
