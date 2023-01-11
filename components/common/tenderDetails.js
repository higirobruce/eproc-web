import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Steps,
  Tabs,
  Tag,
  TimePicker,
  Typography,
  Upload,
  message,
} from "antd";
import UploadFiles from "./uploadFiles";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import BidList from "./bidList";

const TenderDetails = ({
  data,
  handleUpdateStatus,
  loading,
  handleCreateSubmission,
  handleClose,
  handleRefreshData,
}) => {
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  const [messageApi, contextHolder] = message.useMessage();
  const [size, setSize] = useState("small");
  const [currentCode, setCurrentCode] = useState(-1);
  let [deadLine, setDeadLine] = useState(null);
  let user = JSON.parse(localStorage.getItem("user"));
  let [proposalUrls, setProposalUrls] = useState([""]);
  let [deliveryDate, setDeliveryDate] = useState(null);
  let [price, setPrice] = useState(0);
  let [warranty, setWarranty] = useState(0);
  let [discount, setDiscount] = useState(0);
  let [comment, setComment] = useState("");
  let [currency, setCurrency] = useState("RWF");
  let [iSubmitted, setISubmitted] = useState(false);
  let [checkingSubmission, setCheckingSubmission] = useState(false);
  let [refresh, setRefresh] = useState(1)
  const props = {
    name: "file",
    action: "https://run.mocky.io/v3/a42ee557-1ae7-49d7-878f-dd8599fab9d6",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  useEffect(() => {
    let statusCode = getRequestStatusCode(data?.status);
    console.log(statusCode);
    setCurrentCode(1);
    if (data) checkSubmission();
  }, [data]);

  function checkSubmission() {
    setCheckingSubmission(true);
    fetch(`${url}/submissions/submitted/${data?._id}?vendorId=${user?._id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setISubmitted(res);
        setCheckingSubmission(false);
      })
      .catch((err) => {
        setCheckingSubmission(false);
        setISubmitted(true);
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

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

  function createSubmission(submissionData) {
    handleCreateSubmission(submissionData);
  }

  function submitSubmissionData() {
    let subData = {
      proposalUrls,
      deliveryDate,
      price,
      warranty,
      discount,
      status: "pending",
      comment,
      createdBy: user._id,
      tender: data._id,
    };
    createSubmission(subData);
  }

  function handleSelectBid(bidId){
    
    fetch(`${url}/submissions/select/${bidId}?tenderId=${data._id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    }).then(res=>res.json())
    .then(res=>{
      setRefresh(refresh+1);
    })
  }

  return (
    <div className="flex flex-col h-full ring-1 ring-gray-200 p-3 rounded shadow-md">
      <contextHolder />
      <div className="flex flex-row justify-between items-start">
        <div className="flex-1">
          <Tabs defaultActiveKey="1" type="card" size={size}>
            <Tabs.TabPane tab="Overview" key="1">
              {data ? (
                <Spin
                  spinning={loading || checkingSubmission}
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                >
                  <>
                    {/* TItle */}
                    {buildTabHeader()}

                    {data?.items.map((i, index) => {
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

                          {user.userType !== "VENDOR" && (
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
                          )}

                          <div className="flex flex-row space-x-1 items-center">
                            <div className="text-xs font-semibold ml-3 text-gray-500">
                              Links:
                            </div>
                            <div className="text-sm font-semibold text-gray-600">
                              <a href={i.links}>
                                <Typography.Text
                                  style={{ width: 200 }}
                                  ellipsis
                                >
                                  {i.links}
                                </Typography.Text>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {user.userType === "VENDOR" &&
                      moment().isBefore(moment(data?.submissionDeadLine)) &&
                      !iSubmitted && (
                        <>
                          <Form size="small" onFinish={submitSubmissionData}>
                            <div className=" ml-3 mt-5 items-center">
                              <Form.Item
                                name="proposal"
                                label="My proposal"
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: "Please attach the TORs as a document!",
                                //   },
                                // ]}
                              >
                                <UploadFiles {...props} />
                              </Form.Item>
                              <Form.Item
                                name="deliveryDate"
                                label="Delivery date"
                              >
                                <DatePicker
                                  onChange={(value) => setDeliveryDate(value)}
                                />
                              </Form.Item>

                              <Form.Item label="Price">
                                <Input.Group compact>
                                  <Form.Item noStyle name="currency">
                                    <Select
                                      onChange={(value) => setCurrency(value)}
                                      defaultValue="RWF"
                                      options={[
                                        {
                                          value: "RWF",
                                          label: "RWF",
                                        },
                                        {
                                          value: "USD",
                                          label: "USD",
                                        },
                                      ]}
                                    ></Select>
                                  </Form.Item>
                                  <Form.Item name="price" noStyle>
                                    <InputNumber
                                      onChange={(value) => setPrice(value)}
                                    />
                                  </Form.Item>
                                </Input.Group>
                              </Form.Item>

                              <Form.Item name="warranty" label="Warranty (Yrs)">
                                <InputNumber
                                  onChange={(value) => setWarranty(value)}
                                />
                              </Form.Item>

                              <Form.Item name="discount" label="Discount (%)">
                                <InputNumber
                                  onChange={(value) => setDiscount(value)}
                                />
                              </Form.Item>

                              <Form.Item
                                name="comment"
                                label="Any other comment"
                              >
                                <Input.TextArea
                                  className="w-56"
                                  onChange={(e) => setComment(e.target.value)}
                                />
                              </Form.Item>
                            </div>
                            <div className="flex flex-row space-x-1 ml-3 mt-5 items-center">
                              <Form.Item>
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  size="small"
                                >
                                  Submit
                                </Button>
                              </Form.Item>
                            </div>
                          </Form>
                        </>
                      )}
                  </>
                </Spin>
              ) : (
                <Empty />
              )}
            </Tabs.TabPane>
            {user.userType !== "VENDOR" && (
              <>
                <Tabs.TabPane tab="Bidding" key="2">
                  <div className="flex flex-col space-y-5">
                    {buildTabHeader()}
                    <div><BidList tenderId={data._id} handleSelectBid={handleSelectBid} refresh={refresh} /></div>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Aggrement" key="3"></Tabs.TabPane>
              </>
            )}
          </Tabs>
        </div>

        <CloseOutlined className="cursor-pointer" onClick={handleClose} />
      </div>
    </div>
  );

  function buildTabHeader() {
    return (
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row space-x-1 items-center">
          <div className="text-xs font-semibold ml-3 text-gray-500">
            Tender Number:
          </div>
          <div className="text-sm font-semibold ml-3 text-gray-600">
            {data?.number}
          </div>
        </div>
        <Row className="flex flex-row items-center space-x-4">
          <Statistic.Countdown
            title="Deadline (days:hrs:min:sec)"
            className="text-xs text-gray-500"
            // valueStyle={{ fontSize: "0.75rem", lineHeight: "1rem" }}
            format="DD:HH:mm:ss"
            value={moment(data?.submissionDeadLine)}
          />
          <Tag color="magenta">
            {iSubmitted
              ? "submitted"
              : moment().isAfter(moment(data?.submissionDeadLine))
              ? "closed"
              : data?.status}
          </Tag>
        </Row>
      </div>
    );
  }
};
export default TenderDetails;
