import {
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Typography,
  MenuProps,
  Progress,
  Modal,
  Table,
  Empty,
  Popconfirm,
  Popover,
  Tag,
  Switch,
  message,
  Tooltip,
  Select,
} from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import * as _ from "lodash";
import moment from "moment-timezone";
import {
  LockClosedIcon,
  LockOpenIcon,
  PaperClipIcon,
} from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import MyPdfViewer from "../common/pdfViewer";
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

export default function Contracts({ user }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [contracts, setContracts] = useState(null);
  let [contract, setContract] = useState(null);
  let [totalValue, setTotalValue] = useState(0);
  let [openViewContract, setOpenViewContract] = useState(false);
  let [startingDelivery, setStartingDelivery] = useState(false);
  const [editContract, setEditContract] = useState(
    user?.permissions?.canReviewContracts
  );
  const [previewAttachment, setPreviewAttachment] = useState(false);
  const [attachmentId, setAttachmentId] = useState("TOR-id.pdf");
  const items = [
    {
      key: "1",
      label: "Sign Contract",
    },
    {
      key: "2",
      label: "View Contract",
    },
  ];

  const onMenuClick = (e) => {
    setOpenViewContract(true);
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
  ];

  let [sections, setSections] = useState([
    { title: "Set section title", body: "" },
  ]);
  const [signatories, setSignatories] = useState([]);
  const [docDate, setDocDate] = useState(moment());
  const [docType, setDocType] = useState("dDocument_Service");
  const [signing, setSigning] = useState(false);
  const [searchStatus, setSearchStatus] = useState("all");

  useEffect(() => {
    if (user?.userType === "VENDOR") {
      fetch(`${url}/contracts/byVendorId/${user?._id}`, {
        method: "GET",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setContracts(res);
          setDataLoaded(true);
        })
        .catch((err) => {
          setDataLoaded(true);
        });
    } else {
      fetch(`${url}/contracts/`, {
        method: "GET",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setContracts(res);
          setDataLoaded(true);
        })
        .catch((err) => {
          setDataLoaded(true);
        });
    }
  }, []);

  useEffect(() => {
    if (openViewContract) {
      setSections(contract?.sections);
      setSignatories(contract?.signatories);
    }
  }, [openViewContract]);

  function viewContractMOdal() {
    return (
      <Modal
        title="Display Contract"
        centered
        open={openViewContract}
        onOk={() => {
          editContract && handleUpdateContract(sections, signatories);
          setOpenViewContract(false);
        }}
        okText={editContract ? "Save and Send contract" : "Ok"}
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
            {contract?.status !== "draft" && (
              <Button icon={<PrinterOutlined />}>Print</Button>
            )}
            {contract?.status === "draft" &&
              user?.permissions?.canReviewContracts && (
                <Switch
                  checkedChildren={<EditOutlined />}
                  unCheckedChildren={<EyeOutlined />}
                  defaultChecked={editContract}
                  onChange={(checked) => setEditContract(checked)}
                />
              )}
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
            {sections?.map((s, index) => {
              let section = sections[index]
                ? sections[index]
                : { title: "", body: "" };
              let _sections = [...sections];
              return (
                <>
                  <div className="flex flex-row justify-between items-center">
                    <Typography.Title
                      level={4}
                      editable={
                        editContract && {
                          onChange: (e) => {
                            section.title = e;
                            _sections[index]
                              ? (_sections[index] = section)
                              : _sections.push(section);
                            setSections(_sections);
                          },
                          text: s.title,
                        }
                      }
                    >
                      {s.title}
                    </Typography.Title>
                    {editContract && (
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
                    )}
                  </div>
                  {!editContract && <div>{parse(s?.body)}</div>}
                  {editContract && (
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      value={s.body}
                      onChange={(value) => {
                        section.body = value;
                        _sections[index]
                          ? (_sections[index] = section)
                          : _sections.push(section);
                        setSections(_sections);
                      }}
                    />
                  )}
                </>
              );
            })}
            {editContract && (
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
            )}
          </div>
          {/* Signatories */}
          <div className="grid grid-cols-3 gap-5">
            {signatories?.map((s, index) => {
              return (
                <div
                  key={s?.email}
                  className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3 justify-between"
                >
                  <div className="px-5 flex flex-col space-y-6">
                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">On Behalf of</div>
                      </Typography.Text>
                      <Typography.Text
                        strong
                        editable={
                          editContract && {
                            text: s.onBehalfOf,
                            onChange: (e) => {
                              let _signatories = [...signatories];
                              _signatories[index].onBehalfOf = e;
                              setSignatories(_signatories);
                            },
                          }
                        }
                      >
                        {s.onBehalfOf}
                      </Typography.Text>
                    </div>

                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">Representative Title</div>
                      </Typography.Text>
                      <Typography.Text
                        strong
                        editable={
                          editContract && {
                            text: s.title,
                            onChange: (e) => {
                              let _signatories = [...signatories];
                              _signatories[index].title = e;
                              setSignatories(_signatories);
                            },
                          }
                        }
                      >
                        {s.title}
                      </Typography.Text>
                    </div>

                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">Company Representative</div>
                      </Typography.Text>
                      <Typography.Text
                        strong
                        editable={
                          editContract && {
                            text: s.names,
                            onChange: (e) => {
                              let _signatories = [...signatories];
                              _signatories[index].names = e;
                              setSignatories(_signatories);
                            },
                          }
                        }
                      >
                        {s.names}
                      </Typography.Text>
                    </div>

                    <div className="flex flex-col">
                      <Typography.Text type="secondary">
                        <div className="text-xs">Email</div>
                      </Typography.Text>
                      <Typography.Text
                        strong
                        editable={
                          editContract && {
                            text: s.email,
                            onChange: (e) => {
                              let _signatories = [...signatories];
                              _signatories[index].email = e;
                              setSignatories(_signatories);
                            },
                          }
                        }
                      >
                        {s.email}
                      </Typography.Text>
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
                    <div className="flex flex-row justify-center space-x-10 items-center border-t-2 bg-blue-50 p-5">
                      <Image
                        width={40}
                        height={40}
                        src="/icons/icons8-signature-80.png"
                      />

                      <div className="text-blue-500 flex flex-col">
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

                  {user?.email === s?.email &&
                    !s?.signed &&
                    previousSignatorySigned(signatories, index) && (
                      <Popconfirm
                        title="Confirm Contract Signature"
                        onConfirm={() => handleSignContract(s, index)}
                      >
                        <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-blue-50 p-5 cursor-pointer hover:opacity-75">
                          <Image
                            width={40}
                            height={40}
                            src="/icons/icons8-signature-80.png"
                          />
                          <div className="text-blue-400 text-lg">
                            Sign with one click
                          </div>
                        </div>
                      </Popconfirm>
                    )}

                  {((user?.email !== s?.email && !s.signed) ||
                    !previousSignatorySigned(signatories, index)) && (
                    <div className="flex flex-row justify-center space-x-5 items-center border-t-2 bg-gray-50 p-5">
                      <Image
                        width={40}
                        height={40}
                        src="/icons/icons8-signature-80-2.png"
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

  function handleUpdateContract(sections, signatories) {
    let _contract = { ...contract };
    _contract.sections = sections;
    _contract.signatories = signatories;
    _contract.status = "reviewed";

    fetch(`${url}/contracts/${contract?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newContract: _contract,
      }),
    })
      .then((res) => res.json())
      .then((res1) => {
        setSignatories([]);
        setSections([{ title: "Set section title", body: "" }]);
        setEditContract(false);
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

  function handleSignContract(signatory, index) {
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
            // setSignatories([]);
            // setSections([{ title: "Set section title", body: "" }]);
            setContract(res);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    //call API to sign
  }

  function documentFullySigned(document) {
    let totSignatories = document?.signatories;
    let signatures = document?.signatories?.filter((s) => s.signed);

    return totSignatories?.length === signatures?.length;
  }

  function previousSignatorySigned(signatories, index) {
    let signed = index == 0 ? true : signatories[index - 1]?.signed;
    return signed;
  }

  function handleSignPo(signatory, index) {
    setSigning(true);
    let myIpObj = "";
    signatory.signed = true;
    let _po = { ...contract };

    fetch("https://api.db-ip.com/v2/free/self")
      .then((res) => res.json())
      .then((res) => {
        myIpObj = res;
        signatory.ipAddress = res?.ipAddress;
        signatory.signedAt = moment();
        _po.signatories[index] = signatory;
        setContract(_po);

        fetch(`${url}/purchaseOrders/${contract?._id}`, {
          method: "PUT",
          headers: {
            Authorization:
              "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPo: contract,
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

  function getPoTotalVal() {
    let t = 0;
    let tax = 0;
    contract?.items.map((i) => {
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

  function handleStartDelivery(po) {
    let _pos = [...contracts];
    // Find item index using _.findIndex (thanks @AJ Richardson for comment)
    var index = _.findIndex(_pos, { _id: po._id });
    let elindex = _pos[index];
    elindex.status = "starting";
    // Replace item at index using native splice
    _pos.splice(index, 1, elindex);

    setContracts(_pos);

    fetch(`${url}/purchaseOrders/status/${po?._id}`, {
      method: "PUT",
      body: JSON.stringify({
        status: "started",
      }),
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res?.error) {
          let _pos = [...contracts];
          // Find item index using _.findIndex (thanks @AJ Richardson for comment)
          var index = _.findIndex(_pos, { _id: po._id });
          let elindex = _pos[index];
          elindex.status = "pending";
          // Replace item at index using native splice
          _pos.splice(index, 1, elindex);

          setContracts(_pos);
        } else {
          let _pos = [...contracts];
          // Find item index using _.findIndex (thanks @AJ Richardson for comment)
          var index = _.findIndex(_pos, { _id: po._id });
          let elindex = _pos[index];
          elindex.status = "started";
          // Replace item at index using native splice
          _pos.splice(index, 1, elindex);

          setContracts(_pos);
        }
      });
  }

  function documentFullySigned(document) {
    let totSignatories = document?.signatories;
    let signatures = document?.signatories?.filter((s) => s.signed);

    return totSignatories?.length === signatures?.length;
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
        <div>
          <MyPdfViewer fileUrl={`${url}/file/${attachmentId}`} />
        </div>
      </Modal>
    );
  }

  function documentFullySignedInternally(document) {
    let totIntenalSignatories = document?.signatories?.filter(
      (s) => s.onBehalfOf === "Irembo Ltd"
    );
    let signatures = document?.signatories?.filter(
      (s) => s.signed && s.onBehalfOf === "Irembo Ltd"
    );

    return totIntenalSignatories?.length === signatures?.length;
  }

  return (
    <>
      {contextHolder}
      {previewAttachmentModal()}
      {dataLoaded ? (
        <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000 py-5 flex-1">
          {viewContractMOdal()}

          <div className="flex flex-col items-start space-y-2 ml-3">
            <div className="text-xl font-semibold">Contract List</div>
            <div className="flex-1">
              <Select
                // mode="tags"
                style={{ width: "300px" }}
                placeholder="Select status"
                onChange={(value) => setSearchStatus(value)}
                value={searchStatus}
                options={[
                  { value: "all", label: "All" },
                  { value: "draft", label: "Draft" },
                  {
                    value: "pending",
                    label: "Pending Signature",
                  },
                  {
                    value: "partially-signed",
                    label: "Paritally Signed",
                  },
                  {
                    value: "signed",
                    label: "Signed",
                  },
                ]}
              />
            </div>
          </div>

          {(contracts?.length < 1 || !contracts) && <Empty />}
          {contracts && contracts?.length >= 1 && (
            <div
              className="space-y-4 pb-5"
              style={{
                height: "800px",
                overflowX: "scroll",
                overflowY: "unset",
              }}
            >
              {contracts?.map((contract) => {
                let t = 0;
                return (
                  <div
                    key={contract?.number}
                    className="grid md:grid-cols-5 gap-3 ring-1 ring-gray-200 bg-white rounded px-5 py-3 shadow hover:shadow-md m-3"
                  >
                    {/*  */}
                    <div className="flex flex-col space-y-1">
                      <div className="text-xs text-gray-600">Contract</div>
                      <div className="font-semibold">{contract?.number}</div>
                      <div className="text-gray-600">
                        {contract?.tender?.purchaseRequest?.description ||
                          contract?.request?.description}
                      </div>
                      {contract?.reqAttachmentDocId && (
                        <Typography.Link
                          className="flex flex-row items-center space-x-2"
                          onClick={() => {
                            setPreviewAttachment(!previewAttachment);
                            setAttachmentId(
                              "reqAttachments/" +
                                contract?.reqAttachmentDocId +
                                ".pdf"
                            );
                          }}
                        >
                          <div>{contract?.request?.title}</div>{" "}
                          <div>
                            <PaperClipIcon className="h-4 w-4" />
                          </div>
                        </Typography.Link>
                      )}
                    </div>

                    <div className="flex flex-col space-y-1">
                      <div className="text-xs text-gray-600">Vendor</div>
                      <div className="font-semibold">
                        {contract?.vendor?.companyName}
                      </div>
                      <div className=" text-gray-500">
                        TIN: {contract?.vendor?.tin}
                      </div>
                      <div className=" text-gray-500">
                        email: {contract?.vendor?.companyEmail}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 text-gray-600">
                      {contract?.signatories?.map((s) => {
                        return (
                          <div
                            key={s?.email}
                            className="flex flex-row items-center space-x-2"
                          >
                            <div>
                              {s?.signed ? (
                                <Tooltip
                                  title={`signed: ${moment(s?.signedAt).format(
                                    "DD MMM YYYY"
                                  )} at ${moment(s?.signedAt)
                                    .tz("Africa/Kigali")
                                    .format("h:mm a z")}`}
                                >
                                  <span>
                                    <LockClosedIcon className="h-5 text-green-500" />
                                  </span>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Signature still pending">
                                  <span>
                                    <LockOpenIcon className="h-5 text-yellow-500" />
                                  </span>
                                </Tooltip>
                              )}
                            </div>
                            <div className="flex flex-col text-gray-600">
                              <div>{s?.onBehalfOf}</div>
                              <div>{s?.names}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col space-y-1 items-center justify-center">
                      {/* <Dropdown.Button
                        menu={{ items, onClick: onMenuClick }}
                        onOpenChange={() => {
                          setContract(contract);
                        }}
                      >
                        Actions
                      </Dropdown.Button> */}
                      <Button
                        disabled={
                          user?.userType === "VENDOR" &&
                          !documentFullySignedInternally(contract)
                        }
                        onClick={() => {
                          setContract(contract);
                          setOpenViewContract(true);
                        }}
                      >
                        View Document
                      </Button>
                    </div>

                    <div className="flex flex-col space-y-1 justify-center">
                      {/* <div className="text-xs text-gray-400">Delivery</div> */}
                      {documentFullySigned(contract) && (
                        <>
                          <div>
                            <Tag color="green">Signed</Tag>
                          </div>
                          <Popover
                            placement="topLeft"
                            content={`${moment(contract?.startDate).format(
                              "YYYY-MMM-DD"
                            )} - ${moment(contract?.endDate).format(
                              "YYYY-MMM-DD"
                            )}`}
                          >
                            <div className="text-xs font-thin text-gray-500">
                              Expires in {moment(contract?.endDate).fromNow()}
                            </div>
                          </Popover>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              <div class="absolute -bottom-0 right-10 opacity-10">
                <Image src="/icons/blue icon.png" width={110} height={100} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen flex-1 ">
          <Image alt="" src="/web_search.svg" width={800} height={800} />
        </div>
      )}
    </>
  );
}
