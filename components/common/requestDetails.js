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
  Select,
  Modal,
  Table,
  message,
  Tooltip,
  Timeline,
  Progress,
  Switch,
} from "antd";
import UploadFiles from "./uploadFiles";
import {
  CheckOutlined,
  DislikeOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileAddOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import Image from "next/image";
import ItemsTable from "./itemsTableB1";
import dynamic from "next/dynamic";
import parse from "html-react-parser";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  FolderOpenIcon,
  PaperClipIcon,
  RectangleStackIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { v4 } from "uuid";
import UploadTenderDoc from "./uploadTenderDoc";
import UploadReqAttach from "./uploadReqAttach";
import MyPdfViewer from "./pdfViewer";
import _ from "lodash";

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
  handleCreatePO,
  handleCreateContract,
  edit,
  handleUpdateRequest,
  handleRateDelivery,
}) => {
  const [form] = Form.useForm();
  const [size, setSize] = useState("small");
  const [currentCode, setCurrentCode] = useState(-1);
  let [deadLine, setDeadLine] = useState(null);
  const [open, setOpen] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  let [reason, setReason] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  let user = JSON.parse(localStorage.getItem("user"));
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [tender, setTender] = useState(null);
  let [po, setPO] = useState(null);
  let [contract, setContract] = useState(null);
  let [currentStep, setCurrentStep] = useState(-1);
  let [progress, setProgress] = useState(0);
  let [refDoc, setRefDoc] = useState(false);
  let [contracts, setContracts] = useState([]);
  let [selectedContract, setSelectedContract] = useState(null);
  let [vendor, setVendor] = useState(null);
  let [openCreatePO, setOpenCreatePO] = useState(false);
  let [openCreateContract, setOpenCreateContract] = useState(false);
  let [sections, setSections] = useState([]);
  let [poItems, setPOItems] = useState([]);
  let [items, setItems] = useState([]);
  let [totalVal, setTotVal] = useState(0);
  let [totalTax, setTotTax] = useState(0);
  let [grossTotal, setGrossTotal] = useState(0);

  const [signatories, setSignatories] = useState([]);
  const [docDate, setDocDate] = useState(moment());
  const [docType, setDocType] = useState("dDocument_Service");
  const [previewAttachment, setPreviewAttachment] = useState(false);
  const [attachmentId, setAttachmentId] = useState("TOR-id.pdf");
  const [docId, setDocId] = useState(v4());
  const [vendors, setVendors] = useState([]);
  let [contractStartDate, setContractStartDate] = useState(moment());
  let [contractEndDate, setContractEndDate] = useState(moment());
  let [reqAttachId, setReqAttachId] = useState(v4());
  const [creatingPO, setCreatingPO] = useState(false);
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(0);

  const [assetOptions, setAssetOptions] = useState([]);

  const [assets, setAssets] = useState([]);

  let [tendor, setTendor] = useState("");
  const [deliveredQty, setDeliveredQty] = useState(0);
  const [tenderDocSelected, setTendeDocSelected] = useState(false);
  const [attachSelected, setAttachSelected] = useState(false);

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
    setOpen(false);
  };

  const columns = [
    {
      title: "Item title",
      dataIndex: "title",
      key: "title",
      editable: true,
      render: (_, item) => <>{item?.title}</>,
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      editable: true,
      render: (_, item) => <>{(item?.quantity).toLocaleString()}</>,
    },
    {
      title: "Unit Price (RWF)",
      dataIndex: "estimatedUnitCost",
      key: "estimatedUnitCost",
      editable: true,
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

    {
      title: "Supporting docs",
      dataIndex: "title",
      key: "title",
      render: (_, item) => (
        <div className="flex flex-col">
          {item?.paths?.map((p, i) => {
            return (
              <div key={p}>
                <Typography.Link
                  className="flex flex-row items-center space-x-2"
                  onClick={() => {
                    setPreviewAttachment(!previewAttachment);
                    setAttachmentId(p);
                  }}
                >
                  <div>supporting doc{i + 1} </div>{" "}
                  <div>
                    <PaperClipIcon className="h-4 w-4" />
                  </div>
                </Typography.Link>
              </div>
            );
          })}
          {(item?.paths?.length < 1 || !item?.paths) && (
            <div className="items-center justify-center flex flex-col">
              <div><RectangleStackIcon className="h-5 w-5 text-gray-200"/></div>
              <div className="text-xs text-gray-400">No docs found</div>
              </div>
          )}
        </div>
      ),
    },
  ];

  let [servCategories, setServCategories] = useState([]);
  useEffect(() => {
    refresh();
    fetch(`${url}/serviceCategories`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setServCategories(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Connection Error!",
        });
      });
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
  }, [poItems, items]);

  useEffect(() => {
    setProgress(po?.deliveryProgress);
  }, [po]);

  useEffect(() => {
    let list = [];
    assets.map((alist) => {
      alist.map((a) => {
        list.push(a);
      });
    });
  }, [assets]);

  useEffect(() => {
    refresh();
  }, [reload]);

  useEffect(() => {
    let t = 0;
    selectedContract?.purchaseRequest?.items?.map((i) => {
      t = t + i?.quantity * i?.estimatedUnitCost;
    });
    setTotVal(t);
    // updateBidList();
  }, [selectedContract]);

  useEffect(() => {
    setDocId(v4());
    setAttachSelected(false);
    setTendeDocSelected(false);
  }, [refDoc]);

  function getFixedAssets() {
    fetch(`${url}/b1/fixedAssets`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        if (body?.error) {
          messageApi.error({
            content: body?.error?.message?.value,
          });
        } else {
          let value = body?.value;
          let assetOptions = value?.map((v) => {
            return {
              value: v?.ItemCode,
              label: <div className="flex flex-col">
                <div>{v?.ItemCode}</div>
                <div className="text-gray-400 text-sm">{v?.ItemName}</div>
              </div>
            };
          });
          setAssetOptions(assetOptions);
        }
      })
      .catch((err) => {
        messageApi.error({
          content: "Could not fetch users!",
        });
      });
  }

  function refresh() {
    let statusCode = getRequestStatusCode(data?.status);
    setCurrentCode(statusCode);
    getContracts();
    setPOItems(data?.items);
    setItems(data?.items);
    checkDirectPOExists(data);
    setReqAttachId(v4());
    getFixedAssets();
    if (data) {
      checkContractExists();
      checkTenderExists(data);
    }

    fetch(`${url}/users/vendors`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setVendors(res);
      })
      .catch((err) => {});
  }

  useEffect(() => {
    if (tender) checkPOExists(tender);
    else checkDirectPOExists(data);
  }, [tender]);

  useEffect(() => {
    if (po && po.status !== "started") setCurrentStep(1);
    else if (po && po.status === "started") setCurrentStep(1);
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
    else if (status === "approved") return 3;
    else return -1;
  }

  function changeStatus(statusCode) {
    setCurrentCode(statusCode);
    handleUpdateStatus(data._id, getRequestStatus(statusCode));
  }

  function createTender(tenderData) {
    form.validateFields().then(
      (onfullfilled) => {
        handleCreateTender(tenderData);
      },
      (onRejected) => {}
    );
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
      docId,
      reqAttachmentDocId: refDoc === "external" ? reqAttachId : "",
    };
    createTender(tData);
  }

  function submitPOData(values) {
    let _signatories = [
      {
        onBehalfOf: "Irembo Ltd",
        title: "Procurement Manager",
        names: "",
        email: "",
      },
      {
        onBehalfOf: "Irembo Ltd",
        title: "Finance Manager",
        names: "",
        email: "",
      },
      {
        onBehalfOf: vendor.companyName,
        title: vendor.title,
        names: vendor.contactPersonNames,
        email: vendor.email,
      },
    ];

    setSignatories(_signatories);
    setOpenCreatePO(true);
  }

  function submitContractData() {
    setOpenCreateContract(true);
  }

  function getContracts() {
    fetch(`${url}/contracts/`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) setContracts(res);
        else setContracts([]);
      });
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
        if (res?.length >= 1) {
          setTender(res[0]);
        } else {
          setTender(null);
        }
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
        if (res?.length >= 1) {
          setPO(res[0]);
        } else {
          setPO(null);
        }
      });
  }

  function checkContractExists() {
    fetch(`${url}/contracts/byRequestId/${data?._id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.length >= 1) {
          setContract(res[0]);
        } else {
          setContract(null);
        }
      });
  }

  function checkDirectPOExists(data) {
    fetch(`${url}/purchaseOrders/byRequestId/${data?._id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.length >= 1) setPO(res[0]);
        else setPO(null);
      });
  }

  function handleGetProgress(value) {
    let t = 0;
    let totalItems = data?.items.map((i) => {
      t = parseInt(t) + parseInt(i?.quantity);
    });

    setProgress((value / t) * 100);
  }

  return (
    <div className="grid md:grid-cols-5 gap-1">
      {contextHolder}
      <div className="md:col-span-4 flex flex-col ring-1 ring-gray-200 p-3 rounded shadow-md bg-white  overflow-y-scroll">
        <div>
          <Tabs defaultActiveKey="1" type="card" size={size}>
            <Tabs.TabPane tab="Overview" key="1">
              {data ? (
                <Spin
                  spinning={loading}
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                >
                  <div className="flex flex-col space-y-5">
                    {/* TItle */}
                    <div className="flex flex-row justify-between items-center">
                      <div className="ml-3 text-lg font-bold">
                        Request Details
                      </div>
                      <Tag
                        color={data.status === "declined" ? "red" : "geekblue"}
                      >
                        {data.status}
                      </Tag>
                      {/* <div className="">
                        <Tag color={data?.budgeted ? "green" : "blue"}>
                          <Tooltip title={data?.budgetLine} showArrow={false}>
                            {data?.budgeted ? "budgeted" : "not budgeted"}
                          </Tooltip>
                        </Tag>
                      </div>
                      <div className="">
                        <Tag>
                          Requested by{" "}
                          {data?.createdBy?.firstName +
                            " " +
                            data?.createdBy?.lastName}
                        </Tag>
                      </div> */}
                    </div>
                    <div className="flex flex-row justify-between items-start">
                      <div className="grid md:grid-cols-4 gap-5 w-full">
                        {/* Request number */}
                        <div className="flex flex-col space-y-1 items-start">
                          <div className="text-xs ml-3 text-gray-400">
                            Request Number:
                          </div>
                          <div className="text-sm font-semibold ml-3 text-gray-600">
                            {data?.number}
                          </div>
                        </div>

                        {/* Initiator */}
                        <div className="flex flex-col space-y-1 items-start">
                          <div className="text-xs ml-3 text-gray-400">
                            Initiator:
                          </div>
                          <div className="text-sm font-semibold ml-3 text-gray-600">
                            {data?.createdBy?.firstName +
                              " " +
                              data?.createdBy?.lastName}
                          </div>
                        </div>

                        {/* Department */}
                        <div className="flex flex-col space-y-1 items-start">
                          <div className="text-xs ml-3 text-gray-400">
                            Department:
                          </div>
                          <div className="text-sm font-semibold ml-3 text-gray-600">
                            {data?.createdBy?.department?.description}
                          </div>
                        </div>

                        {/* Due date */}
                        <div className="flex flex-col space-y-1 items-start">
                          <div className="text-xs ml-3 text-gray-400">
                            Due date:
                          </div>
                          {!edit && (
                            <div className="text-sm font-semibold ml-3 text-gray-600">
                              {moment(data?.dueDate).format("YYYY-MMM-DD")}
                            </div>
                          )}
                          {edit && (
                            <div className="text-sm font-semibold ml-3 text-gray-600">
                              <Form.Item
                                name="dueDate"
                                rules={[
                                  {
                                    required: true,
                                    message: "Due date is required",
                                  },
                                ]}
                              >
                                <DatePicker
                                  style={{ width: "100%" }}
                                  defaultValue={moment(data?.dueDate)}
                                  disabledDate={(current) =>
                                    current.isBefore(moment().subtract(1, "d"))
                                  }
                                  value={data?.dueDate}
                                  onChange={(v, dstr) => {
                                    let _d = data;
                                    _d.dueDate = dstr;
                                    handleUpdateRequest(_d);
                                  }}
                                />
                              </Form.Item>
                            </div>
                          )}
                        </div>

                        {/* Service Category */}
                        <div className="flex flex-col space-y-1 items-start">
                          <div className="text-xs ml-3 text-gray-400">
                            Service category:
                          </div>
                          {!edit && (
                            <div className="text-sm font-semibold ml-3 text-gray-600">
                              {data?.serviceCategory}
                            </div>
                          )}

                          {edit && (
                            <Select
                              // mode="multiple"
                              // allowClear
                              className="ml-3"
                              defaultValue={data?.serviceCategory}
                              style={{ width: "100%" }}
                              placeholder="Please select"
                              onChange={(value) => {
                                let r = { ...data };
                                r.serviceCategory = value;
                                handleUpdateRequest(r);
                              }}
                            >
                              {servCategories?.map((s) => {
                                return (
                                  <Select.Option
                                    key={s._id}
                                    value={s.description}
                                  >
                                    {s.description}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          )}
                        </div>

                        {/* Budgeted */}
                        <div className="flex flex-col space-y-1 items-start">
                          <div className="text-xs ml-3 text-gray-400">
                            Budgeted:
                          </div>
                          {!edit && (
                            <div className="text-sm font-semibold ml-3 text-gray-600">
                              {data?.budgeted ? "Yes" : "No"}
                            </div>
                          )}
                          {edit && (
                            <div className="text-xs ml-3 text-gray-400">
                              <Select
                                // mode="multiple"
                                // allowClear
                                defaultValue={data?.budgeted ? "Yes" : "No"}
                                // style={{ width: "100%" }}
                                placeholder="Please select"
                                onChange={(value) => {
                                  let r = { ...data };
                                  r.budgeted = value;
                                  handleUpdateRequest(r);
                                }}
                                options={[
                                  { value: true, label: "Yes" },
                                  { value: false, label: "No" },
                                ]}
                              />
                            </div>
                          )}
                        </div>

                        {/* Budgete Line */}
                        <div className="flex flex-col space-y-1 items-start">
                          <div className="text-xs ml-3 text-gray-400">
                            Budget Line:
                          </div>
                          <div className="text-sm font-semibold ml-3 text-gray-600">
                            {data?.budgetLine}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col space-y-1 items-start">
                          <div className="text-xs ml-3 text-gray-400">
                            Description:
                          </div>
                          {!edit && (
                            <div className="text-sm font-semibold ml-3 text-gray-600">
                              {data?.description}
                            </div>
                          )}
                          {edit && (
                            <div className="text-xs ml-3 text-gray-400">
                              <Typography.Text
                                editable={
                                  edit && {
                                    text: data?.description,
                                    onChange: (e) => {
                                      let req = { ...data };
                                      req.description = e;
                                      handleUpdateRequest(req);
                                    },
                                  }
                                }
                              >
                                {data?.description}
                              </Typography.Text>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="p-5">
                      <Table
                        size="small"
                        dataSource={data.items}
                        columns={columns}
                        rowClassName={() => "editable-row"}
                        bordered
                        pagination={false}
                      />
                    </div>

                    {
                      // data.status !== "approved" &&
                      //   data.status !== "po created" &&
                      //   data.status !== "declined" &&
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
                        data?.approvalDate,
                        refDoc,
                        setRefDoc,
                        contracts,
                        submitPOData,
                        setSelectedContract,
                        data,
                        submitContractData,
                        setTendeDocSelected,
                        form
                      )
                    }

                    {/* {po?.status === "started" && (
                      <div className="ml-5 w-1/3">
                        <div>Delivery progress</div>
                        <Progress
                          percent={_.round(po?.deliveryProgress, 1) || 0}
                          size="small"
                          status="active"
                        />
                      </div>
                    )} */}

                    {/* {po?.status === "started" &&
                      po?.deliveryProgress < 100 &&
                      user?._id === data?.createdBy?._id &&
                      po?.items.map((i, index) => {
                        return (
                          <div key={i.key} className="m-5">
                            <div>
                              Delivery for {i.title}{" "}
                              <Tag>{i?.deliveredQty} delivered</Tag>
                            </div>

                            {buildConfirmDeliveryForm(
                              po,
                              handleGetProgress,
                              handleUpdateProgress,
                              progress,
                              index
                            )}
                          </div>
                        );
                      })} */}

                    <div className="ml-3 text-lg font-bold">
                      Delivery progress
                    </div>
                    {data?.items.map((i, index) => {
                      let deliveredQty = po?.items[index].deliveredQty || 0;
                      return (
                        <div key={i.key} className="m-5">
                          <div>
                            {i.title}: {deliveredQty || 0} delivered out of{" "}
                            {i?.quantity}
                          </div>

                          {deliveredQty < parseInt(i?.quantity) &&
                            buildConfirmDeliveryForm(
                              po,
                              handleGetProgress,
                              handleUpdateProgress,
                              progress,
                              index,
                              i?.quantity
                            )}
                        </div>
                      );
                    })}

                    <div className="ml-3 w-1/3">
                      {/* <div>Delivery progress</div> */}
                      <Progress
                        percent={_.round(po?.deliveryProgress, 1) || 0}
                        size="small"
                        status="active"
                      />
                    </div>

                    {/* {data.status === "approved" &&
                      (tender || po) &&
                      buildWorkflow(currentStep, tender, po)} */}

                    {po && po.deliveryProgress >= 100 && !po.rate && (
                      <div className="justify-center items-center w-full flex flex-col space-y-3">
                        <Divider></Divider>
                        <Typography.Title level={5}>
                          Supplier & Delivery Rate
                        </Typography.Title>
                        <Rate
                          // allowHalf
                          disabled={user?._id !== data?.createdBy?._id}
                          defaultValue={po?.rate || rate}
                          tooltips={[
                            "Very bad",
                            "Bad",
                            "Good",
                            "Very good",
                            "Excellent",
                          ]}
                          onChange={(value) => setRate(value)}
                          // onChange={(value) => handleRateDelivery(po, value)}
                        />

                        <Typography.Title level={5}>
                          Give a comment on your rating
                        </Typography.Title>
                        <Input.TextArea
                          className="w-1/3"
                          value={comment}
                          onChange={(v) => setComment(v.target.value)}
                        />

                        <div>
                          <Button
                            type="primary"
                            onClick={() =>
                              handleRateDelivery(po, rate, comment)
                            }
                          >
                            Submit my rate and review
                          </Button>
                        </div>
                      </div>
                    )}

                    {po && po.deliveryProgress >= 100 && po.rate && (
                      <div className="justify-center items-center w-full flex flex-col space-y-3">
                        <Divider></Divider>
                        <Typography.Title level={5}>
                          Supplier & Delivery Rate
                        </Typography.Title>
                        <Rate
                          // allowHalf
                          disabled
                          defaultValue={po?.rate}
                          tooltips={[
                            "Very bad",
                            "Bad",
                            "Good",
                            "Very good",
                            "Excellent",
                          ]}
                          // onChange={(value) => setRate(value)}
                          // onChange={(value) => handleRateDelivery(po, value)}
                        />

                        <Typography.Text level={5}>
                          {po?.comment}
                        </Typography.Text>
                      </div>
                    )}

                    {data.status === "declined" && (
                      <div className="flex flex-col mt-5 space-y-1">
                        <div className="text-xs font-semibold ml-3  text-gray-500">
                          The request was declined by {data?.declinedBy}. Below
                          is the reason/comment.
                        </div>
                        <div className="text-sm ml-3 text-gray-600">
                          <Alert
                            message={data?.reasonForRejection}
                            type="error"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Spin>
              ) : (
                <Empty />
              )}
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="New Task" key="2"></Tabs.TabPane> */}
          </Tabs>
        </div>
        {createPOMOdal()}
        {previewAttachmentModal()}
        {createContractMOdal()}
      </div>
      <div className="flex flex-col rounded space-y-5 bg-white px-4 pt-2 shadow ">
        <div className="text-lg">Workflow tracker </div>
        <Timeline
          // mode="alternate"
          items={[
            {
              children: <div className="">PR-created</div>,
              color: data?.status !== "declined" ? "blue" : "red",
              dot: data?.status !== "declined" && (
                <CheckCircleOutlined className=" text-green-500" />
              ),
            },
            {
              children: <div className="">PR-approved</div>,
              color:
                data?.status === "approved (pm)" || tender ? "blue" : "gray",
              dot: (data?.status === "approved (pm)" || tender) && (
                <CheckCircleOutlined className=" text-green-500" />
              ),
            },
            {
              children: `Tender-created`,
              color: tender ? "blue" : "gray",
              dot: tender && (
                <CheckCircleOutlined className=" text-green-500" />
              ),
            },
            {
              color: contract ? "blue" : "gray",
              children: "Contract-created",
              dot: contract && (
                <CheckCircleOutlined className=" text-green-500" />
              ),
            },
            {
              children: "PO-created",
              color: po ? "blue" : "gray",
              dot: po && <CheckCircleOutlined className=" text-green-500" />,
            },
            {
              children: "Delivered",
              color: progress >= 100 ? "blue" : "gray",
              dot: po && progress >= 100 && (
                <CheckCircleOutlined className=" text-green-500" />
              ),
            },
          ]}
        />
      </div>
    </div>
  );

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
    date,
    refDoc,
    setRefDoc,
    contracts,
    submitPOData,
    setSelectedContract,
    data,
    submitContractData,
    setTendeDocSelected,
    form
  ) {
    return (
      <>
        <Divider></Divider>
        <div className="grid md:grid-cols-2">
          <div>
            <div className="ml-3 text-lg font-semibold">
              Request Approval Queue
            </div>
            {/* Approval flow */}
            <div className="mx-3 mt-5 ">
              <Steps
                direction="vertical"
                current={currentCode}
                items={[
                  {
                    title: `Level 1 (Department - ${
                      data?.level1Approver?.firstName +
                      " " +
                      data?.level1Approver?.lastName
                    })`,
                    icon: <UserGroupIcon className="h-6" />,
                    subTitle: currentCode >= 0 && (
                      <div className="flex flex-row items-center space-x-1">
                        <div>
                          <CheckOutlined className="h-5 w-5 text-green-500" />{" "}
                        </div>
                        <div>
                          Approved {moment(data?.hod_approvalDate).fromNow()}
                        </div>
                      </div>
                    ),
                    description: currentCode == -1 && (
                      <div className="flex flex-col">
                        <div>
                          Kindly check if the request is relevant and take
                          action accordingly.
                        </div>
                        <div className="flex flex-row space-x-5">
                          <div>
                            <Popconfirm
                              title="Are you sure?"
                              open={openApprove}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              onConfirm={() => {
                                changeStatus(0);
                                setOpenApprove(false);
                              }}
                              // okButtonProps={{
                              //   loading: confirmRejectLoading,
                              // }}
                              onCancel={() => setOpenApprove(false)}
                            >
                              <Button
                                disabled={
                                  !user?.permissions?.canApproveAsHod ||
                                  user?._id !== data?.level1Approver?._id ||
                                  currentCode > 0
                                }
                                onClick={() => setOpenApprove(true)}
                                type="primary"
                                size="small"
                              >
                                Approve
                              </Button>
                            </Popconfirm>
                          </div>
                          <div>
                            <Popconfirm
                              title="Are you sure?"
                              open={open}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              onConfirm={() => {
                                if (reason?.length >= 3) handleOk();
                              }}
                              description={
                                <>
                                  <Input
                                    onChange={(v) => setReason(v.target.value)}
                                    placeholder="Please insert a reason for the rejection"
                                  ></Input>
                                </>
                              }
                              okButtonProps={{
                                disabled: reason?.length < 3,
                                loading: confirmRejectLoading,
                              }}
                              onCancel={handleCancel}
                            >
                              <Button
                                icon={<DislikeOutlined />}
                                disabled={
                                  !user?.permissions?.canApproveAsHod ||
                                  user?._id !== data?.level1Approver?._id ||
                                  currentCode > 0
                                }
                                danger
                                size="small"
                                type="primary"
                                onClick={showPopconfirm}
                              >
                                Reject
                              </Button>
                            </Popconfirm>
                          </div>
                        </div>
                      </div>
                    ),
                    disabled:
                      !user?.permissions?.canApproveAsHod || currentCode > 0,
                  },
                  {
                    title: "Level 2 (Finance)",
                    icon: <BanknotesIcon className="h-6" />,
                    subTitle: currentCode >= 1 && (
                      <div className="flex flex-row items-center space-x-1">
                        <div>
                          <CheckOutlined className="h-5 w-5 text-green-500" />{" "}
                        </div>
                        <div>
                          Approved {moment(data?.hof_approvalDate).fromNow()}
                        </div>
                      </div>
                    ),
                    description: currentCode === 0 && (
                      <div className="flex flex-col">
                        <div>
                          Kindly check if the request is relevant and take
                          action accordingly.
                        </div>
                        <div className="flex flex-row space-x-5">
                          <div>
                            <Popconfirm
                              title="Are you sure?"
                              open={openApprove}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              onConfirm={() => {
                                changeStatus(1);
                                setOpenApprove(false);
                              }}
                              // okButtonProps={{
                              //   loading: confirmRejectLoading,
                              // }}
                              onCancel={() => setOpenApprove(false)}
                            >
                              <Button
                                disabled={
                                  !user?.permissions?.canApproveAsHof ||
                                  currentCode > 1 ||
                                  currentCode < 0
                                }
                                onClick={() => setOpenApprove(true)}
                                type="primary"
                                size="small"
                              >
                                Approve
                              </Button>
                            </Popconfirm>
                          </div>
                          <div>
                            <Popconfirm
                              title="Are you sure?"
                              open={open}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              onConfirm={() => {
                                if (reason?.length >= 3) handleOk();
                              }}
                              okButtonProps={{
                                disabled: reason?.length < 3,
                                loading: confirmRejectLoading,
                              }}
                              onCancel={handleCancel}
                              description={
                                <>
                                  <Input
                                    onChange={(v) => setReason(v.target.value)}
                                    placeholder="Reason for rejection"
                                  ></Input>
                                </>
                              }
                            >
                              <Button
                                disabled={
                                  !user?.permissions?.canApproveAsHof ||
                                  currentCode > 1 ||
                                  currentCode < 0
                                }
                                type="primary"
                                danger
                                size="small"
                                onClick={showPopconfirm}
                              >
                                Reject
                              </Button>
                            </Popconfirm>
                          </div>
                        </div>
                      </div>
                    ),
                    disabled:
                      !user?.permissions?.canApproveAsHof ||
                      currentCode > 1 ||
                      currentCode < 0,
                  },
                  {
                    // title: "Waiting",
                    title: "Level 3 (Procurement)",
                    icon: <ClipboardDocumentCheckIcon className="h-6" />,
                    subTitle: currentCode >= 2 && (
                      <div className="flex flex-row items-center space-x-1">
                        <div>
                          <CheckOutlined className="h-5 w-5 text-green-500" />{" "}
                        </div>
                        <div>
                          Approved {moment(data?.pm_approvalDate).fromNow()}
                        </div>
                      </div>
                    ),
                    description: currentCode === 1 && (
                      <div className="flex flex-col">
                        <div>
                          Kindly check if the request is relevant and take
                          action accordingly.
                        </div>
                        <div className="flex flex-row space-x-5">
                          <div>
                            <Popconfirm
                              title="Are you sure?"
                              open={openApprove}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              onConfirm={() => {
                                changeStatus(2);
                                setOpenApprove(false);
                              }}
                              // okButtonProps={{
                              //   loading: confirmRejectLoading,
                              // }}
                              onCancel={() => setOpenApprove(false)}
                            >
                              <Button
                                disabled={
                                  !user?.permissions?.canApproveAsPM ||
                                  currentCode > 2 ||
                                  currentCode < 1
                                }
                                onClick={() => setOpenApprove(true)}
                                type="primary"
                                size="small"
                              >
                                Approve
                              </Button>
                            </Popconfirm>
                          </div>
                          <div>
                            <Popconfirm
                              title="Are you sure?"
                              open={open}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              onConfirm={() => {
                                if (reason?.length >= 3) handleOk();
                              }}
                              description={
                                <>
                                  <Input
                                    onChange={(v) => setReason(v.target.value)}
                                    placeholder="Reason for rejection"
                                  ></Input>
                                </>
                              }
                              okButtonProps={{
                                disabled: reason?.length < 3,
                                loading: confirmRejectLoading,
                              }}
                              onCancel={handleCancel}
                            >
                              <Button
                                disabled={
                                  !user?.permissions?.canApproveAsPM ||
                                  currentCode > 2 ||
                                  currentCode < 1
                                }
                                type="primary"
                                danger
                                size="small"
                                onClick={showPopconfirm}
                              >
                                Reject
                              </Button>
                            </Popconfirm>
                          </div>
                        </div>
                      </div>
                    ),
                    disabled:
                      !user?.permissions?.canApproveAsPM ||
                      currentCode > 2 ||
                      currentCode < 1,
                  },
                ]}
              />
            </div>
          </div>
          <div>
            {currentCode === 2 &&
              (user?.permissions?.canCreateTenders ||
                user?.permissions?.canCreatePurchaseOrders ||
                user?.permissions?.canCreateContracts) && (
                <>
                  <Form form={form}>
                    <div className="text-lg font-semibold">
                      Sourcing Method Selection
                    </div>
                    <div className="mt-5 items-center">
                      <div>Indicate available reference</div>
                      <Form.Item name="refDoc">
                        <Select
                          onChange={(value) => setRefDoc(value)}
                          style={{ width: "50%" }}
                          defaultValue={false}
                          options={[
                            {
                              value: "contract",
                              label: "Sourcing from Existing Contract",
                            },

                            {
                              value: "external",
                              label: "Direct contracting",
                            },
                            {
                              value: "none",
                              label: "Tendering",
                            },
                          ]}
                        />
                      </Form.Item>
                    </div>

                    {refDoc === "none" &&
                      buildTenderForm(
                        setDeadLine,
                        user,
                        docId,
                        submitTenderData,
                        setTendeDocSelected,
                        tenderDocSelected
                      )}

                    {refDoc === "contract" &&
                      buildPOForm(
                        setSelectedContract,
                        contracts,
                        user,
                        submitPOData,
                        setVendor,
                        selectedContract
                      )}

                    {refDoc === "external" && (
                      <div>
                        <div className="items-center">
                          <div>Select registered vendor</div>
                          <Form.Item name="vendor">
                            <Select
                              onChange={(value, option) => {
                                setVendor(option?.payload);
                              }}
                              style={{ width: "50%" }}
                              showSearch
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                  .toLowerCase()
                                  .localeCompare(
                                    (optionB?.label ?? "").toLowerCase()
                                  )
                              }
                              filterOption={(inputValue, option) =>
                                option?.label
                                  .toLowerCase()
                                  .includes(inputValue.toLowerCase())
                              }
                              options={vendors
                                ?.filter((v) => v?.status === "approved")
                                ?.map((v) => {
                                  return {
                                    value: v?._id,
                                    label: v?.companyName,
                                    payload: v,
                                  };
                                })}
                            />
                          </Form.Item>
                        </div>
                        <div className="items-center">
                          <div>
                            Upload reference document{" "}
                            <i className="text-xs">(expected in PDF format)</i>
                          </div>
                          <Form.Item name="vendor">
                            <UploadReqAttach
                              uuid={reqAttachId}
                              setAttachSelected={setAttachSelected}
                            />
                          </Form.Item>
                        </div>
                        <div>
                          <div className="flex flex-row items-center space-x-5">
                            <div className="flex flex-row space-x-1 items-center">
                              <Form.Item>
                                <Button
                                  icon={<FileDoneOutlined />}
                                  type="primary"
                                  htmlType="submit"
                                  onClick={submitContractData}
                                  disabled={
                                    !user?.permissions?.canCreateContracts ||
                                    !vendor ||
                                    !attachSelected
                                  }
                                >
                                  Create Contract
                                </Button>
                              </Form.Item>
                            </div>

                            <div className="flex flex-row space-x-1 items-center">
                              <Form.Item>
                                <Button
                                  icon={<FileDoneOutlined />}
                                  type="primary"
                                  htmlType="submit"
                                  onClick={submitPOData}
                                  disabled={
                                    !user?.permissions
                                      ?.canCreatePurchaseOrders ||
                                    !vendor ||
                                    !attachSelected
                                  }
                                >
                                  Create PO
                                </Button>
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Form>
                </>
              )}
          </div>
        </div>
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
            items={
              tender
                ? [
                    {
                      title: `Tender ${tender?.number}`,
                      description: `${tender?.status}`,
                    },
                    {
                      title: po ? `PO ${po?.number}` : "PO",
                    },
                    {
                      title: `${
                        po?.status === "started"
                          ? "Delivery started"
                          : "Delivery"
                      }`,
                      description: po
                        ? `${parseFloat(po?.deliveryProgress).toFixed(1)}%`
                        : "",
                    },
                    {
                      title: `Fully Delivered`,
                      description: `${
                        po?.deliveryProgress < 100 ? "In progress" : ""
                      }`,
                    },
                  ]
                : [
                    {
                      title: po ? `PO ${po?.number}` : "PO",
                    },
                    {
                      title: `${
                        po?.status === "started"
                          ? "Delivery started"
                          : "Delivery"
                      }`,
                      description: po
                        ? `${parseFloat(po?.deliveryProgress).toFixed(1)}%`
                        : "",
                    },
                    {
                      title: `Fully Delivered`,
                      description: `${
                        po?.deliveryProgress < 100 ? "In progress" : ""
                      }`,
                    },
                  ]
            }
          />
        </div>
      </>
    );
  }

  function buildConfirmDeliveryForm(
    po,
    handleGetProgress,
    handleUpdateProgress,
    progress,
    index,
    qty
  ) {
    // let [op, setOp] = useState(false);
    let deliverdQty = po?.items[index].deliveredQty || 0;
    return (
      <div className="mt-2 ">
        {
          // po?.status === "started" && po?.deliveryProgress < 100 && (
          <div className="grid grid-cols-2 gap-10">
            {/* <div>
              <Form layout="inline" size="small">
                <Form.Item required>
                  <InputNumber
                    style={{ width: "100%" }}
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
                          parseFloat(progress) +
                            parseFloat(po?.deliveryProgress)
                        );
                      }}
                    ></Button>
                  </Popover>
                </Form.Item>
              </Form>
            </div> */}

            <div>
              <Form layout="inline">
                <Form.Item required>
                  <InputNumber
                    disabled={po?.status !== "started"}
                    style={{ width: "100%" }}
                    placeholder="qty delivered"
                    onChange={(value) => {
                      handleGetProgress(value);
                      setDeliveredQty(deliverdQty + value);
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  {/* <Popover content="Confirm Quantity approved"> */}
                  <Popconfirm
                    title="Confirm Delivered Quantity"
                    open={open}
                    onCancel={() => setOpen(false)}
                    onConfirm={() => {
                      handleUpdateProgress(
                        po,
                        parseFloat(progress) + parseFloat(po?.deliveryProgress),
                        deliveredQty,
                        index
                      );

                      setOpen(false);
                    }}
                  >
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => setOpen(true)}
                      disabled={po?.status !== "started" || deliveredQty > qty}
                    >
                      Confirm
                    </Button>
                  </Popconfirm>
                  {/* </Popover> */}
                </Form.Item>
              </Form>
            </div>
          </div>
          // )
        }
      </div>
    );
  }

  function createPOMOdal() {
    return (
      <Modal
        title="New Purchase Order"
        centered
        open={openCreatePO}
        confirmLoading={creatingPO}
        onOk={async () => {
          setCreatingPO(true);
          let assetItems = [];
          let nonAssetItems = [];

          items
            .filter((i) => i.itemType === "asset")
            .map((i, index) => {
              i?.assetCodes?.map((a) => {
                assetItems.push({
                  ItemCode: a,
                  Quantity: i.quantity / i?.assetCodes?.length,
                  UnitPrice: i.estimatedUnitCost,
                  VatGroup: i.taxGroup ? i.taxGroup : "X1",
                });
              });
            });

          items
            .filter((i) => i.itemType === "non-asset" || !i.itemType)
            .map((i, index) => {
              nonAssetItems.push({
                ItemDescription: i.title,
                Quantity: i.quantity,
                UnitPrice: i.estimatedUnitCost,
                VatGroup: i.taxGroup ? i.taxGroup : "X1",
              });
            });

          // if (docType === "dDocument_Item") {
          //   items.map((i, index) => {
          //     assets[index]?.map((a) => {
          //       assetItems.push({
          //         ItemCode: a,
          //         Quantity: i.quantity / assets[index]?.length,
          //         UnitPrice: i.estimatedUnitCost,
          //         VatGroup: i.taxGroup ? i.taxGroup : "X1",
          //       });
          //     });
          //   });
          // }
          let B1Data_Assets;
          assetItems?.length >= 1
            ? (B1Data_Assets = {
                CardName: vendor?.companyName,
                DocType: "dDocument_Item",
                DocDate: docDate,
                DocumentLines: assetItems,
              })
            : (B1Data_Assets = null);

          let B1Data_NonAssets;
          nonAssetItems?.length >= 1
            ? (B1Data_NonAssets = {
                CardName: vendor?.companyName,
                DocType: "dDocument_Service",
                DocDate: docDate,
                DocumentLines: nonAssetItems,
              })
            : (B1Data_NonAssets = null);

          if (!signatories || signatories?.length < 3) {
            messageApi.open({
              type: "error",
              content:
                "PO can not be submitted. Please specify at least 3 signatories!",
            });
            setCreatingPO(false);
          } else if (
            items?.filter(
              (i) =>
                i.quantity <= 0 ||
                i.estimatedUnitCost <= 0 ||
                !i.quantity ||
                !i.estimatedUnitCost
            )?.length >= 1
          ) {
            messageApi.open({
              type: "error",
              content: "PO can not be created. Please specify Quantity/Price!",
            });
            setCreatingPO(false);
          } else if (
            signatories?.filter((s) => {
              return !s?.onBehalfOf || !s?.title || !s?.names || !s?.email;
            })?.length >= 1
          ) {
            messageApi.open({
              type: "error",
              content:
                "PO can not be submitted. Please fill in the relevant signatories' details!",
            });
            setCreatingPO(false);
          } else {
            await handleCreatePO(
              vendor?._id,
              tendor?._id,
              user?._id,
              sections,
              items,
              {
                B1Data_Assets,
                B1Data_NonAssets,
              },
              signatories,
              data?._id,
              refDoc === "external" ? reqAttachId : ""
            );
            setCreatingPO(false);
            setOpenCreatePO(false);
          }
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
            {/* <div>
              <div>Document date</div>
              <DatePicker onChange={(v, dstr) => setDocDate(dstr)} />
            </div> */}

            {/* PO type */}
            {/* <div>
              <div>PO Type</div>
              <Select
                onChange={(value) => setDocType(value)}
                defaultValue="dDocument_Service"
                options={[
                  { value: "dDocument_Service", label: "Service" },
                  { value: "dDocument_Item", label: "Item" },
                ]}
              />
            </div> */}
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
            {docType === "dDocument_Item" && (
              <div className="flex flex-col">
                <Typography.Title level={4}>Asset assignment</Typography.Title>
                <div className="p-5 rounded ring-1 ring-gray-200 grid md:grid-cols-3 gap-2">
                  {items?.map((i, index) => {
                    return (
                      <div key={i?.key}>
                        Select asset(s) for {i?.title}
                        <div>
                          <Select
                            mode="tags"
                            showArrow
                            style={{ width: "100%" }}
                            onChange={(value) => {
                              let _v = [...assets];
                              _v[index] = value;
                              setAssets(_v);
                            }}
                            options={assetOptions}
                            showSearch
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <ItemsTable
              dataSource={items}
              setDataSource={setItems}
              assetOptions={assetOptions}
            />
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
              {/* New Signatory */}
              <div
                onClick={() => {
                  let signs = [...signatories];
                  let newSignatory =
                    signs?.length <= 1
                      ? { onBehalfOf: "Irembo Ltd" }
                      : {
                          onBehalfOf: vendor?.companyName,
                          title: vendor?.title,
                          names: vendor?.contactPersonNames,
                          email: vendor?.email,
                        };

                  signs.push(newSignatory);
                  setSignatories(signs);
                }}
                className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3 items-center justify-center cursor-pointer hover:bg-gray-50"
              >
                <Image
                  src="/icons/icons8-signature-80.png"
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
          if (!signatories || signatories?.length < 2) {
            messageApi.open({
              type: "error",
              content:
                "PO can not be submitted. Please specify at least 2 signatories!",
            });
          } else if (
            signatories?.filter((s) => {
              return !s?.onBehalfOf || !s?.title || !s?.names || !s?.email;
            })?.length >= 1
          ) {
            messageApi.open({
              type: "error",
              content:
                "PO can not be submitted. Please fill in the relevant signatories' details!",
            });
          } else {
            handleCreateContract(
              vendor?._id,
              null,
              user?._id,
              sections,
              contractStartDate,
              contractEndDate,
              signatories,
              refDoc === "external" ? reqAttachId : ""
            );
            setOpenCreateContract(false);
          }
        }}
        okText="Submit for review"
        onCancel={() => setOpenCreateContract(false)}
        width={"80%"}
        bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div className="space-y-10 px-20 py-5">
          {contextHolder}
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
                let newSignatory =
                  signs?.length < 2
                    ? { onBehalfOf: "Irembo Ltd" }
                    : {
                        onBehalfOf: vendor?.companyName,
                        title: vendor?.title,
                        names: vendor?.contactPersonNames,
                        email: vendor?.email,
                      };
                signs.push(newSignatory);
                setSignatories(signs);
              }}
              className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3 items-center justify-center cursor-pointer hover:bg-gray-50"
            >
              <Image
                src="/icons/icons8-signature-80.png"
                width={40}
                height={40}
              />
              <div>Add new Signatory</div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  function getPoTotalVal() {
    let t = 0;
    let tax = 0;
    poItems.map((i) => {
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

  function previewAttachmentModal() {
    return (
      <Modal
        title="Attachment view"
        centered
        open={previewAttachment}
        onOk={() => setPreviewAttachment(false)}
        onCancel={() => setPreviewAttachment(false)}
        width={"60%"}
        // bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <MyPdfViewer fileUrl={`${url}/file/termsOfReference/${attachmentId}`} />
      </Modal>
    );
  }
};

export default RequestDetails;

function buildSingatory(onBehalfOf, repTitle, repNames, repEmail) {
  return (
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
          <Typography.Text strong>e.manirakiza@irembo.com</Typography.Text>
        </div>
      </div>

      <Popconfirm title="Confirm PO Signature">
        <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-blue-50 p-5 cursor-pointer hover:opacity-75">
          <Image width={40} height={40} src="/icons/icons8-signature-80.png" />

          <div className="text-blue-400 text-lg">Sign with one click</div>
        </div>
      </Popconfirm>
    </div>
  );
}

function addSingatory() {
  return (
    <div className="flex flex-col ring-1 ring-gray-100  rounded pt-5 space-y-3 items-center justify-center p-2">
      <Image width={60} height={60} src="/icons/icons8-add-file-64.png" />
    </div>
  );
}

function contractParty(companyName, companyAdress, companyTin, partyType) {
  return (
    <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
      <div className="flex flex-col">
        <Typography.Text type="secondary">
          <div className="text-xs">Company Name</div>
        </Typography.Text>
        <Typography.Text strong>{companyName}</Typography.Text>
      </div>

      <div className="flex flex-col">
        <Typography.Text type="secondary">
          <div className="text-xs">Company Address</div>
        </Typography.Text>
        <Typography.Text strong>{companyAdress}</Typography.Text>
      </div>

      <div className="flex flex-col">
        <Typography.Text type="secondary">
          <div className="text-xs">Company TIN no.</div>
        </Typography.Text>
        <Typography.Text strong>{companyTin}</Typography.Text>
      </div>

      <div className="flex flex-col">
        <Typography.Text type="secondary">
          <div className="text-xs">Hereinafter refferd to as</div>
        </Typography.Text>
        <Typography.Text strong>{partyType}</Typography.Text>
      </div>
    </div>
  );
}

function buildTenderForm(
  setDeadLine,
  user,
  docId,
  submitTenderData,
  setTendeDocSelected,
  tenderDocSelected
) {
  return (
    <>
      <div className="items-center">
        <Typography.Title level={5}>Create Tender</Typography.Title>
        <Form.Item
          name="tenderDocUrl"
          label={
            <div>
              Upload Tender Documents{" "}
              <i className="text-xs">(expected in PDF format)</i>
            </div>
          }
        >
          <UploadTenderDoc
            uuid={docId}
            setTendeDocSelected={setTendeDocSelected}
          />
        </Form.Item>
        <Form.Item
          name="deadLine"
          label="Indicate Bid Submission Deadline"
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
            disabledDate={(current) =>
              current.isBefore(moment().subtract(1, "d"))
            }
            onChange={(v, str) => setDeadLine(str)}
          />
        </Form.Item>
      </div>
      <div className="flex flex-row space-x-1 mt-5 items-center">
        <Form.Item>
          <Button
            icon={<FileDoneOutlined />}
            type="primary"
            htmlType="submit"
            onClick={submitTenderData}
            disabled={
              !user?.permissions?.canCreateTenders || !tenderDocSelected
            }
          >
            Publish Tender
          </Button>
        </Form.Item>
      </div>
    </>
  );
}

function buildPOForm(
  setSelectedContract,
  contracts,
  user,
  submitPOData,
  setVendor,
  selectedContract
) {
  return (
    <div className="">
      <Typography.Title level={5}>Select existing contract</Typography.Title>
      <Form.Item>
        <Form.Item
          // label="Contract"
          name="contract"
        >
          <Select
            allowClear
            style={{ width: "300px" }}
            placeholder="search by vendor name, contract #"
            showSearch
            onChange={(value, option) => {
              setSelectedContract(option?.payload);
              setVendor(option?.payload.vendor);
            }}
            filterSort={(optionA, optionB) =>
              (optionA?.name ?? "")
                .toLowerCase()
                .localeCompare((optionB?.name ?? "").toLowerCase())
            }
            filterOption={(inputValue, option) =>
              option?.name.toLowerCase().includes(inputValue.toLowerCase())
            }
            // defaultValue="RWF"
            options={contracts.map((c) => {
              return {
                value: c._id,
                label: (
                  <div className="flex flex-col">
                    <div>
                      <UserOutlined /> {c.vendor?.companyName}
                    </div>
                    <div className="text-gray-300">{c?.number}</div>
                  </div>
                ),
                name: c.vendor?.companyName + c?.number,

                payload: c,
              };
            })}
          ></Select>
        </Form.Item>

        <Button
          // size="small"
          type="primary"
          icon={<FileDoneOutlined />}
          onClick={submitPOData}
          disabled={
            !user?.permissions?.canCreatePurchaseOrders || !selectedContract
          }
          htmlType="submit"
        >
          Create PO
        </Button>
      </Form.Item>
    </div>
  );
}
