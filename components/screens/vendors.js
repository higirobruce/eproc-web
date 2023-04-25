import {
  Grid,
  Typography,
  Col,
  Divider,
  Row,
  message,
  Input,
  Button,
  Tag,
  Segmented,
  List,
  Empty,
  Switch,
  Select,
  Modal,
  Spin,
  Popover,
  Popconfirm,
  Rate,
  Form,
} from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import VendorsTable from "../vendorsTable";
import _ from "lodash";
import SelectStatuses from "../common/statusSelectTags";
import {
  ArrowLeftOutlined,
  BankOutlined,
  CheckOutlined,
  CompassOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  GiftOutlined,
  GlobalOutlined,
  HomeFilled,
  IdcardOutlined,
  LoadingOutlined,
  MailOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { UserIcon } from "@heroicons/react/24/outline";
import MyPdfViewer from "../common/pdfViewer";
export default function Vendors({ user }) {
  const [passwordForm] = Form.useForm();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [dataset, setDataset] = useState([]);
  let [tempDataset, setTempDataset] = useState([]);
  let [updatingId, setUpdatingId] = useState("");
  let [rowData, setRowData] = useState(null);
  let [segment, setSegment] = useState("Bids");
  let [vendorsBids, setVendorsBids] = useState([]);
  const [previewAttachment, setPreviewAttachment] = useState(false);
  const [attachmentId, setAttachmentId] = useState(null);
  const [editVendor, setEditVendor] = useState(false);
  let [servCategories, setServCategories] = useState([]);
  let [submitting, setSubmitting] = useState(false)

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  let [searchStatus, setSearchStatus] = useState("all");
  let [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadVendors();
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
  }, []);

  useEffect(() => {
    if (searchText === "") {
      refresh();
    } else {
      let _dataSet = [...dataset];
      let filtered = _dataSet.filter((d) => {
        return (
          d?.vendor?.companyName
            ?.toString()
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) > -1 ||
          d?.tin?.toString().indexOf(searchText.toLowerCase()) > -1
        );
      });
      setTempDataset(filtered);
      // else setTempDataset(dataset)
    }
  }, [searchText]);

  useEffect(() => {
    if (rowData) {
      fetch(`${url}/submissions/byVendor/${rowData?.vendor?._id}`, {
        method: "GET",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setVendorsBids(res);
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "Something happened! Please try again.",
          });
        });
    }
  }, [rowData]);

  useEffect(() => {
    setDataLoaded(false);
    let requestUrl = `${url}/users/vendors/byStatus/${searchStatus}/`;
    fetch(requestUrl, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDataLoaded(true);
        setDataset(res);
        setTempDataset(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }, [searchStatus]);

  function refresh() {
    loadVendors();
  }

  function loadVendors() {
    setDataLoaded(false);
    fetch(`${url}/users/vendors`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDataLoaded(true);
        setDataset(res);
        setTempDataset(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }
  useEffect(() => {
    setUpdatingId("");
  }, [dataset]);

  function approveUser(id) {
    setUpdatingId(id);
    fetch(`${url}/users/approve/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setUpdatingId(null);
          messageApi.open({
            type: "error",
            content: res.message,
          });
        } else {
          setUpdatingId(null);
          let _data = [...dataset];
          // Find item index using _.findIndex (thanks @AJ Richardson for comment)
          var index = _.findIndex(_data, { _id: id });
          let elindex = _data[index];
          elindex.status = "approved";

          console.log(_data[index]);
          // Replace item at index using native splice
          _data.splice(index, 1, elindex);

          setDataset(_data);
          setTempDataset(_data);
          setUpdatingId(null);
          messageApi.open({
            type: "success",
            content: "Successfully approved!",
          });
        }
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function declineUser(id) {
    setUpdatingId(id);
    fetch(`${url}/users/decline/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let _data = [...dataset];

        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(_data, { _id: id });
        let elindex = _data[index];
        elindex.status = res?.status;

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
        setTempDataset(_data);
        setUpdatingId(null);
      })
      .catch((err) => {
        setUpdatingId(null);
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function banVendor(id) {
    setUpdatingId(id);
    fetch(`${url}/users/ban/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let _data = [...dataset];

        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(_data, { _id: id });
        let elindex = _data[index];
        elindex.status = res?.status;

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
        setTempDataset(_data);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function activateVendor(id) {
    setUpdatingId(id);
    fetch(`${url}/users/activate/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let _data = [...dataset];

        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(_data, { _id: id });
        let elindex = _data[index];
        elindex.status = res?.status;

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
        setTempDataset(_data);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function updateVendor() {
    fetch(`${url}/users/${rowData?.vendor?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newUser: rowData,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        refresh();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function updatePassword(){
    setSubmitting(true)
    
    fetch(`${url}/users/reset/${rowData?.vendor?.email}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      
    })
      .then((res) => res.json())
      .then((res) => {

        messageApi.open({
          type: "info",
          content: "Vendor password was successfully reset",
        });
        refresh();
        
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      }).finally(()=>{
        setSubmitting(false)
      })
  }

  return !rowData ? (
    <>
      {contextHolder}
      {dataLoaded ? (
        <div className="flex flex-col transition-opacity ease-in-out duration-1000 flex-1 space-y-1 h-full">
          <Row className="flex flex-col space-y-2 bg-white px-10 py-3 shadow">
            <div className="flex flex-row justify-between items-center">
              <div className="text-xl font-semibold">Vendors List</div>
            </div>

            <Row className="flex flex-row space-x-5 items-center justify-between">
              <div className="flex-1">
                <Select
                  // mode="tags"
                  style={{ width: "300px" }}
                  placeholder="Select status"
                  onChange={(value) => setSearchStatus(value)}
                  value={searchStatus}
                  options={[
                    { value: "all", label: "All" },
                    {
                      value: "pending-approval",
                      label: "Pending approval",
                    },
                    {
                      value: "approved",
                      label: "Approved",
                    },
                    {
                      value: "rejected",
                      label: "Rejected",
                    },
                  ]}
                />
              </div>
              <div className="">
                <Input.Search
                  autoFocus
                  style={{ width: "300px" }}
                  onChange={(e) => {
                    setSearchText(e?.target?.value);
                  }}
                  placeholder="Search by vendor name, TIN"
                />
              </div>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={() => refresh()}
              ></Button>
            </Row>
          </Row>

          {/* <Row className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-start space-x-5 w-1/4">
              <div className="text-xl font-semibold">Vendors List</div>
             
            </div>
            <Row className="flex flex-row space-x-5 items-center">
              <div>
                <Input.Search placeholder="Search vendors" />
              </div>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={() => refresh()}
              ></Button>
              <Button type="text" icon={<SettingOutlined />}></Button>
            </Row>
          </Row> */}

          <Row className="flex flex-row space-x-5 mx-10 pt-5">
            <Col flex={4}>
              <VendorsTable
                dataSet={tempDataset}
                handleApproveUser={approveUser}
                handleDeclineUser={declineUser}
                updatingId={updatingId}
                handleBanUser={banVendor}
                handleActivateUser={activateVendor}
                handleSetRow={setRowData}
              />
            </Col>
            {/* <Col flex={1}><OverviewWindow/></Col> */}
          </Row>
          <div class="absolute -bottom-20 right-10 opacity-10">
            <Image src="/icons/blue icon.png" width={110} height={100} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 h-screen">
          <Spin
            indicator={
              <LoadingOutlined
                className="text-gray-500"
                style={{ fontSize: 42 }}
                spin
              />
            }
          />
        </div>
      )}
    </>
  ) : (
    buildVendor()
  );

  function buildVendor() {
    return (
      <div className="flex flex-col  transition-opacity ease-in-out duration-1000 px-10 py-5 flex-1 space-y-3 h-full">
        {contextHolder}
        <div className="flex flex-col space-y-5">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center space-x-2">
              <div>
                <Button
                  icon={<ArrowLeftOutlined />}
                  type="primary"
                  onClick={() => {
                    setRowData(null);
                    setSegment("Bids");
                  }}
                >
                  Back to vendors
                </Button>
              </div>

              {editVendor && (
                <div>
                  <Button
                    icon={<SaveOutlined />}
                    type="primary"
                    onClick={() => {
                      setEditVendor(false);
                      updateVendor();
                    }}
                  />
                </div>
              )}
            </div>
            {user?.permissions?.canEditVendors && (
              <div>
                <Switch
                  checkedChildren={<EditOutlined />}
                  unCheckedChildren={<EyeOutlined />}
                  defaultChecked={editVendor}
                  checked={editVendor}
                  onChange={(checked) => {
                    setEditVendor(checked);
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Data */}
            <div className="flex flex-col space-y-5">
              <div className="bg-white ring-1 ring-gray-100 rounded shadow p-5">
                
                <div className="text-xl font-semibold mb-5 flex flex-row justify-between items-center">
                  <div>General Information</div>

                  {updatingId !== rowData?.vendor?._id && (
                    <div>
                      {rowData?.vendor?.status === "pending-approval" && (
                        <span>
                          <Popconfirm
                            title="Approve vendor"
                            description="Are you sure?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => approveUser(rowData?.vendor?._id)}
                          >
                            <div className="flex flex-row items-center justify-center text-sm ring-1 ring-green-400 rounded px-2 py-1 cursor-pointer bg-green-200">
                              Approve
                            </div>
                          </Popconfirm>
                        </span>
                      )}

                      {rowData?.vendor?.status === "rejected" && (
                        <span>
                          <Popconfirm
                            title="Approve vendor"
                            description="Are you sure to activate this vendor?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() =>
                              activateVendor(rowData?.vendor?._id)
                            }
                          >
                            <div className="flex flex-row items-center justify-center text-sm ring-1 ring-green-400 rounded px-2 py-1 cursor-pointer bg-green-200">
                              Approve
                            </div>
                          </Popconfirm>
                        </span>
                      )}

                      {rowData?.vendor?.status === "approved" && (
                        <span>
                          <Popconfirm
                            title="Reject vendor"
                            description="Are you sure?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => declineUser(rowData?.vendor?._id)}
                          >
                            <div className="flex flex-row items-center justify-center text-sm ring-1 ring-red-400 rounded px-2 py-1 cursor-pointer bg-red-200">
                              Reject
                            </div>
                          </Popconfirm>
                        </span>
                      )}
                      {rowData?.vendor?.status === "banned" && (
                        <span>
                          <Popconfirm
                            title="Acivate vendor"
                            description="Are you sure?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() =>
                              activateVendor(rowData?.vendor?._id)
                            }
                          >
                            <div className="flex flex-row items-center justify-center text-sm ring-1 ring-green-400 rounded px-2 py-1 cursor-pointer bg-green-200">
                              Activate
                            </div>
                          </Popconfirm>
                        </span>
                      )}
                    </div>
                  )}
                  {updatingId === rowData?.vendor?._id && (
                    <Spin
                      size="small"
                      indicator={
                        <LoadingOutlined style={{ fontSize: 12 }} spin />
                      }
                    />
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center space-x-10">
                    <HomeFilled className="text-gray-400" />
                    <div className="text-sm flex flex-row items-center space-x-2">
                      <Typography.Text
                        editable={
                          editVendor && {
                            onChange: (e) => {
                              let r = { ...rowData };
                              r.companyName = e;
                              setRowData(r);
                            },
                            text: rowData?.vendor?.companyName,
                          }
                        }
                      >
                        {rowData?.vendor?.companyName}
                      </Typography.Text>{" "}
                      {/* {editVendor && (
                        <Typography.Text
                          editable={
                            editVendor && {
                              onChange: (e) => {
                                let r = { ...rowData };
                                r.title = e;
                                setRowData(r);
                              },
                              text: rowData?.vendor?.title,
                            }
                          }
                        >
                          {rowData?.vendor?.title}
                        </Typography.Text>
                      )} */}
                      {!editVendor && <Rate
                        tooltips={[
                          "Very bad",
                          "Bad",
                          "Good",
                          "Very good",
                          "Excellent",
                        ]}
                        count={5}
                        disabled
                        value={rowData?.avgRate}
                      />}
                    </div>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <UserOutlined className="text-gray-400" />
                    <div className="text-sm flex flex-row items-center space-x-2">
                      <Typography.Text
                        editable={
                          editVendor && {
                            onChange: (e) => {
                              let r = { ...rowData };
                              r.contactPersonNames = e;
                              setRowData(r);
                            },
                            text: rowData?.vendor?.contactPersonNames,
                          }
                        }
                      >
                        {rowData?.vendor?.contactPersonNames}
                      </Typography.Text>{" "}
                      {!editVendor && (
                        <div>
                          <Tag color="cyan">
                            Position: {rowData?.vendor?.title}
                          </Tag>
                        </div>
                      )}
                      {editVendor && (
                        <Typography.Text
                          editable={
                            editVendor && {
                              onChange: (e) => {
                                let r = { ...rowData };
                                r.title = e;
                                setRowData(r);
                              },
                              text: rowData?.vendor?.title,
                            }
                          }
                        >
                          {rowData?.vendor?.title}
                        </Typography.Text>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <MailOutlined className="text-gray-400" />
                    <Typography.Text
                      editable={
                        editVendor && {
                          onChange: (e) => {
                            let r = { ...rowData };
                            r.email = e;
                            setRowData(r);
                          },
                          text: rowData?.vendor?.email,
                        }
                      }
                      className="text-sm"
                    >
                      {rowData?.vendor?.email}{" "}
                    </Typography.Text>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <IdcardOutlined className="text-gray-400" />
                    <Typography.Text
                      editable={
                        editVendor && {
                          onChange: (e) => {
                            let r = { ...rowData };
                            r.tin = e;
                            setRowData(r);
                          },
                          text: rowData?.vendor?.tin,
                        }
                      }
                      className="text-sm "
                    >
                      TIN: {rowData?.vendor?.tin}{" "}
                    </Typography.Text>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <PhoneOutlined className="text-gray-400" />
                    <Typography.Text
                      editable={
                        editVendor && {
                          onChange: (e) => {
                            let r = { ...rowData };
                            r.telephone = e;
                            setRowData(r);
                          },
                          text: rowData?.vendor?.telephone,
                        }
                      }
                      className="text-sm "
                    >
                      {rowData?.vendor?.telephone}{" "}
                    </Typography.Text>
                  </div>
                  <div className="flex flex-row items-center space-x-10">
                    <GlobalOutlined className="text-gray-400" />
                    <div className="text-sm ">
                      <Typography.Link
                        editable={
                          editVendor && {
                            onChange: (e) => {
                              let r = { ...rowData };
                              r.website = e;
                              setRowData(r);
                            },
                            text: rowData?.vendor?.webSite,
                          }
                        }
                      >
                        {rowData?.vendor?.webSite}{" "}
                      </Typography.Link>
                    </div>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <GiftOutlined className="text-gray-400" />
                    {!editVendor && (
                      <div className="grid grid-cols-1 gap-2">
                        {rowData?.vendor?.services?.map((s) => {
                          return (
                            <div key={s}>
                              <Tag>{s}</Tag>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {editVendor && (
                      <Select
                        mode="multiple"
                        allowClear
                        defaultValue={rowData?.vendor?.services?.map((s) => {
                          return s;
                        })}
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        onChange={(value) => {
                          let r = { ...rowData };
                          r.services = value;
                          setRowData(r);
                        }}
                      >
                        {servCategories?.map((s) => {
                          return (
                            <Select.Option key={s._id} value={s.description}>
                              {s.description}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white ring-1 ring-gray-100 rounded shadow p-5">
                <div className="text-xl font-semibold mb-5 flex flex-row justify-between items-center">
                  <div>Address Information</div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center space-x-10">
                    <CompassOutlined className="text-gray-400" />
                    <div className="text-sm flex flex-row space-x-1">
                      <div>
                        <Typography.Text
                          editable={
                            editVendor && {
                              onChange: (e) => {
                                let r = { ...rowData };
                                r.hqAddress = e;
                                setRowData(r);
                              },
                              tooltip: "Edit Hq Address",
                              text: rowData?.vendor?.hqAddress,
                            }
                          }
                        >
                          {rowData?.vendor?.hqAddress} ,
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text
                          editable={
                            editVendor && {
                              onChange: (e) => {
                                let r = { ...rowData };
                                r.country = e;
                                setRowData(r);
                              },
                              text: rowData?.vendor?.country,
                              tooltip: "Edit Country",
                            }
                          }
                        >
                          {rowData?.vendor?.country}
                        </Typography.Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white ring-1 ring-gray-100 rounded shadow p-5">
                <div className="text-xl font-semibold mb-5 flex flex-row justify-between items-center">
                  <div>Attachements</div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center space-x-10">
                    <PaperClipOutlined className="text-gray-400" />
                    <div
                      className="text-sm "
                      onClick={() => {
                        if (rowData?.vendor?.rdbCertId) {
                          setAttachmentId(
                            `rdbCerts/${rowData?.vendor?.rdbCertId}.pdf`
                          );
                          setPreviewAttachment(!previewAttachment);
                        }
                      }}
                    >
                      {rowData?.vendor?.rdbCertId && (
                        <Typography.Link>
                          Incorporation Certificate{" "}
                        </Typography.Link>
                      )}
                      {!rowData?.vendor?.rdbCertId && (
                        <Typography.Text>
                          Incorporation Certificate{" "}
                        </Typography.Text>
                      )}
                    </div>
                    {!rowData?.vendor?.rdbCertId && (
                      <div>
                        <UploadOutlined className="text-blue-500 hover:cursor-pointer" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <PaperClipOutlined className="text-gray-400" />
                    <div
                      className="text-sm "
                      onClick={() => {
                        if (rowData?.vendor?.vatCertId) {
                          setAttachmentId(
                            `vatCerts/${rowData?.vendor?.vatCertId}.pdf`
                          );
                          setPreviewAttachment(!previewAttachment);
                        }
                      }}
                    >
                      {rowData?.vendor?.vatCertId && (
                        <Typography.Link>VAT Certificate </Typography.Link>
                      )}
                      {!rowData?.vendor?.vatCertId && (
                        <Typography.Text>VAT Certificate </Typography.Text>
                      )}
                    </div>
                    {!rowData?.vendor?.vatCertId && (
                      <div>
                        <UploadOutlined className="text-blue-500 hover:cursor-pointer" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reset password */}
              {user?.permissions?.canEditVendors && <div className="bg-white ring-1 ring-gray-100 rounded shadow p-5">
                <div className="text-xl font-semibold mb-5 flex flex-row justify-between items-center">
                  <div>Reset password</div>
                </div>
                <Form
                  // {...formItemLayout}
                  form={passwordForm}
                  name="resetPassword"
                  onFinish={updatePassword}
                  scrollToFirstError
                  style={{ width: "100%" }}
                >
                  <Form.Item>
                    {submitting ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <div className="flex flex-row items-center justify-between">
                        <Button type="primary" danger htmlType="submit">
                          Update vendor password
                        </Button>
                      </div>
                    )}
                  </Form.Item>
                </Form>
              </div>}
            </div>

            {/* Transactions */}
            <div className="col-span-2 flex flex-col space-y-5 bg-white ring-1 ring-gray-100 rounded shadow p-10">
              <Segmented
                block
                size="large"
                options={["Bids", "Purchase orders"]}
                onChange={setSegment}
              />
              {segment === "Bids" &&
                vendorsBids?.length > 0 &&
                vendorsBids.map((bid) => {
                  return (
                    <div key={bid?.number}>
                      <List size="small">
                        <List.Item>
                          <List.Item.Meta
                            //   avatar={<Avatar src={item.picture.large} />}
                            // title={<a href="#">{bid.number}</a>}
                            description={
                              <div className="grid md:grid-cols-5 rounded ring-1 ring-gray-100 p-2 gap-4 shadow">
                                <div>
                                  <div className="text-md font-semibold text-gray-800">
                                    {bid?.number}
                                  </div>

                                  <div className="text-xs text-gray-600">
                                    {bid?.createdBy?.companyName}
                                  </div>

                                  <a href="#">
                                    <FileTextOutlined />{" "}
                                  </a>
                                </div>

                                <div className="">
                                  <div className="text-xs text-gray-400">
                                    Title
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {bid?.tender?.purchaseRequest?.title}
                                  </div>
                                </div>

                                <div className="">
                                  <div className="text-xs text-gray-400">
                                    Total Price
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {bid?.price.toLocaleString() +
                                      " " +
                                      bid?.currency}
                                  </div>
                                </div>

                                <div className="">
                                  <div className="text-xs text-gray-400">
                                    Discount
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {bid?.discount}%
                                  </div>
                                </div>

                                <div className="">
                                  <div className="text-xs text-gray-400">
                                    Delivery date
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {moment(bid?.deliveryDate).fromNow()}
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      </List>
                    </div>
                  );
                })}

              {segment === "Bids" &&
                (!vendorsBids || vendorsBids?.length == 0) && <Empty />}
            </div>
          </div>
          {previewAttachmentModal()}
        </div>
      </div>
    );
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
        // bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div>
          <MyPdfViewer fileUrl={`${url}/file/${attachmentId}`} />
        </div>
      </Modal>
    );
  }
}
