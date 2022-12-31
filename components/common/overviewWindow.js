import React, { useState } from "react";
import { Button, Empty, Radio, Steps, Tabs, Tag, Typography } from "antd";
import Link from "next/link";
import {
  CheckOutlined,
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
const OverviewWindow = ({ data }) => {
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
    <div className="flex flex-col max-h-max ring-1 ring-gray-200 p-3 rounded">
      <Tabs defaultActiveKey="1" type="card" size={size}>
        <Tabs.TabPane tab="Overview" key="1">
          {data ? (
            <>
              {/* TItle */}
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-1 items-center">
                  <div className="text-xs font-semibold ml-3 text-gray-500">
                    Request Number:
                  </div>
                  <div className="text-sm font-semibold ml-3 text-gray-600">
                    {data?.number}
                  </div>
                </div>
                <Tag color="geekblue">{data.status}</Tag>
              </div>

              {data.items.map((i, index) => {
                return (
                  <div className="mt-5" key={index}>
                    <div className="text-xs font-semibold ml-3 text-gray-500">
                      <Tag>Item {index + 1}</Tag>
                    </div>
                    <div className="flex flex-row space-x-1 items-center">
                      <div className="text-xs font-semibold ml-3 text-gray-500">
                        Description:
                      </div>
                      <div className="text-sm font-semibold text-gray-600">
                        {i?.title}
                      </div>
                    </div>
                    <div className="flex flex-row space-x-1 items-center">
                      <div className="text-xs font-semibold ml-3 text-gray-500">
                        Quantity:
                      </div>
                      <div className="text-sm font-semibold text-gray-600">
                        {i?.quantity}
                      </div>
                    </div>
                    <div className="flex flex-row space-x-1 items-center">
                      <div className="text-xs font-semibold ml-3 text-gray-500">
                        Service category:
                      </div>
                      <div className="text-sm font-semibold text-gray-600">
                        {i?.serviceCategory}
                      </div>
                    </div>

                    <div className="flex flex-row space-x-1 items-center">
                      <div className="text-xs font-semibold ml-3 text-gray-500">
                        Estimated cost:
                      </div>
                      <div className="text-sm font-semibold text-gray-600">
                        {i?.currency}{" "}
                        {(i?.estimatedUnitCost * i?.quantity).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-row space-x-1 items-center">
                      <div className="text-xs font-semibold ml-3 text-gray-500">
                        Links:
                      </div>
                      <div className="text-sm font-semibold text-gray-600">
                        <a href={i.links}>
                          <Typography.Text style={{ width: 200 }} ellipsis>
                            {i.links}
                          </Typography.Text>
                        </a>
                      </div>
                    </div>

                    <div className="mx-3 mt-5">
                      <Steps
                        direction="vertical"
                        size="small"
                        current={3}
                        items={[
                          {
                            // title: "Finished",
                            description: 'Verification',
                          },
                          {
                            // title: "In Progress",
                            description:'HOD Approval',
                          },
                          {
                            title: "Waiting",
                            description:'FD Approval',
                          },
                          {
                            title: "Waiting",
                            description:'PM Approval',
                          },
                        ]}

                      />
                    </div>

                    <div className="flex flex-row space-x-1 ml-3 mt-5 items-center">
                      <Button type="default" size="small">
                        Create Tender
                      </Button>

                      <Button type="default" size="small">
                        Create PO
                      </Button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <Empty />
          )}
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="New Task" key="2"></Tabs.TabPane> */}
      </Tabs>
    </div>
  );
};
export default OverviewWindow;
