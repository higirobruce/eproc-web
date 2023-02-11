import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Popconfirm,
  Radio,
  Spin,
  Steps,
  Tabs,
  Tag,
  TimePicker,
  Typography,
  Upload,
  Input,
  Divider,
  Alert,
  InputNumber,
  Popover,
  Rate,
} from "antd";
import UploadFiles from "./uploadFiles";
import {
  CheckOutlined,
  DislikeOutlined,
  FileDoneOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import Image from "next/image";

const RequestDetails = ({
  data,
  handleUpdateStatus,
  handleReject,
  loading,
  handleCreateTender,
  setConfirmRejectLoading,
  confirmRejectLoading,
  handleUpdateProgress,
  reload,
}) => {
  const [size, setSize] = useState("small");
  const [currentCode, setCurrentCode] = useState(-1);
  let [deadLine, setDeadLine] = useState(null);
  const [open, setOpen] = useState(false);
  let [reason, setReason] = useState("");
  let user = JSON.parse(localStorage.getItem("user"));
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [tender, setTender] = useState(null);
  let [po, setPO] = useState(null);
  let [currentStep, setCurrentStep] = useState(-1);
  let [progress, setProgress] = useState(0);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmRejectLoading(true);
    setTimeout(() => {
      handleReject(data._id, reason, `${user?.firstName} ${user?.lastName}`);
      setOpen(false);
      setConfirmRejectLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  useEffect(() => {
    let statusCode = getRequestStatusCode(data?.status);
    console.log(statusCode);
    setCurrentCode(statusCode);
    if (data) {
      checkTenderExists(data);
    }
  }, [data]);

  useEffect(() => {
    refresh();
  }, [reload]);

  function refresh() {
    let statusCode = getRequestStatusCode(data?.status);
    console.log(statusCode);
    setCurrentCode(statusCode);
    if (data) {
      checkTenderExists(data);
    }
  }

  useEffect(() => {
    if (tender) checkPOExists(tender);
    else setPO(null);
  }, [tender]);

  useEffect(() => {
    if (po && po.status !== "started") setCurrentStep(1);
    else if (po && po.status === "started") setCurrentStep(2);
    else if (tender) setCurrentStep(0);

    if (po?.deliveryProgress >= 100) setCurrentStep(3);
  }, [tender, po]);

  function getRequestStatus(code) {
    // if (code === 0) return "verified";
    if (code === 0) return "approved (hod)";
    else if (code === 1) return "approved (fd)";
    else if (code === 2) return "approved (pm)";
    else return "pending for approval";
  }

  function getRequestStatusCode(status) {
    // if (status === "verified") return 0;
    if (status === "approved (hod)") return 0;
    else if (status === "approved (fd)") return 1;
    else if (status === "approved (pm)") return 2;
    else return -1;
  }

  function changeStatus(statusCode) {
    setCurrentCode(statusCode);
    handleUpdateStatus(data._id, getRequestStatus(statusCode));
  }

  function createTender(tenderData) {
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

  function checkTenderExists(data) {
    fetch(`${url}/tenders/byRequest/${data._id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) setTender(res[0]);
        else setTender(null);
      });
  }

  function checkPOExists(tender) {
    fetch(`${url}/purchaseOrders/byTenderId/${tender?._id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) setPO(res[0]);
        else setPO(null);
      });
  }

  function handleGetProgress(value) {
    let t = 0;
    let totalItems = data?.items.map((i) => {
      t = parseInt(t) + parseInt(i?.quantity);
    });

    console.log((value / t) * 100);

    setProgress((value / t) * 100);
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
                  <div className="flex flex-col">
                    <div className="flex flex-row space-x-1 items-center">
                      <div className="text-xs font-semibold ml-3 text-gray-500">
                        Request Number:
                      </div>
                      <div className="text-sm font-semibold ml-3 text-gray-600">
                        {data?.number}
                      </div>
                    </div>

                    <div className="flex flex-row space-x-1 items-center">
                      <div className="text-xs font-semibold ml-3 text-gray-500">
                        Service category:
                      </div>
                      <div className="text-sm font-semibold ml-3 text-gray-600">
                        {data?.serviceCategory}
                      </div>
                    </div>

                    <div className="flex flex-row space-x-1 items-center">
                      <div className="text-xs font-semibold ml-3 text-gray-500">
                        Due date:
                      </div>
                      <div className="text-sm font-semibold ml-3 text-gray-600">
                        {moment(data?.dueDate).format("YYYY-MMM-DD")}
                      </div>
                    </div>

                    <div className="flex flex-row space-x-1 items-start">
                      <div className="text-xs font-semibold ml-3 text-gray-500">
                        Description:
                      </div>
                      <div className="text-sm font-semibold ml-3 text-gray-600 w-2/3">
                        {data?.description}
                      </div>
                    </div>
                  </div>
                  <Tag color={data.status === "declined" ? "red" : "geekblue"}>
                    {data.status}
                  </Tag>
                </div>

                {data.items.map((i, index) => {
                  return (
                    <div
                      className="mt-2 flex flex-row justify-between ring-1 ring-gray-200 rounded p-1"
                      key={index}
                    >
                      <div>
                        <div className="text-xs font-semibold ml-3 text-gray-800">
                          Item {index + 1}
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
                            Estimated cost:
                          </div>
                          <div className="text-sm font-semibold text-gray-600">
                            {i?.currency}{" "}
                            {(
                              i?.estimatedUnitCost * i?.quantity
                            ).toLocaleString()}
                          </div>
                        </div>

                        {po &&
                          buildConfirmDeliveryForm(
                            po,
                            handleGetProgress,
                            handleUpdateProgress,
                            progress
                          )}
                      </div>

                      <div className="self-center">
                        <Popover content="TOR">
                          <Image
                            className=" cursor-pointer hover:opacity-60"
                            width={40}
                            height={40}
                            src="/icons/icons8-file-64.png"
                          />
                        </Popover>
                      </div>
                    </div>
                  );
                })}

                {data.status !== "completed" &&
                  data.status !== "declined" &&
                  buildApprovalFlow(
                    currentCode,
                    changeStatus,
                    submitTenderData,
                    setDeadLine,
                    open,
                    handleOk,
                    setReason,
                    confirmRejectLoading,
                    handleCancel,
                    showPopconfirm,
                    data?.approvalDate
                  )}

                {data.status === "completed" &&
                  tender &&
                  buildWorkflow(currentStep, tender, po)}

                {po && po.deliveryProgress >= 100 && (
                  <>
                    <Divider></Divider>
                    <Typography.Title level={5}>
                      Supplier & Delivery Rate
                    </Typography.Title>
                    <Rate allowHalf defaultValue={2.5} />
                  </>
                )}

                {data.status === "declined" && (
                  <div className="flex flex-col mt-5 space-y-1">
                    <div className="text-xs font-semibold ml-3  text-gray-500">
                      The request was declined by {data?.declinedBy}. Below is
                      the reason/comment.
                    </div>
                    <div className="text-sm ml-3 text-gray-600">
                      <Alert message={data?.reasonForRejection} type="error" />
                    </div>
                  </div>
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
function buildApprovalFlow(
  currentCode,
  changeStatus,
  submitTenderData,
  setDeadLine,
  open,
  handleOk,
  setReason,
  confirmRejectLoading,
  handleCancel,
  showPopconfirm,
  date
) {
  // alert(date)
  return (
    <>
      <div className="mx-3 mt-5">
        <Steps
          direction="vertical"
          current={currentCode}
          progressDot
          // type="default"
          onChange={(v) => {
            changeStatus(v);
          }}
          items={[
            // {
            //   // title: "Finished",
            //   description: "Verified",
            // },
            {
              // title: "In Progress",
              title: "Approved by Head of the Department",
              description: `${currentCode === 0 ? moment(date).fromNow() : ""}`,
            },
            {
              // title: "Waiting",
              title: "Approved by the Head of finance",
              description: `${currentCode === 1 ? moment(date).fromNow() : ""}`,
            },
            {
              // title: "Waiting",
              title: "Approved by the Procurement Manager",
              description: `${currentCode === 2 ? moment(date).fromNow() : ""}`,
            },
          ]}
        />
      </div>

      {currentCode === 2 && (
        <Form onFinish={submitTenderData}>
          <Divider></Divider>

          <div className=" ml-3 mt-5 items-center">
            <Typography.Title level={5}>Create Tender</Typography.Title>
            <Form.Item name="tenderDocUrl" label="Tender Document (RFP/RFQ)">
              <UploadFiles />
            </Form.Item>
            <Form.Item
              name="deadLine"
              label="Submition Deadline"
              rules={[
                {
                  required: true,
                  message: "Please enter the submission deadline!",
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
                icon={<FileDoneOutlined />}
                type="primary"
                htmlType="submit"
              >
                Create Tender
              </Button>
            </Form.Item>
          </div>
        </Form>
      )}

      <Divider>Or</Divider>

      <Popconfirm
        title="Reject request"
        open={open}
        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        onConfirm={handleOk}
        description={
          <>
            <Typography.Text>Are you sure?</Typography.Text>
            <Input
              onChange={(v) => setReason(v.target.value)}
              placeholder="Reason for rejection"
            ></Input>
          </>
        }
        okButtonProps={{
          loading: confirmRejectLoading,
        }}
        onCancel={handleCancel}
      >
        <Button
          icon={<DislikeOutlined />}
          danger
          type="text"
          onClick={showPopconfirm}
        >
          Reject
        </Button>
      </Popconfirm>
    </>
  );
}

function buildWorkflow(currentStep, tender, po) {
  return (
    <>
      <Divider></Divider>
      <div className="flex flex-col mx-3 space-y-3">
        <Typography.Title className="self-center -mt-2" level={5}>
          Workflow tracker
        </Typography.Title>
        <Steps
          // direction="horizontal"
          labelPlacement="vertical"
          size="small"
          current={currentStep}
          items={[
            {
              title: `Tender ${tender.number}`,
              description: `${tender.status}`,
            },
            {
              title: po ? `PO ${po?.number}` : "PO",
            },
            {
              title: `${
                po?.status === "started" ? "Delivery started" : "Delivery"
              }`,
              description: po
                ? `${parseFloat(po?.deliveryProgress).toFixed(1)}%`
                : "",
            },
            {
              title: `Fully Delivered`,
              description: `${po?.deliveryProgress < 100 ? "In progress" : ""}`,
            },
          ]}
        />
      </div>
    </>
  );
}

function buildConfirmDeliveryForm(
  po,
  handleGetProgress,
  handleUpdateProgress,
  progress
) {
  return (
    <div className="ml-3 mt-2">
      {po?.status === "started" && po?.deliveryProgress < 100 && (
        <Form layout="inline" size="small">
          <Form.Item>
            <InputNumber
              placeholder="qty delivered"
              onChange={(value) => handleGetProgress(value)}
            />
          </Form.Item>

          <Form.Item>
            <Popover content="Confirm delivery">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => {
                  handleUpdateProgress(
                    po?._id,
                    parseFloat(progress) + parseFloat(po?.deliveryProgress)
                  );
                }}
              ></Button>
            </Popover>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
