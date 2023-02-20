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
} from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import Image from "next/image";
import ItemsTable from "./itemsTable";
import dynamic from "next/dynamic";
import parse from "html-react-parser";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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
  let [framework, setFramework] = useState(false);
  let [contracts, setContracts] = useState([]);
  let [selectedContract, setSelectedContract] = useState(null);
  let [openCreatePO, setOpenCreatePO] = useState(false);
  let [sections, setSections] = useState([]);

  let [totalVal, setTotVal] = useState(0);
  let [poItems, setPOItems] = useState();

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
    console.log(statusCode);
    setCurrentCode(statusCode);
    getContracts();
    setPOItems(data?.items);
    checkDirectPOExists(data)
    if (data) {
      checkTenderExists(data);
    }
  }, [data]);

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
    else checkDirectPOExists(data);
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

  function submitPOData(values) {
    // vendor, tender, request, createdBy, sections, status, deliveryProgress;
    let user = JSON.parse(localStorage.getItem("user"));
    let poData = {
      createdBy: user._id,
      vendor: selectedContract?.vendor?._id,
      tender: selectedContract?.tender?._id,
      request: selectedContract?.request?._id,
      sections: [{}],
      status: "open",
      deliveryProgress: 0,
    };
    // handleCreatePO(poData)
    // alert(JSON.stringify(poData))
    setOpenCreatePO(true);
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
        if (res) setPO(res[0]);
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
    <div className="flex flex-col max-h-max ring-1 ring-gray-200 p-3 rounded shadow-md bg-white">
      <Tabs defaultActiveKey="1" type="card" size={size}>
        <Tabs.TabPane tab="Overview" key="1">
          {data ? (
            <Spin
              spinning={loading}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            >
              <div className="flex flex-col space-y-10">
                {/* TItle */}
                <div className="flex flex-row justify-between items-start">
                  <div className="grid grid-cols-5">
                    <div className="flex flex-col space-y-1 items-start">
                      <div className="text-xs font-semibold ml-3 text-gray-400">
                        Request Number:
                      </div>
                      <div className="text-sm font-semibold ml-3 text-gray-600">
                        {data?.number}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1 items-start">
                      <div className="text-xs font-semibold ml-3 text-gray-400">
                        Service category:
                      </div>
                      <div className="text-sm font-semibold ml-3 text-gray-600">
                        {data?.serviceCategory}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1 items-start">
                      <div className="text-xs font-semibold ml-3 text-gray-400">
                        Due date:
                      </div>
                      <div className="text-sm font-semibold ml-3 text-gray-600">
                        {moment(data?.dueDate).format("YYYY-MMM-DD")}
                      </div>
                    </div>

                    <div className="flex flex-col col-span-2 space-y-1 items-start">
                      <div className="text-xs font-semibold ml-3 text-gray-400">
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

                {data.status !== "completed" && data.status !== "po created" &&
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
                    data?.approvalDate,
                    framework,
                    setFramework,
                    contracts,
                    submitPOData,
                    setSelectedContract
                  )}
                  
                {(data.status === "completed" ||
                  data.status === "po created") &&
                  (tender || po) &&
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
              </div>
            </Spin>
          ) : (
            <Empty />
          )}
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="New Task" key="2"></Tabs.TabPane> */}
      </Tabs>
      {createPOMOdal()}
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
    framework,
    setFramework,
    contracts,
    submitPOData,
    setSelectedContract
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
                description: `${
                  currentCode === 0 ? moment(date).fromNow() : ""
                }`,
                disabled: !user?.permissions?.canApproveAsHod || currentCode>0
              },
              {
                // title: "Waiting",
                title: "Approved by the Head of finance",
                description: `${
                  currentCode === 1 ? moment(date).fromNow() : ""
                }`,
                disabled: !user?.permissions?.canApproveAsHof || currentCode>1 || currentCode<0
              },
              {
                // title: "Waiting",
                title: "Approved by the Procurement Manager",
                description: `${
                  currentCode === 2 ? moment(date).fromNow() : ""
                }`,
                disabled: !user?.permissions?.canApproveAsPm || currentCode>2 || currentCode<1
              },
            ]}
          />
        </div>

        {currentCode === 2 && (
          <Form onFinish={framework ? submitPOData : submitTenderData}>
            <Divider></Divider>
            <div className=" ml-3 mt-5 items-center w-1/3">
              <Form.Item
                name="framework"
                label="Is there a framework contract for this request?"
              >
                <Select
                  onChange={(value) => setFramework(value)}
                  defaultValue={false}
                  options={[
                    {
                      value: true,
                      label: "Yes",
                    },
                    {
                      value: false,
                      label: "No",
                    },
                  ]}
                />
              </Form.Item>
            </div>

            {!framework && buildTenderForm(setDeadLine)}

            {framework && buildPOForm(setSelectedContract, contracts)}
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
            items={tender?[
              {
                title: `Tender ${tender?.number}`,
                description: `${tender?.status}`,
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
                description: `${
                  po?.deliveryProgress < 100 ? "In progress" : ""
                }`,
              },
            ] : [
              
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
                description: `${
                  po?.deliveryProgress < 100 ? "In progress" : ""
                }`,
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

  function createPOMOdal() {
    return (
      <Modal
        title="New Purchase Order"
        centered
        open={openCreatePO}
        onOk={() => {
          setOpenCreatePO(false);
          handleCreatePO(
            selectedContract?.vendor?._id,
            selectedContract?.tendor?._id,
            user?._id,
            sections,
            poItems
          );
        }}
        okText="Save and Submit"
        onCancel={() => setOpenCreatePO(false)}
        width={"80%"}
        bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div className="space-y-10 px-28 py-5">
          <Typography.Title level={4}>
            PURCHASE ORDER: {selectedContract?.vendor?.companyName}
          </Typography.Title>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            {contractParty(
              "Irembo Ltd",
              "Irembo Campass Nyarutarama KG 9 Ave",
              "102911562",
              "Sender"
            )}
            {contractParty(
              selectedContract?.vendor?.companyName,
              `${selectedContract?.vendor?.building}-
                  ${selectedContract?.vendor?.street}-
                  ${selectedContract?.vendor?.avenue}`,
              selectedContract?.vendor?.tin,
              "Receiver"
            )}

            {/* <div className="flex flex-col ring-1 ring-gray-300 rounded p-5 space-y-3">
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Name</div>
                </Typography.Text>
                <Typography.Text strong>
                  {selectedContract?.vendor?.companyName}
                </Typography.Text>
              </div>

              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company Address</div>
                </Typography.Text>
                <Typography.Text strong>
                  {selectedContract?.vendor?.building}-
                  {selectedContract?.vendor?.street}-
                  {selectedContract?.vendor?.avenue}
                </Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Company TIN no.</div>
                </Typography.Text>
                <Typography.Text strong>
                  {selectedContract?.vendor?.tin}
                </Typography.Text>
              </div>
              <div className="flex flex-col">
                <Typography.Text type="secondary">
                  <div className="text-xs">Hereinafter refferd to as</div>
                </Typography.Text>
                <Typography.Text strong>Receiver</Typography.Text>
              </div>
            </div> */}
          </div>

          <div className="flex flex-col space-y-5">
            <ItemsTable setDataSource={setPOItems} dataSource={poItems} />
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

          <div className="grid grid-cols-3 gap-6 pt-2">
            {buildSingatory(
              "Irembo ltd",
              "Procurement Manager",
              "Manirakiza Edouard",
              "e.manirakiza@irembo.com"
            )}
            {addSingatory()}
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
        <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-violet-50 p-5 cursor-pointer hover:opacity-75">
          <Image width={40} height={40} src="/icons/icons8-stamp-64.png" />

          <div className="text-violet-400 text-lg">Sign with one click</div>
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

function buildTenderForm(setDeadLine) {
  return (
    <>
      <div className=" ml-3 items-center">
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
          <Button icon={<FileDoneOutlined />} type="primary" htmlType="submit">
            Create Tender
          </Button>
        </Form.Item>
      </div>
    </>
  );
}

function buildPOForm(setSelectedContract, contracts) {
  return (
    <div className="ml-3">
      <Typography.Title level={5}>
        Create PO from an existing contract
      </Typography.Title>
      <Form.Item>
        <Form.Item
          // label="Contract"
          name="contract"
        >
          <Select
            style={{ width: "300px" }}
            placeholder="Select contract"
            showSearch
            onChange={(value, option) => {
              setSelectedContract(option.payload);
            }}
            filterSort={(optionA, optionB) =>
              (optionA?.name ?? "")
                .toLowerCase()
                .localeCompare((optionB?.name ?? "").toLowerCase())
            }
            filterOption={(inputValue, option) =>
              option.name.toLowerCase().includes(inputValue.toLowerCase())
            }
            // defaultValue="RWF"
            options={contracts.map((c) => {
              return {
                value: c._id,
                label: (
                  <div className="flex flex-col">
                    <div>
                      <FileProtectOutlined />{" "}
                      {c.tender?.purchaseRequest?.title || c?.request?.title}
                    </div>
                    <div className="text-gray-300">{c?.number}</div>
                  </div>
                ),
                name: c.tender?.purchaseRequest?.title || c?.request?.title,
                payload: c,
              };
            })}
          ></Select>
        </Form.Item>

        <Button
          // size="small"
          type="primary"
          icon={<FileDoneOutlined />}
          onClick={() => {}}
          htmlType="submit"
        >
          Create PO from contract
        </Button>
      </Form.Item>
    </div>
  );
}
