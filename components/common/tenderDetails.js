import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import parse from "html-react-parser";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  Statistic,
  Tabs,
  Tag,
  message,
  List,
  Typography,
  Upload,
  Modal,
  Table,
  Divider,
  Popover,
  Popconfirm,
} from "antd";
import UploadFiles from "./uploadFiles";
import {
  CheckOutlined,
  CloseOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  LoadingOutlined,
  PlusOutlined,
  PrinterOutlined,
  SendOutlined,
} from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import BidList from "./bidList";
import Image from "next/image";

let modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

let formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

const TenderDetails = ({
  data,
  handleUpdateStatus,
  loading,
  handleCreateSubmission,
  handleClose,
  handleRefreshData,
  handleCreatePO,
  handleSendInvitation,
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
  let [refresh, setRefresh] = useState(1);
  let [bidList, setBidList] = useState(null);
  let [poCreated, setPoCreated] = useState(false);
  let [contractCreated, setContractCreated] = useState(false);
  let [po, setPO] = useState(null);
  let [contract, setContract] = useState(null);
  let [openCreatePO, setOpenCreatePO] = useState(false);
  let [openViewPO, setOpenViewPO] = useState(false);

  let [users, setUsers] = useState([]);

  let [openCreateContract, setOpenCreateContract] = useState(false);
  let [openViewContract, setOpenViewContract] = useState(false);
  let [selectionComitee, setSelectionComitee] = useState([]);

  let [vendor, setVendor] = useState("");
  let [tendor, setTendor] = useState("");
  let [paymentTerms, setPaymentTerms] = useState("");
  let [items, setItems] = useState(null);
  let tot = 0;
  let [totalVal, setTotVal] = useState(0);
  let [warrantyDuration, setWarrantyDuration] = useState("months");
  let [sectionTitle, setSectionTitle] = useState("Section 1: ");
  let [sections, setSections] = useState([
    { title: "Set section title", body: "" },
  ]);
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
  const columns = [
    {
      title: "Description",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, item) => <>{(item?.quantity).toLocaleString()}</>,
    },
    {
      title: "Unit Price (RWF)",
      dataIndex: "estimatedUnitCost",
      key: "estimatedUnitCost",
      render: (_, item) => <>{(item?.estimatedUnitCost).toLocaleString()}</>,
    },
    {
      title: "Total Amount (Rwf)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (_, item) => (
        <>{(item?.quantity * item?.estimatedUnitCost).toLocaleString()}</>
      ),
    },
  ];

  useEffect(() => {
    let statusCode = getRequestStatusCode(data?.status);
    setCurrentCode(1);
    setItems(data?.purchaseRequest?.items);
    getUsers();
    if (data) checkSubmission();
    updateBidList();
  }, [data]);

  useEffect(() => {
    let t = 0;
    items?.map((i) => {
      t = t + i?.quantity * i?.estimatedUnitCost;
    });
    setTotVal(t);
    updateBidList();
  }, [items]);

  function handleCreateContract(vendor, tender, createdBy, sections) {
    fetch(`${url}/contracts/`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendor,
        tender,
        createdBy,
        sections,
      }),
    })
      .then((res) => res.json())
      .then((res1) => {
        updateBidList();
      })
      .catch((err) => {
        alert(JSON.stringify(err));
        console.error(err);
        messageApi.open({
          type: "error",
          content: JSON.stringify(err),
        });
      });
  }

  function getUsers() {
    fetch(`${url}/users/internal`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        setUsers(body);
      })
      .catch((err) => {
        messageApi.error({
          content: "Could not fetch users!",
        });
      });
  }

  const updateBidList = () => {
    fetch(`${url}/submissions/byTender/${data._id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        setBidList(body);
        checkPOCreated();
        checkContractCreated();
      });
  };

  const checkPOCreated = () => {
    fetch(`${url}/purchaseOrders/byTenderId/${data._id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setPO(res[0]);
        if (res.length >= 1) setPoCreated(true);
        else setPoCreated(false);
      });
  };

  const checkContractCreated = () => {
    fetch(`${url}/contracts/byTenderId/${data._id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setContract(res[0]);
        if (res.length >= 1) setContractCreated(true);
        else setContractCreated(false);
      });
  };

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
      currency,
      warranty,
      discount,
      status: "pending",
      comment,
      createdBy: user?._id,
      tender: data._id,
      warrantyDuration,
    };
    createSubmission(subData);
  }

  function handleSelectBid(bidId) {
    fetch(`${url}/submissions/select/${bidId}?tenderId=${data._id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        handleUpdateStatus(data._id, "bidSelected");
        setRefresh(refresh + 1);
      });
  }

  function handleAwardBid(bidId) {
    fetch(`${url}/submissions/award/${bidId}?tenderId=${data._id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        handleUpdateStatus(data._id, "bidAwarded");
        setRefresh(refresh + 1);
      });
  }
  function sendInvitation() {
    let _data = data;
    _data.invitees = selectionComitee;
    _data.invitationSent = true;

    handleSendInvitation(_data);
  }

  return (
    <div className="flex flex-col ring-1 ring-gray-200 p-3 rounded shadow-md bg-white">
      <contextHolder />
      <div className="flex flex-row justify-between items-start">
        <div className="flex-1 ">
          <Tabs defaultActiveKey="1" type="card" size={size}>
            <Tabs.TabPane tab="Overview" key="1">
              {data ? (
                <Spin
                  spinning={loading || checkingSubmission}
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                >
                  <div className="overflow-x-auto p-3 flex flex-col space-y-10">
                    {/* TItle */}
                    {buildTabHeader()}

                    <Divider></Divider>

                    <div>
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

                              {user?.userType !== "VENDOR" && (
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

                              {/* {po &&
                              buildConfirmDeliveryForm(
                                po,
                                handleGetProgress,
                                handleUpdateProgress,
                                progress
                              )} */}
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
                    </div>

                    {user?.userType === "VENDOR" &&
                      moment().isBefore(moment(data?.submissionDeadLine)) &&
                      data?.status === "open" &&
                      !iSubmitted && (
                        <>
                          <Form onFinish={submitSubmissionData}>
                            <div className="ml-3 mt-5 items-center">
                              <Divider></Divider>
                              <Typography.Title className="pb-4" level={5}>
                                Submit Proposal
                              </Typography.Title>
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
                                name="otherDocs"
                                label="Other Supporting documents"
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

                              <Form.Item label="Total Bid Amount">
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

                              <Form.Item
                                name="warranty"
                                label="Warranty - where applicable"
                              >
                                <Input.Group compact>
                                  <Form.Item noStyle name="warrantyDuration">
                                    <Select
                                      onChange={(value) =>
                                        setWarrantyDuration(value)
                                      }
                                      defaultValue="months"
                                      options={[
                                        {
                                          value: "days",
                                          label: "Days",
                                        },
                                        {
                                          value: "months",
                                          label: "Months",
                                        },
                                        {
                                          value: "years",
                                          label: "Years",
                                        },
                                      ]}
                                    ></Select>
                                  </Form.Item>
                                  <Form.Item name="warranty" noStyle>
                                    <InputNumber
                                      onChange={(value) => setWarranty(value)}
                                    />
                                  </Form.Item>
                                </Input.Group>
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
                  </div>
                </Spin>
              ) : (
                <Empty />
              )}
            </Tabs.TabPane>
            {user?.userType !== "VENDOR" && (
              <>
                <Tabs.TabPane tab="Bidding" key="2">
                  <div className="flex flex-col space-y-5 p-3">
                    {buildTabHeader()}
                    {!data?.invitationSent && (
                      <div className="ml-3 flex">
                        <div className="">
                          <div>Invite Evaluators</div>
                          <div className="flex flex-row space-x-1">
                            <Form>
                              <Form.Item>
                                <Select
                                  showSearch
                                  showArrow
                                  onChange={(value) =>
                                    setSelectionComitee(value)
                                  }
                                  style={{ width: "400px" }}
                                  mode="multiple"
                                  options={users.map((user) => {
                                    return {
                                      label: user?.email,
                                      value: user?.email,
                                    };
                                  })}
                                />
                              </Form.Item>
                            </Form>

                            <Button
                              icon={<PaperAirplaneIcon className="h-5 w-5" />}
                              onClick={() => sendInvitation()}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <Divider></Divider>
                    <div>
                      <BidList
                        tenderId={data._id}
                        handleSelectBid={handleSelectBid}
                        handleAwardBid={handleAwardBid}
                        refresh={refresh}
                        canSelectBid={data?.invitationSent}
                        handleSetBidList={setBidList}
                        comitee={data?.invitees}
                      />
                    </div>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Aggrement" key="3">
                  <div className="flex flex-col space-y-5 p-3">
                    {buildTabHeader()}
                    <Divider></Divider>
                    {bidList?.filter((d) => d.status === "awarded").length >=
                    1 ? (
                      !poCreated || !contractCreated ? (
                        <div>
                          {bidList
                            ?.filter((d) => d.status === "awarded")
                            ?.map((item) => {
                              return (
                                <List size="small" key={item?.number}>
                                  <List.Item>
                                    <List.Item.Meta
                                      //   avatar={<Avatar src={item.picture.large} />}
                                      title={<a href="#">{item.number}</a>}
                                      description={
                                        <div className="grid grid-cols-6">
                                          <div>
                                            <div className="text-xs text-gray-600">
                                              {item?.createdBy?.companyName}
                                            </div>
                                            <a href="#">
                                              <FileTextOutlined />{" "}
                                            </a>
                                          </div>

                                          <div className="">
                                            <div className="text-xs text-gray-400">
                                              Price
                                            </div>
                                            <div className="text-xs text-gray-600">
                                              {item?.price.toLocaleString() +
                                                " " +
                                                item?.currency}
                                            </div>
                                          </div>

                                          <div className="">
                                            <div className="text-xs text-gray-400">
                                              Discount
                                            </div>
                                            <div className="text-xs text-gray-600">
                                              {item?.discount}%
                                            </div>
                                          </div>

                                          <div className="">
                                            <div className="text-xs text-gray-400">
                                              Delivery date
                                            </div>
                                            <div className="text-xs text-gray-600">
                                              {moment(
                                                item?.deliveryDate
                                              ).fromNow()}
                                            </div>
                                          </div>

                                          <div className="flex flex-row">
                                          <Form
                                            // size="small"
                                            className="flex flex-row space-x-1"
                                          >
                                            {/* <Form.Item>
                                          <UploadFiles label="Contract" />
                                        </Form.Item> */}

                                            {contract ? (
                                              <Form.Item>
                                                <Button
                                                  type="default"
                                                  icon={<FileTextOutlined />}
                                                  onClick={() => {
                                                    setOpenViewContract(true);
                                                    setVendor(item?.createdBy);
                                                    setTendor(item?.tender);
                                                  }}
                                                >
                                                  View Contract
                                                </Button>
                                              </Form.Item>
                                            ) : (
                                              <Form.Item>
                                                <Button
                                                  // size="small"
                                                  type="primary"
                                                  icon={<FileDoneOutlined />}
                                                  onClick={() => {
                                                    setOpenCreateContract(true);
                                                    setVendor(item?.createdBy);
                                                    setTendor(item?.tender);
                                                  }}
                                                >
                                                  Create Contract
                                                </Button>
                                              </Form.Item>
                                            )}

                                            {contractCreated && (
                                              <Form.Item>
                                                <Button
                                                  // size="small"
                                                  type="primary"
                                                  icon={<FileDoneOutlined />}
                                                  onClick={() => {
                                                    setOpenCreatePO(true);
                                                    setVendor(item?.createdBy);
                                                    setTendor(item?.tender);
                                                  }}
                                                >
                                                  Create PO
                                                </Button>
                                              </Form.Item>
                                            )}
                                          </Form>
                                          </div>
                                        </div>
                                      }
                                    />
                                    
                                  </List.Item>
                                </List>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="mx-3 flex flex-row space-x-5 items-center justify-center">
                          <div className="flex flex-col items-center justify-center">
                            <Typography.Title level={5}>
                              Contract
                            </Typography.Title>
                            {/* <Popover content={'PO: '+po?.number}> */}
                            <Image
                              onClick={() => setOpenViewContract(true)}
                              className=" cursor-pointer hover:opacity-60"
                              width={40}
                              height={40}
                              src="/icons/icons8-file-64.png"
                            />
                            {/* </Popover> */}
                          </div>

                          <div className="flex flex-col items-center justify-center">
                            <Typography.Title level={5}>
                              Purchase order
                            </Typography.Title>
                            {/* <Popover content={po?.number}> */}
                            <Image
                              onClick={() => setOpenViewPO(true)}
                              className=" cursor-pointer hover:opacity-60"
                              width={40}
                              height={40}
                              src="/icons/icons8-file-64.png"
                            />
                            {/* </Popover> */}
                          </div>
                        </div>
                      )
                    ) : (
                      <Empty />
                    )}
                  </div>
                </Tabs.TabPane>
              </>
            )}
            {user?.userType === "VENDOR" && (
              <Tabs.TabPane tab="Aggrement" key="3">
                <div className="flex flex-col space-y-5 p-3">
                  {buildTabHeader()}
                  {bidList?.filter((d) => d.status === "awarded").length >=
                  1 ? (
                    !poCreated || !contractCreated ? (
                      <div>
                        {bidList
                          ?.filter((d) => d.status === "awarded")
                          ?.map((item) => {
                            return (
                              <List size="small" key={item?.number}>
                                <List.Item>
                                  <List.Item.Meta
                                    //   avatar={<Avatar src={item.picture.large} />}
                                    title={<a href="#">{item.number}</a>}
                                    description={
                                      <>
                                        <div className="text-xs text-gray-400">
                                          {item?.createdBy?.companyName}
                                        </div>
                                        <a href="#">
                                          <FileTextOutlined />{" "}
                                        </a>
                                      </>
                                    }
                                  />
                                  <div className="flex flex-row items-start space-x-10 justify-between">
                                    <div className="flex flex-row space-x-2">
                                      <div className="flex flex-col">
                                        <div className="flex flex-row space-x-2">
                                          <div className="text-xs font-bold text-gray-500">
                                            Price:
                                          </div>
                                          <div className="text-xs text-gray-400">
                                            {item?.price.toLocaleString()}
                                          </div>
                                        </div>

                                        <div className="flex flex-row space-x-2">
                                          <div className="text-xs font-bold text-gray-500">
                                            Discount:
                                          </div>
                                          <div className="text-xs text-gray-400">
                                            {item?.discount}%
                                          </div>
                                        </div>

                                        <div className="flex flex-row space-x-2">
                                          <div className="text-xs font-bold text-gray-500">
                                            Delivery date:
                                          </div>
                                          <div className="text-xs text-gray-400">
                                            {moment(item?.deliveryDate).format(
                                              "YYYY-MMM-DD"
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <Form
                                      // size="small"
                                      className="flex flex-row space-x-1"
                                    >
                                      {/* <Form.Item>
                                          <UploadFiles label="Contract" />
                                        </Form.Item> */}

                                      {contract && (
                                        <Form.Item>
                                          <Button
                                            type="default"
                                            icon={<FileTextOutlined />}
                                            onClick={() => {
                                              setOpenViewContract(true);
                                              setVendor(item?.createdBy);
                                              setTendor(item?.tender);
                                            }}
                                          >
                                            View Contract
                                          </Button>
                                        </Form.Item>
                                      )}
                                    </Form>
                                  </div>
                                </List.Item>
                              </List>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="mx-3 flex flex-row space-x-5 items-center justify-center">
                        <div className="flex flex-col items-center justify-center">
                          <Typography.Title level={5}>
                            Contract
                          </Typography.Title>
                          {/* <Popover content={'PO: '+po?.number}> */}
                          <Image
                            onClick={() => setOpenViewContract(true)}
                            className=" cursor-pointer hover:opacity-60"
                            width={40}
                            height={40}
                            src="/icons/icons8-file-64.png"
                          />
                          {/* </Popover> */}
                        </div>

                        <div className="flex flex-col items-center justify-center">
                          <Typography.Title level={5}>
                            Purchase order
                          </Typography.Title>
                          {/* <Popover content={po?.number}> */}
                          <Image
                            onClick={() => setOpenViewPO(true)}
                            className=" cursor-pointer hover:opacity-60"
                            width={40}
                            height={40}
                            src="/icons/icons8-file-64.png"
                          />
                          {/* </Popover> */}
                        </div>
                      </div>
                    )
                  ) : (
                    <Empty />
                  )}
                </div>
              </Tabs.TabPane>
            )}
          </Tabs>
        </div>

        <CloseOutlined className="cursor-pointer" onClick={handleClose} />
      </div>

      {createPOMOdal()}
      {viewPOMOdal()}
      {createContractMOdal()}
      {viewContractMOdal()}
    </div>
  );

  function createPOMOdal() {
    return (
      <Modal
        title="New Purchase Order"
        centered
        open={openCreatePO}
        onOk={() => {
          setOpenCreatePO(false);
          handleCreatePO(vendor?._id, tendor?._id, user?._id, sections, items);
        }}
        okText="Save and Submit"
        onCancel={() => setOpenCreatePO(false)}
        width={"80%"}
        bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div className="space-y-10 px-20 py-5">
          <Typography.Title level={4}>
            PURCHASE ORDER: {vendor?.companyName}
          </Typography.Title>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Name</div>
                </Typography.Text>
                <Typography.Text strong>Irembo ltd</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Address</div>
                </Typography.Text>
                <Typography.Text strong>
                  Irembo Campass Nyarutarama KG 9 Ave
                </Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company TIN no.</div>
                </Typography.Text>
                <Typography.Text strong>102911562</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Hereinafter refferd to as</div>
                </Typography.Text>
                <Typography.Text strong>Sender</Typography.Text>
              </div>
            </div>

            <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Name</div>
                </Typography.Text>
                <Typography.Text strong>{vendor?.companyName}</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Address</div>
                </Typography.Text>
                <Typography.Text strong>
                  {vendor?.building}-{vendor?.street}-{vendor?.avenue}
                </Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company TIN no.</div>
                </Typography.Text>
                <Typography.Text strong>{vendor?.tin}</Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Hereinafter refferd to as</div>
                </Typography.Text>
                <Typography.Text strong>Receiver</Typography.Text>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-5">
            <Table
              size="small"
              dataSource={items}
              columns={columns}
              pagination={false}
            />
            <Typography.Title level={5} className="self-end">
              Total (Tax Excl.): {totalVal?.toLocaleString()} RWF
            </Typography.Title>

            <Typography.Title level={4}>Details</Typography.Title>

            {sections.map((s, index) => {
              let section = sections[index]
                ? sections[index]
                : { title: "", body: "" };
              let _sections = [...sections];
              return (
                <>
                  <Typography.Title
                    level={5}
                    editable={{
                      onChange: (e) => {
                        section.title = e;
                        _sections[index]
                          ? (_sections[index] = section)
                          : _sections.push(section);
                        setSections(_sections);
                      },
                      text: s.title,
                    }}
                  >
                    {s.title}
                  </Typography.Title>
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    onChange={(value) => {
                      section.body = value;
                      _sections[index]
                        ? (_sections[index] = section)
                        : _sections.push(section);
                      setSections(_sections);
                    }}
                  />
                </>
              );
            })}

            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                let _sections = [...sections];
                _sections.push({
                  title: `Set section ${sections?.length + 1} Title`,
                  body: "",
                });
                setSections(_sections);
              }}
            >
              Add section
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3">
              <div className="px-5">
                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">On Behalf of</div>
                  </Typography.Text>
                  <Typography.Text strong>Irembo ltd</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Representative Title</div>
                  </Typography.Text>
                  <Typography.Text strong>Procurement Manager</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Company Representative</div>
                  </Typography.Text>
                  <Typography.Text strong>Manirakiza Edouard</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Email</div>
                  </Typography.Text>
                  <Typography.Text strong>
                    e.manirakiza@irembo.com
                  </Typography.Text>
                </div>
              </div>

              <Popconfirm title="Confirm PO Signature">
                <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-violet-50 p-5 cursor-pointer hover:opacity-75">
                  <Image
                    width={40}
                    height={40}
                    src="/icons/icons8-stamp-64.png"
                  />

                  <div className="text-violet-400 text-lg">
                    Sign with one click
                  </div>
                </div>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  function viewPOMOdal() {
    return (
      <Modal
        title="Display Purchase Order"
        centered
        open={openViewPO}
        onOk={() => {
          setOpenViewPO(false);
        }}
        onCancel={() => setOpenViewPO(false)}
        width={"80%"}
        bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div className="space-y-10 px-20 py-5 overflow-x-scroll">
          <div className="flex flex-row justify-between items-center">
            <Typography.Title level={4} className="flex flex-row items-center">
              PURCHASE ORDER: {po?.vendor?.companyName}{" "}
              <Image
                src="/icons/icons8-approval-90.png"
                width={20}
                height={20}
              />
            </Typography.Title>
            <Button icon={<PrinterOutlined />}>Print</Button>
          </div>
          <div className="grid grid-cols-2 gap-5 ">
            <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Name</div>
                </Typography.Text>
                <Typography.Text strong>Irembo ltd</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Address</div>
                </Typography.Text>
                <Typography.Text strong>
                  Irembo Campass Nyarutarama KG 9 Ave
                </Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company TIN no.</div>
                </Typography.Text>
                <Typography.Text strong>102911562</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Hereinafter refferd to as</div>
                </Typography.Text>
                <Typography.Text strong>Sender</Typography.Text>
              </div>
            </div>

            <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Name</div>
                </Typography.Text>
                <Typography.Text strong>
                  {po?.vendor?.companyName}
                </Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Address</div>
                </Typography.Text>
                <Typography.Text strong>
                  {po?.vendor?.building}-{po?.vendor?.street}-
                  {po?.vendor?.avenue}
                </Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company TIN no.</div>
                </Typography.Text>
                <Typography.Text strong>{po?.vendor?.tin}</Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Hereinafter refferd to as</div>
                </Typography.Text>
                <Typography.Text strong>Receiver</Typography.Text>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-5">
            <Table
              size="small"
              dataSource={items}
              columns={columns}
              pagination={false}
            />
            <Typography.Title level={5} className="self-end">
              Total (Tax Excl.): {totalVal?.toLocaleString()} RWF
            </Typography.Title>
            <Typography.Title level={3}>Details</Typography.Title>
            {po?.sections?.map((section) => {
              return (
                <>
                  <Typography.Title level={4}>{section.title}</Typography.Title>
                  <div>{parse(section?.body)}</div>
                </>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3">
              <div className="px-5">
                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">On Behalf of</div>
                  </Typography.Text>
                  <Typography.Text strong>Irembo ltd</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Representative Title</div>
                  </Typography.Text>
                  <Typography.Text strong>Procurement Manager</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Company Representative</div>
                  </Typography.Text>
                  <Typography.Text strong>Manirakiza Edouard</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Email</div>
                  </Typography.Text>
                  <Typography.Text strong>
                    e.manirakiza@irembo.com
                  </Typography.Text>
                </div>
              </div>

              <Popconfirm title="Confirm PO Signature">
                <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-violet-50 p-5 cursor-pointer hover:opacity-75">
                  <Image
                    width={40}
                    height={40}
                    src="/icons/icons8-stamp-64.png"
                  />

                  <div className="text-violet-400 text-lg">
                    Sign with one click
                  </div>
                </div>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  function createContractMOdal() {
    return (
      <Modal
        title="New Contract"
        centered
        open={openCreateContract}
        onOk={() => {
          handleCreateContract(vendor?._id, tendor?._id, user?._id, sections);
          setOpenCreateContract(false);
        }}
        okText="Save and Submit"
        onCancel={() => setOpenCreateContract(false)}
        width={"80%"}
        bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div className="space-y-10 px-20 py-5">
          <Typography.Title level={4}>
            CONTRACTOR: {vendor?.companyName}
          </Typography.Title>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Name</div>
                </Typography.Text>
                <Typography.Text strong>Irembo ltd</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Address</div>
                </Typography.Text>
                <Typography.Text strong>
                  Irembo Campass Nyarutarama KG 9 Ave
                </Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company TIN no.</div>
                </Typography.Text>
                <Typography.Text strong>102911562</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Hereinafter refferd to as</div>
                </Typography.Text>
                <Typography.Text strong>Sender</Typography.Text>
              </div>
            </div>

            <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Name</div>
                </Typography.Text>
                <Typography.Text strong>{vendor?.companyName}</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Address</div>
                </Typography.Text>
                <Typography.Text strong>
                  {vendor?.building}-{vendor?.street}-{vendor?.avenue}
                </Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company TIN no.</div>
                </Typography.Text>
                <Typography.Text strong>{vendor?.tin}</Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Hereinafter refferd to as</div>
                </Typography.Text>
                <Typography.Text strong>Receiver</Typography.Text>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-5">
            <Typography.Title level={4}>Details</Typography.Title>

            {sections.map((s, index) => {
              let section = sections[index]
                ? sections[index]
                : { title: "", body: "" };
              let _sections = [...sections];
              return (
                <>
                  <Typography.Title
                    level={5}
                    editable={{
                      onChange: (e) => {
                        section.title = e;
                        _sections[index]
                          ? (_sections[index] = section)
                          : _sections.push(section);
                        setSections(_sections);
                      },
                      text: s.title,
                    }}
                  >
                    {s.title}
                  </Typography.Title>
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    onChange={(value) => {
                      section.body = value;
                      _sections[index]
                        ? (_sections[index] = section)
                        : _sections.push(section);
                      setSections(_sections);
                    }}
                  />
                </>
              );
            })}

            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                let _sections = [...sections];
                _sections.push({
                  title: `Set section ${sections?.length + 1} Title`,
                  body: "",
                });
                setSections(_sections);
              }}
            >
              Add section
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3">
              <div className="px-5">
                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">On Behalf of</div>
                  </Typography.Text>
                  <Typography.Text strong>Irembo ltd</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Representative Title</div>
                  </Typography.Text>
                  <Typography.Text strong>Procurement Manager</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Company Representative</div>
                  </Typography.Text>
                  <Typography.Text strong>Manirakiza Edouard</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Email</div>
                  </Typography.Text>
                  <Typography.Text strong>
                    e.manirakiza@irembo.com
                  </Typography.Text>
                </div>
              </div>

              <Popconfirm title="Confirm Contract Signature">
                <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-violet-50 p-5 cursor-pointer hover:opacity-75">
                  <Image
                    width={40}
                    height={40}
                    src="/icons/icons8-stamp-64.png"
                  />

                  <div className="text-violet-400 text-lg">
                    Sign with one click
                  </div>
                </div>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  function viewContractMOdal() {
    return (
      <Modal
        title="Display Contract"
        centered
        open={openViewContract}
        onOk={() => {
          setOpenViewContract(false);
        }}
        onCancel={() => setOpenViewContract(false)}
        width={"80%"}
        bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div className="space-y-10 px-20 py-5 overflow-x-scroll">
          <div className="flex flex-row justify-between items-center">
            <Typography.Title level={4} className="flex flex-row items-center">
              CONTRACTOR: {contract?.vendor?.companyName}{" "}
              <Image
                src="/icons/icons8-approval-90.png"
                width={20}
                height={20}
              />
            </Typography.Title>
            <Button icon={<PrinterOutlined />}>Print</Button>
          </div>
          <div className="grid grid-cols-2 gap-5 ">
            <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Name</div>
                </Typography.Text>
                <Typography.Text strong>Irembo ltd</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Address</div>
                </Typography.Text>
                <Typography.Text strong>
                  Irembo Campass Nyarutarama KG 9 Ave
                </Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company TIN no.</div>
                </Typography.Text>
                <Typography.Text strong>102911562</Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Hereinafter refferd to as</div>
                </Typography.Text>
                <Typography.Text strong>Sender</Typography.Text>
              </div>
            </div>

            <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Name</div>
                </Typography.Text>
                <Typography.Text strong>
                  {contract?.vendor?.companyName}
                </Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Address</div>
                </Typography.Text>
                <Typography.Text strong>
                  {contract?.vendor?.building}-{contract?.vendor?.street}-
                  {contract?.vendor?.avenue}
                </Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company TIN no.</div>
                </Typography.Text>
                <Typography.Text strong>
                  {contract?.vendor?.tin}
                </Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Hereinafter refferd to as</div>
                </Typography.Text>
                <Typography.Text strong>Receiver</Typography.Text>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-5">
            <Typography.Title level={3}>Details</Typography.Title>
            {contract?.sections?.map((section) => {
              return (
                <>
                  <Typography.Title level={4}>{section.title}</Typography.Title>
                  <div>{parse(section?.body)}</div>
                </>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3">
              <div className="px-5">
                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">On Behalf of</div>
                  </Typography.Text>
                  <Typography.Text strong>Irembo ltd</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Representative Title</div>
                  </Typography.Text>
                  <Typography.Text strong>Procurement Manager</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Company Representative</div>
                  </Typography.Text>
                  <Typography.Text strong>Manirakiza Edouard</Typography.Text>
                </div>

                <div className="flex flex-col">
                  <Typography.Text type="secondary">
                    <div className="text-xs">Email</div>
                  </Typography.Text>
                  <Typography.Text strong>
                    e.manirakiza@irembo.com
                  </Typography.Text>
                </div>
              </div>

              <Popconfirm title="Confirm Contract Signature">
                <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-violet-50 p-5 cursor-pointer hover:opacity-75">
                  <Image
                    width={40}
                    height={40}
                    src="/icons/icons8-stamp-64.png"
                  />

                  <div className="text-violet-400 text-lg">
                    Sign with one click
                  </div>
                </div>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  function buildTabHeader() {
    return (
      <div className="flex flex-col space-y-5">
        <div className="grid grid-cols-5 items-start">
          <div className="flex flex-col items-start">
            <div className="text-xs font-semibold ml-3 text-gray-400">
              Tender Number
            </div>
            <div className="text-sm font-semibold ml-3 text-gray-600">
              {data?.number}
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="text-xs font-semibold ml-3 text-gray-400">
              Service category
            </div>
            <div className="text-sm font-semibold ml-3 text-gray-600">
              {data?.purchaseRequest?.serviceCategory}
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="text-xs font-semibold ml-3 text-gray-400">
              Due date
            </div>
            <div className="text-sm font-semibold ml-3 text-gray-600">
              {moment(data?.dueDate).format("YYYY-MMM-DD")}
            </div>
          </div>

          <div className="">
            <Typography.Link>
              <FileTextOutlined /> Tender document for {data?.number}{" "}
            </Typography.Link>
          </div>

          <div className="flex flex-col space-y-2 items-start">
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
          </div>
        </div>
      </div>
    );
  }
};
export default TenderDetails;
