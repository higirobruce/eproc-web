import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import parse from "html-react-parser";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import {
  HandThumbUpIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
  Modal,
  Table,
  Divider,
  Popover,
  Popconfirm,
} from "antd";
import UploadFiles from "./uploadFiles";
import {
  CloseCircleOutlined,
  CloseOutlined,
  DislikeOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  LikeOutlined,
  LoadingOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import moment from "moment-timezone";
import BidList from "./bidList";
import Image from "next/image";
import ItemsTable from "./itemsTableB1";
import { PDFObject } from "react-pdfobject";
import UploadBidDoc from "./uploadBidDoc";
import { v4 } from "uuid";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";

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
  user,
  handleSendEvalApproval,
}) => {
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  const [messageApi, contextHolder] = message.useMessage();
  const [size, setSize] = useState("small");
  const [currentCode, setCurrentCode] = useState(-1);
  let [deadLine, setDeadLine] = useState(null);
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
  let [contractStartDate, setContractStartDate] = useState(moment());
  let [contractEndDate, setContractEndDate] = useState(moment());

  let [vendor, setVendor] = useState("");
  let [tendor, setTendor] = useState("");
  let [paymentTerms, setPaymentTerms] = useState("");
  let [items, setItems] = useState(null);
  let tot = 0;
  let [totalVal, setTotVal] = useState(0);
  let [totalTax, setTotTax] = useState(0);
  let [grossTotal, setGrossTotal] = useState(0);
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
  const itemColumns = [
    {
      title: "Description",
      dataIndex: "title",
      key: "title",
      render: (_, item) => (
        <>
          <Typography.Link
            className="flex flex-row items-center space-x-2"
            onClick={() => {
              setPreviewAttachment(true);
              setAttachmentId("termsOfReference/" + item?.id + ".pdf");
            }}
          >
            <div>{item.title}</div>{" "}
            <div>
              <PaperClipIcon className="h-4 w-4" />
            </div>
          </Typography.Link>
        </>
      ),
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
      render: (_, item) => (
        <>{(item?.estimatedUnitCost * 1).toLocaleString()}</>
      ),
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
  const [signatories, setSignatories] = useState([]);
  const [docDate, setDocDate] = useState(moment());
  const [docType, setDocType] = useState("dDocument_Service");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [signing, setSigning] = useState(false);

  const [previewAttachment, setPreviewAttachment] = useState(false);
  const [attachmentId, setAttachmentId] = useState("");
  const [proposalDocId, setProposalDocId] = useState(v4());
  const [otherDocId, setOtherDocId] = useState(v4());

  useEffect(() => {
    let statusCode = getRequestStatusCode(data?.status);
    setCurrentCode(1);
    setItems(data?.purchaseRequest?.items);
    getUsers();
    if (data) checkSubmission();
    updateBidList();
    setProposalDocId(v4());
    setOtherDocId(v4());
  }, [data]);

  useEffect(() => {
    let t = 0;
    let tax = 0;
    items?.map((i) => {
      t = t + i?.quantity * i?.estimatedUnitCost;
      if (i.taxGroup === "I1")
        tax = tax + (i?.quantity * i?.estimatedUnitCost * 18) / 100;
    });

    setTotVal(t);
    setTotTax(tax);
    setGrossTotal(t + tax);

    updateBidList();
  }, [items]);

  function handleCreateContract(
    vendor,
    tender,
    createdBy,
    sections,
    contractStartDate,
    contractEndDate,
    signatories
  ) {
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
        contractStartDate,
        contractEndDate,
        signatories,
      }),
    })
      .then((res) => res.json())
      .then((res1) => {
        setSignatories([]);
        setSections([{ title: "Set section title", body: "" }]);
        updateBidList();
      })
      .catch((err) => {
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
    // alert(JSON.stringify(submissionData))
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
      bankName,
      bankAccountNumber,
      proposalDocId,
      otherDocId,
    };
    createSubmission(subData);
  }

  function handleSelectBid(bidId, evaluationReportId) {
    fetch(`${url}/submissions/select/${bidId}?tenderId=${data._id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        evaluationReportId,
      }),
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
    _data.invitees = selectionComitee.map((s) => {
      return {
        approver: s,
        approved: false,
      };
    });
    _data.invitationSent = true;

    handleSendInvitation(_data);
  }

  function documentFullySigned(document) {
    let totSignatories = document?.signatories;
    let signatures = document?.signatories?.filter((s) => s.signed);

    return totSignatories?.length === signatures?.length;
  }

  function iBelongToEvaluators() {
    let approvers = data?.invitees;
    return approvers?.filter((a) => a.approver === user?.email)?.length >= 1;
  }

  function iHaveApprovedEvalReport() {
    let approvers = data?.invitees;
    return (
      approvers?.filter((a) => a.approver === user?.email && a.approved)
        ?.length >= 1
    );
  }

  const buildSubmissionForm = (
    <div className="">
      <div className="grid md:grid-cols-2 gap-5 ">
        <div className="flex flex-col">
          <div>Delivery date</div>
          <Form.Item
            name="deliveryDate"
            // label="Delivery date"
            className="w-full"
          >
            <DatePicker
              className="w-full"
              onChange={(value) => setDeliveryDate(value)}
            />
          </Form.Item>
        </div>

        <div className="flex flex-col">
          <div>Total Bid Amount</div>
          <Form.Item>
            <Form.Item name="price" noStyle>
              <InputNumber
                style={{ width: "100%" }}
                addonBefore={
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
                }
                onChange={(value) => setPrice(value)}
              />
            </Form.Item>
          </Form.Item>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <div>Warranty (where applicable)</div>
          <Form.Item name="warranty" noStyle>
            <InputNumber
              style={{ width: "100%" }}
              addonBefore={
                <Form.Item noStyle name="warrantyDuration">
                  <Select
                    onChange={(value) => setWarrantyDuration(value)}
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
              }
              onChange={(value) => setWarranty(value)}
            />
          </Form.Item>
        </div>

        <div className="flex flex-col">
          <div>Discount (%)</div>
          <Form.Item name="discount">
            <InputNumber
              style={{ width: "100%" }}
              onChange={(value) => setDiscount(value)}
            />
          </Form.Item>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <div>My proposal</div>
            <Form.Item name="proposal">
              <UploadBidDoc uuid={proposalDocId} />
            </Form.Item>
          </div>

          <div className="flex flex-col">
            <div>Other documents</div>
            <Form.Item name="otherDocs">
              <UploadBidDoc uuid={otherDocId} />
            </Form.Item>
          </div>
        </div>
        <div className="flex flex-col">
          <div>Comment</div>
          <Form.Item name="comment">
            <Input.TextArea onChange={(e) => setComment(e.target.value)} />
          </Form.Item>
        </div>
      </div>
    </div>
  );
  const buildBankDetailsForm = (
    <div className="grid md:grid-cols-2">
      <div>
        <div className="flex flex-col">
          <div>My Banking details</div>
          <Form.Item name="bankAccountNumber" noStyle>
            <Input
              placeholder="1892-0092-0900"
              style={{ width: "100%" }}
              onChange={(v) => {
                setBankAccountNumber(v.target.value);
              }}
              addonBefore={
                <Form.Item noStyle name="bankName">
                  <Select
                    onChange={(value) => setBankName(value)}
                    defaultValue="BK"
                    options={[
                      {
                        value: "BK",
                        label: "Bank of Kigali",
                      },
                      {
                        value: "I&M",
                        label: "I&M Bank",
                      },
                      {
                        value: "Access",
                        label: "Access Bank",
                      },
                    ]}
                  ></Select>
                </Form.Item>
              }
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );

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

                    <div className="">
                      <Table
                        size="small"
                        dataSource={data.items}
                        columns={itemColumns}
                        bordered
                        pagination={false}
                      />
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

                              <div className="grid grid-cols-2 gap-20">
                                {/* Bid information */}
                                {buildSubmissionForm}

                                {/* Bank details */}
                                {buildBankDetailsForm}
                              </div>
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
                    {/* Evaluators section */}
                    {data?.invitees && (
                      <div className="ml-3 flex flex-col space-y-2">
                        <div className="flex flex-row space-x-1 items-center border border-b-2 border-gray-600">
                          <UsersIcon className="h-5" /> <div>Evaluators</div>
                        </div>
                        <div className="flex flex-row space-x-2">
                          <a
                            href="#"
                            onClick={() => {
                              setAttachmentId(
                                `evaluationReports/${data?.evaluationReportId}.pdf`
                              );
                              setPreviewAttachment(true);
                            }}
                          >
                            <FileTextOutlined /> Evaluation report
                          </a>
                          {
                          iBelongToEvaluators() &&
                            !iHaveApprovedEvalReport() && 
                            (
                              <>
                                <Button
                                  size="small"
                                  type="primary"
                                  icon={<LikeOutlined />}
                                  onClick={() => {
                                    let invitees = [...data?.invitees];
                                    let inv = invitees?.filter(
                                      (i) => i?.approver === user?.email
                                    );
                                    let invIndex = invitees?.filter(
                                      (i, index) => index
                                    );
                                    let objToUpdate =
                                      inv?.length >= 1 ? inv[0] : {};
                                    objToUpdate.approved = true;
                                    objToUpdate.approvedAt = moment().toDate();
                                    invitees[invIndex] = objToUpdate
                                    handleSendEvalApproval(data, invitees)
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  type="text"
                                  danger
                                  icon={<DislikeOutlined />}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                        </div>
                        <div className="flex flex-row space-x-3 text-gray-600">
                          {data?.invitees?.map((c) => {
                            return (
                              <div key={c.approver} className="flex flex-row items-center space-x-1">
                                <div>
                                  {c?.approved ? (
                                    <Popover
                                      content={`approved: ${moment(
                                        c?.approvedAt
                                      ).format("DD MMM YYYY")} at ${moment(
                                        c?.approvedAt
                                      )
                                        .tz("Africa/Kigali")
                                        .format("h:mm a z z")}`}
                                    >
                                      <LockClosedIcon className="h-5 text-green-500" />
                                    </Popover>
                                  ) : (
                                    <Popover content="Approval still pending">
                                      <LockOpenIcon className="h-5 text-yellow-500" />
                                    </Popover>
                                  )}
                                </div>
                                <div className="flex flex-col text-gray-600 text-sm">
                                  <div>{c?.approver}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {!data?.invitationSent && (
                      <div className="ml-3 flex self-center">
                        <div className="">
                          <div>Invite Evaluators</div>
                          <div className="flex flex-row space-x-1">
                            <Form
                              onFinish={() => sendInvitation()}
                              className="flex flex-row space-x-1"
                            >
                              <div>
                                <Form.Item name="ivitees" required>
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
                              </div>
                              <div>
                                <Form.Item>
                                  <Button
                                    htmlType="submit"
                                    disabled={selectionComitee?.length < 1}
                                    icon={
                                      <PaperAirplaneIcon className="h-5 w-5" />
                                    }
                                  />
                                </Form.Item>
                              </div>
                            </Form>
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
                        user={user}
                        // previewAttachment={previewAttachment}
                        setPreviewAttachment={setPreviewAttachment}
                        // attachmentId={attachmentId}
                        setAttachmentId={setAttachmentId}
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
                                                      setVendor(
                                                        item?.createdBy
                                                      );
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
                                                      setOpenCreateContract(
                                                        true
                                                      );
                                                      setVendor(
                                                        item?.createdBy
                                                      );
                                                      setTendor(item?.tender);
                                                    }}
                                                  >
                                                    Create Contract
                                                  </Button>
                                                </Form.Item>
                                              )}

                                              {contractCreated &&
                                                documentFullySigned(
                                                  contract
                                                ) && (
                                                  <Form.Item>
                                                    <Button
                                                      // size="small"
                                                      type="primary"
                                                      icon={
                                                        <FileDoneOutlined />
                                                      }
                                                      onClick={() => {
                                                        setOpenCreatePO(true);
                                                        setVendor(
                                                          item?.createdBy
                                                        );
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
            {user?.userType === "VENDOR" &&
              contract?.vendor?._id === user?._id && (
                <Tabs.TabPane tab="Aggrement" key="3">
                  <div className="flex flex-col space-y-5 p-3">
                    {buildTabHeader()}
                    {bidList?.filter((d) => d.status === "awarded").length >=
                    1 ? (
                      !poCreated || !contractCreated ? (
                        <div>
                          {bidList
                            ?.filter(
                              (d) =>
                                d.status === "awarded" &&
                                d?.createdBy?._id === user?._id
                            )
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
                                              {moment(
                                                item?.deliveryDate
                                              ).format("YYYY-MMM-DD")}
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
                      ) : contract?.vendor?._id === user?._id ? (
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
                      ) : (
                        <Empty />
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
      {previewAttachmentModal()}
    </div>
  );

  function createPOMOdal() {
    return (
      <Modal
        title="New Purchase Order"
        centered
        open={openCreatePO}
        onOk={async () => {
          let B1Data = {
            CardName: vendor?.companyName,
            DocType: docType,
            DocDate: docDate,
            DocumentLines: items.map((i) => {
              return {
                ItemDescription: i.title,
                Quantity: i.quantity,
                UnitPrice: i.estimatedUnitCost,
                VatGroup: i.taxGroup ? i.taxGroup : "X1",
              };
            }),
          };
          await handleCreatePO(
            vendor?._id,
            tendor?._id,
            user?._id,
            sections,
            items,
            B1Data,
            signatories
          );
          setOpenCreatePO(false);
        }}
        okText="Save and Submit"
        onCancel={() => setOpenCreatePO(false)}
        width={"80%"}
        bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div className="space-y-5 px-20 py-5">
          <Typography.Title level={4}>
            PURCHASE ORDER: {vendor?.companyName}
          </Typography.Title>
          {/* header */}
          <div className="grid grid-cols-2 w-1/2">
            {/* PO Document date */}
            <div>
              <div>Document date</div>
              <DatePicker onChange={(v, dstr) => setDocDate(dstr)} />
            </div>

            {/* PO type */}
            <div>
              <div>PO Type</div>
              <Select
                onChange={(value) => setDocType(value)}
                defaultValue="dDocument_Service"
                options={[
                  { value: "dDocument_Service", label: "Service" },
                  { value: "dDocument_Item", label: "Item" },
                ]}
              />
            </div>
          </div>

          {/* Parties */}
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

          {/* PO Details */}
          <div className="flex flex-col space-y-5">
            <ItemsTable dataSource={items} setDataSource={setItems} />
            <Typography.Title level={5} className="self-end">
              Total (Tax Excl.): {totalVal?.toLocaleString()} RWF
            </Typography.Title>
            <Typography.Title level={5} className="self-end">
              Total Tax: {totalTax?.toLocaleString()} RWF
            </Typography.Title>
            <Typography.Title level={4} className="self-end">
              Gross Total: {grossTotal?.toLocaleString()} RWF
            </Typography.Title>

            {/* Sections */}
            <div className="flex flex-col space-y-5">
              <Typography.Title level={4}>Contents</Typography.Title>

              {sections.map((s, index) => {
                let section = sections[index]
                  ? sections[index]
                  : { title: "", body: "" };
                let _sections = [...sections];
                return (
                  <>
                    <div className="flex flex-row justify-between items-center">
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
                      <Popconfirm
                        onConfirm={() => {
                          let _sections = [...sections];
                          _sections.splice(index, 1);
                          setSections(_sections);
                        }}
                        title="You can not undo this!"
                      >
                        <div>
                          <CloseCircleOutlined className="h-3 text-red-400 cursor-pointer" />
                        </div>
                      </Popconfirm>
                    </div>
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

            {/* Signatories */}
            <div className="grid grid-cols-3 gap-5">
              {signatories.map((s, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col ring-1 ring-gray-300 rounded py-5"
                  >
                    <div className="flex flex-row items-start justify-between">
                      <div className="flex flex-col space-y-3 px-5">
                        <div className="flex flex-col space-y-1">
                          <Typography.Text type="secondary">
                            <div className="text-xs">On Behalf of</div>
                          </Typography.Text>
                          <Typography.Text
                            editable={{
                              text: s.onBehalfOf,
                              onChange: (e) => {
                                let _signatories = [...signatories];
                                _signatories[index].onBehalfOf = e;
                                setSignatories(_signatories);
                              },
                            }}
                          >
                            {s.onBehalfOf}
                          </Typography.Text>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <Typography.Text type="secondary">
                            <div className="text-xs">Representative Title</div>
                          </Typography.Text>
                          <Typography.Text
                            editable={{
                              text: s.title,
                              onChange: (e) => {
                                let _signatories = [...signatories];
                                _signatories[index].title = e;
                                setSignatories(_signatories);
                              },
                            }}
                          >
                            {s.title}
                          </Typography.Text>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <Typography.Text type="secondary">
                            <div className="text-xs">
                              Company Representative
                            </div>
                          </Typography.Text>
                          <Typography.Text
                            editable={{
                              text: s.names,
                              onChange: (e) => {
                                let _signatories = [...signatories];
                                _signatories[index].names = e;
                                setSignatories(_signatories);
                              },
                            }}
                          >
                            {s.names}
                          </Typography.Text>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <Typography.Text type="secondary">
                            <div className="text-xs">Email</div>
                          </Typography.Text>
                          <Typography.Text
                            editable={{
                              text: s.email,
                              onChange: (e) => {
                                let _signatories = [...signatories];
                                _signatories[index].email = e;
                                setSignatories(_signatories);
                              },
                            }}
                          >
                            {s.email}
                          </Typography.Text>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          let _signatories = [...signatories];
                          _signatories.splice(index, 1);
                          setSignatories(_signatories);
                        }}
                      >
                        <XMarkIcon className="h-3 px-5 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div
                onClick={() => {
                  let signs = [...signatories];
                  signs.push({});
                  setSignatories(signs);
                }}
                className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3 items-center justify-center cursor-pointer hover:bg-gray-50"
              >
                <Image
                  src="/icons/icons8-stamp-64.png"
                  width={40}
                  height={40}
                />
                <div>Add new Signatory</div>
              </div>
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
          handleCreateContract(
            vendor?._id,
            tendor?._id,
            user?._id,
            sections,
            contractStartDate,
            contractEndDate,
            signatories
          );
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
          <div className="grid grid-cols-2 w-1/2">
            <div>
              <div>Contract validity</div>
              <DatePicker.RangePicker
                onChange={(v, dates) => {
                  setContractStartDate(dates[0]);
                  setContractEndDate(dates[1]);
                }}
              />
            </div>
          </div>
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

          {/* Sections */}
          <div className="flex flex-col space-y-5">
            <Typography.Title level={4}>Contents</Typography.Title>

            {sections.map((s, index) => {
              let section = sections[index]
                ? sections[index]
                : { title: "", body: "" };
              let _sections = [...sections];
              return (
                <>
                  <div className="flex flex-row justify-between items-center">
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
                    <Popconfirm
                      onConfirm={() => {
                        let _sections = [...sections];
                        _sections.splice(index, 1);
                        setSections(_sections);
                      }}
                      title="You can not undo this!"
                    >
                      <div>
                        <CloseCircleOutlined className="h-3 text-red-400 cursor-pointer" />
                      </div>
                    </Popconfirm>
                  </div>
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
          {/* Initiator and Reviewers */}
          {/* <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col ring-1 ring-gray-300 rounded py-5 space-y-3">
              <div className="px-5">
                <Typography.Text type="secondary">Initiated by</Typography.Text>
                <div className="flex flex-col">
                  <Typography.Text strong>
                    e.manirakiza@irembo.com
                  </Typography.Text>
                </div>
              </div>
            </div>

            <div className="flex flex-col ring-1 ring-gray-300 rounded py-5 space-y-3">
              <div className="px-5">
                <Typography.Text type="secondary">Reviewed by</Typography.Text>
                <div className="flex flex-col">
                  <Typography.Text strong>{user?.email}</Typography.Text>
                </div>
              </div>
            </div>
          </div> */}

          {/* Signatories */}
          <div className="grid grid-cols-3 gap-5">
            {signatories.map((s, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col ring-1 ring-gray-300 rounded py-5"
                >
                  <div className="flex flex-row items-start justify-between">
                    <div className="flex flex-col space-y-3 px-5">
                      <div className="flex flex-col space-y-1">
                        <Typography.Text type="secondary">
                          <div className="text-xs">On Behalf of</div>
                        </Typography.Text>
                        <Typography.Text
                          editable={{
                            text: s.onBehalfOf,
                            onChange: (e) => {
                              let _signatories = [...signatories];
                              _signatories[index].onBehalfOf = e;
                              setSignatories(_signatories);
                            },
                          }}
                        >
                          {s.onBehalfOf}
                        </Typography.Text>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <Typography.Text type="secondary">
                          <div className="text-xs">Representative Title</div>
                        </Typography.Text>
                        <Typography.Text
                          editable={{
                            text: s.title,
                            onChange: (e) => {
                              let _signatories = [...signatories];
                              _signatories[index].title = e;
                              setSignatories(_signatories);
                            },
                          }}
                        >
                          {s.title}
                        </Typography.Text>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <Typography.Text type="secondary">
                          <div className="text-xs">Company Representative</div>
                        </Typography.Text>
                        <Typography.Text
                          editable={{
                            text: s.names,
                            onChange: (e) => {
                              let _signatories = [...signatories];
                              _signatories[index].names = e;
                              setSignatories(_signatories);
                            },
                          }}
                        >
                          {s.names}
                        </Typography.Text>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <Typography.Text type="secondary">
                          <div className="text-xs">Email</div>
                        </Typography.Text>
                        <Typography.Text
                          editable={{
                            text: s.email,
                            onChange: (e) => {
                              let _signatories = [...signatories];
                              _signatories[index].email = e;
                              setSignatories(_signatories);
                            },
                          }}
                        >
                          {s.email}
                        </Typography.Text>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        let _signatories = [...signatories];
                        _signatories.splice(index, 1);
                        setSignatories(_signatories);
                      }}
                    >
                      <XMarkIcon className="h-3 px-5 cursor-pointer" />
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              onClick={() => {
                let signs = [...signatories];
                signs.push({});
                setSignatories(signs);
              }}
              className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3 items-center justify-center cursor-pointer hover:bg-gray-50"
            >
              <Image src="/icons/icons8-stamp-64.png" width={40} height={40} />
              <div>Add new Signatory</div>
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
              dataSource={po?.items}
              columns={columns}
              pagination={false}
            />
            <Typography.Title level={5} className="self-end">
              Total (Tax Excl.): {getPoTotalVal().totalVal?.toLocaleString()}{" "}
              RWF
            </Typography.Title>
            <Typography.Title level={5} className="self-end">
              Tax: {getPoTotalVal().totalTax?.toLocaleString()} RWF
            </Typography.Title>
            <Typography.Title level={5} className="self-end">
              Gross Total: {getPoTotalVal().grossTotal?.toLocaleString()} RWF
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

          {/* Signatories */}
          <div className="grid grid-cols-3 gap-5">
            {po?.signatories?.map((s, index) => {
              return (
                <div key={s?.email} className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3 justify-between">
                  <div className="px-5 flex flex-col space-y-6">
                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">On Behalf of</div>
                      </Typography.Text>
                      <Typography.Text strong>{s.onBehalfOf}</Typography.Text>
                    </div>

                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">Representative Title</div>
                      </Typography.Text>
                      <Typography.Text strong>{s.title}</Typography.Text>
                    </div>

                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">Company Representative</div>
                      </Typography.Text>
                      <Typography.Text strong>{s.names}</Typography.Text>
                    </div>

                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">Email</div>
                      </Typography.Text>
                      <Typography.Text strong>{s.email}</Typography.Text>
                    </div>

                    {s.signed && (
                      <div className="flex flex-col">
                        <Typography.Text type="secondary">
                          <div className="text-xs">IP address</div>
                        </Typography.Text>
                        <Typography.Text strong>{s?.ipAddress}</Typography.Text>
                      </div>
                    )}
                  </div>
                  {s?.signed && (
                    <div className="flex flex-row justify-center space-x-10 items-center border-t-2 bg-violet-50 p-5">
                      <Image
                        width={40}
                        height={40}
                        src="/icons/icons8-stamp-64.png"
                      />

                      <div className="text-violet-500 flex flex-col">
                        <div className="text-lg">Signed digitaly</div>
                        <div>{moment(s.signedAt).format("DD MMM YYYY")} at</div>
                        <div>
                          {moment(s.signedAt)
                            .tz("Africa/Kigali")
                            .format("h:mm a z")}
                        </div>
                      </div>
                    </div>
                  )}

                  {user?.email === s?.email && !s?.signed && (
                    <Popconfirm
                      title="Confirm Contract Signature"
                      onConfirm={() => handleSignPo(s, index)}
                    >
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
                  )}
                  {user?.email !== s?.email && !s.signed && (
                    <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-gray-50 p-5">
                      <Image
                        width={40}
                        height={40}
                        src="/icons/icons8-stamp-64-2.png"
                      />
                      <div className="text-gray-400 text-lg">
                        {s.signed ? "Signed" : "Waiting for signature"}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
          {/* Header */}
          <div className="flex flex-row justify-between items-center">
            <Typography.Title level={4} className="flex flex-row items-center">
              <div>
                CONTRACTOR: {contract?.vendor?.companyName}{" "}
                <div>
                  <Popover
                    placement="topLeft"
                    content={`${moment(contract?.startDate).format(
                      "YYYY-MMM-DD"
                    )} - ${moment(contract?.endDate).format("YYYY-MMM-DD")}`}
                  >
                    <div className="text-xs font-thin text-gray-500">
                      Expires in {moment(contract?.endDate).fromNow()}
                    </div>
                  </Popover>
                </div>
              </div>
            </Typography.Title>
            <Button icon={<PrinterOutlined />}>Print</Button>
          </div>
          {/* Parties */}
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
          {/* Details */}
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
          {/* Signatories */}
          <div className="grid grid-cols-3 gap-5">
            {contract?.signatories?.map((s, index) => {
              return (
                <div key={s?.email} className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3 justify-between">
                  <div className="px-5 flex flex-col space-y-6">
                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">On Behalf of</div>
                      </Typography.Text>
                      <Typography.Text strong>{s.onBehalfOf}</Typography.Text>
                    </div>

                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">Representative Title</div>
                      </Typography.Text>
                      <Typography.Text strong>{s.title}</Typography.Text>
                    </div>

                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">Company Representative</div>
                      </Typography.Text>
                      <Typography.Text strong>{s.names}</Typography.Text>
                    </div>

                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">Email</div>
                      </Typography.Text>
                      <Typography.Text strong>{s.email}</Typography.Text>
                    </div>

                    {s.signed && (
                      <div className="flex flex-col">
                        <Typography.Text type="secondary">
                          <div className="text-xs">IP address</div>
                        </Typography.Text>
                        <Typography.Text strong>{s?.ipAddress}</Typography.Text>
                      </div>
                    )}
                  </div>
                  {s?.signed && (
                    <div className="flex flex-row justify-center space-x-10 items-center border-t-2 bg-violet-50 p-5">
                      <Image
                        width={40}
                        height={40}
                        src="/icons/icons8-stamp-64.png"
                      />

                      <div className="text-violet-500 flex flex-col">
                        <div className="text-lg">Signed digitaly</div>
                        <div>{moment(s.signedAt).format("DD MMM YYYY")} at</div>
                        <div>
                          {moment(s.signedAt)
                            .tz("Africa/Kigali")
                            .format("h:mm a z")}
                        </div>
                      </div>
                    </div>
                  )}

                  {user?.email === s?.email && !s?.signed && (
                    <Popconfirm
                      title="Confirm Contract Signature"
                      onConfirm={() => handleSignContract(s, index)}
                    >
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
                  )}
                  {user?.email !== s?.email && !s.signed && (
                    <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-gray-50 p-5">
                      <Image
                        width={40}
                        height={40}
                        src="/icons/icons8-stamp-64-2.png"
                      />
                      <div className="text-gray-400 text-lg">
                        {s.signed ? "Signed" : "Waiting for signature"}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

          <div
            className=""
            onClick={() => {
              setAttachmentId(`tenderDocs/${data?.docId}.pdf`);
              setPreviewAttachment(true);
            }}
          >
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

  function getPoTotalVal() {
    let t = 0;
    let tax = 0;
    po?.items.map((i) => {
      t = t + i?.quantity * i?.estimatedUnitCost;
      if (i.taxGroup === "I1")
        tax = tax + (i?.quantity * i?.estimatedUnitCost * 18) / 100;
    });
    return {
      totalVal: t,
      totalTax: tax,
      grossTotal: t + tax,
    };
  }

  function handleSignContract(signatory, index) {
    // alert(JSON.stringify({signatory, index}))
    setSigning(true);
    let myIpObj = "";
    signatory.signed = true;
    let _contract = { ...contract };

    fetch("https://api.db-ip.com/v2/free/self")
      .then((res) => res.json())
      .then((res) => {
        myIpObj = res;
        signatory.ipAddress = res?.ipAddress;
        signatory.signedAt = moment();
        _contract.signatories[index] = signatory;
        setContract(_contract);

        fetch(`${url}/contracts/${contract?._id}`, {
          method: "PUT",
          headers: {
            Authorization:
              "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newContract: contract,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            setSignatories([]);
            setSections([{ title: "Set section title", body: "" }]);
            setContract(res);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    //call API to sign
  }

  function handleSignPo(signatory, index) {
    // alert(JSON.stringify({signatory, index}))
    setSigning(true);
    let myIpObj = "";
    signatory.signed = true;
    let _po = { ...po };

    fetch("https://api.db-ip.com/v2/free/self")
      .then((res) => res.json())
      .then((res) => {
        myIpObj = res;
        signatory.ipAddress = res?.ipAddress;
        signatory.signedAt = moment();
        _po.signatories[index] = signatory;
        setPO(_po);

        fetch(`${url}/purchaseOrders/${po?._id}`, {
          method: "PUT",
          headers: {
            Authorization:
              "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPo: po,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            setSignatories([]);
            setSections([{ title: "Set section title", body: "" }]);
            setPO(res);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    //call API to sign
  }

  function previewAttachmentModal() {
    return (
      <Modal
        title="Attachment view"
        centered
        open={previewAttachment}
        onOk={() => setPreviewAttachment(false)}
        onCancel={() => setPreviewAttachment(false)}
        width={"80%"}
        bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div>
          <PDFObject url={`${url}/file/${attachmentId}`} height="40rem" />
        </div>
      </Modal>
    );
  }
};
export default TenderDetails;
