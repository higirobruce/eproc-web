import React, { useState } from "react";
import { Radio, Tabs } from "antd";
const OverviewWindow = () => {
  const [size, setSize] = useState("small");
  const onChange = (e) => {
    setSize(e.target.value);
  };
  const items = [
    {
      label: `Email`,
      key: 1,
      children: ``,
    },
    {
      label: `Log a call`,
      key: 2,
      children: ``,
    },
    {
      label: `New task`,
      key: 3,
      children: ``,
    },
    {
      label: `New Event`,
      key: 4,
      children: ``,
    },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size={size} items={items} />
    </div>
  );
};
export default OverviewWindow;
