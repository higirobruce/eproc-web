import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Radio,
  Spin,
  Steps,
  Tabs,
  Tag,
  TimePicker,
  Typography,
  Upload,
} from "antd";
import UploadFiles from "./uploadFiles";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";

const RequestDetails = ({
  data,
  handleUpdateStatus,
  loading,
  handleCreateTender,
}) => {
  const [size, setSize] = useState("small");
  const [currentCode, setCurrentCode] = useState(-1);
  let [deadLine, setDeadLine] = useState(null);

  useEffect(() => {
    let statusCode = getRequestStatusCode(data?.status);
    console.log(statusCode);
    setCurrentCode(statusCode);
  }, [data]);

  function getRequestStatus(code) {
    if (code === 0) return "verified";
    else if (code === 1) return "approved (hod)";
    else if (code === 2) return "approved (fd)";
    else if (code === 3) return "approved (pm)";
    else return "pending for approval";
  }

  function getRequestStatusCode(status) {
    if (status === "verified") return 0;
    else if (status === "approved (hod)") return 1;
    else if (status === "approved (fd)") return 2;
    else if (status === "approved (pm)") return 3;
    else return 0;
  }

  function changeStatus(statusCode) {
    setCurrentCode(statusCode);
    handleUpdateStatus(data._id, getRequestStatus(statusCode));
  }

  function createTender(tenderData) {
    console.log(tenderData);
    handleCreateTender(tenderData);
  }

  function submitTenderData(values) {
    let user = JSON.parse(localStorage.getItem("user"));
    let tData = {
      createdBy: user._id,
      items: data.items,
      dueDate: data.dueDate,
      status: "open",
      attachementUrls: [""],
      submissionDeadLine: new Date(deadLine),
      torsUrl: "url",
      purchaseRequest: data._id,
    };
    createTender(tData);
  }

  return (
    <div className="flex flex-col max-h-max ring-1 ring-gray-200 p-3 rounded shadow-md">
      <Tabs defaultActiveKey="1" type="card" size={size}>
        <Tabs.TabPane tab="Overview" key="1">
          {data ? (
            <Spin
              spinning={loading}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            >
              <>
                {/* TItle */}
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row space-x-1 items-center">
                    <div className="text-xs font-semibold ml-3 text-gray-500">
                      Tender Number:
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
                          {(
                            i?.estimatedUnitCost * i?.quantity
                          ).toLocaleString()}
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
                    </div>
                  );
                })}

                {data.status !== "converted" && (
                  <>
                    <div className="mx-3 mt-5">
                      <Steps
                        direction="vertical"
                        size="small"
                        current={currentCode}
                        progressDot
                        type="default"
                        onChange={(v) => {
                          changeStatus(v);
                        }}
                        items={[
                          {
                            // title: "Finished",
                            description: "Verified",
                          },
                          {
                            // title: "In Progress",
                            description: "Approved by Head of the Department",
                          },
                          {
                            // title: "Waiting",
                            description: "Approved by the Head of finance",
                          },
                          {
                            // title: "Waiting",
                            description: "Approved by the Procurement Manager",
                          },
                        ]}
                      />
                    </div>

                    {currentCode === 3 && (
                      <Form size="small" onFinish={submitTenderData}>
                        <div className=" ml-3 mt-5 items-center">
                          <Form.Item
                            name="tors"
                            label="Term of references"
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Please attach the TORs as a document!",
                            //   },
                            // ]}
                          >
                            <UploadFiles />
                          </Form.Item>
                          <Form.Item
                            name="deadLine"
                            label="Submition Deadline"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please enter the submission deadline!",
                              },
                            ]}
                          >
                            <DatePicker
                              format="YYYY-MM-DD HH:mm"
                              showTime
                              onChange={(v, str) => setDeadLine(str)}
                            />
                          </Form.Item>
                        </div>
                        <div className="flex flex-row space-x-1 ml-3 mt-5 items-center">
                          <Form.Item>
                            <Button
                              type="default"
                              htmlType="submit"
                              size="small"
                            >
                              Create Tender
                            </Button>
                          </Form.Item>
                          <Form.Item>
                            <Button type="default" size="small">
                              Create PO
                            </Button>
                          </Form.Item>
                        </div>
                      </Form>
                    )}
                  </>
                )}
              </>
            </Spin>
          ) : (
            <Empty />
          )}
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="New Task" key="2"></Tabs.TabPane> */}
      </Tabs>
    </div>
  );
};
export default RequestDetails;
