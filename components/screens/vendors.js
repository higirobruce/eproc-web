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
} from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import VendorsTable from "../vendorsTable";
import _ from "lodash";
import SelectStatuses from "../common/statusSelectTags";
import {
  ArrowLeftOutlined,
  BankOutlined,
  CompassOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  GiftOutlined,
  GlobalOutlined,
  IdcardOutlined,
  MailOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { UserIcon } from "@heroicons/react/24/outline";
import MyPdfViewer from "../common/pdfViewer";
export default function Vendors({ user }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [dataset, setDataset] = useState([]);
  let [updatingId, setUpdatingId] = useState("");
  let [rowData, setRowData] = useState(null);
  let [segment, setSegment] = useState("Bids");
  let [vendorsBids, setVendorsBids] = useState([]);
  const [previewAttachment, setPreviewAttachment] = useState(false);
  const [attachmentId, setAttachmentId] = useState(null);
  const [editVendor, setEditVendor] = useState(false);
  let [servCategories, setServCategories] = useState([]);

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
    if (rowData) {
      fetch(`${url}/submissions/byVendor/${rowData?._id}`, {
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
        let _data = [...dataset];

        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(_data, { _id: id });
        let elindex = _data[index];
        elindex.status = res?.status;

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
        if (res.error) {
          messageApi.open({
            type: "error",
            content: res.message,
          });
        } else {
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
      })
      .catch((err) => {
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
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function updateVendor() {
    fetch(`${url}/users/${rowData?._id}`, {
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

  return !rowData ? (
    <>
      {contextHolder}
      {dataLoaded ? (
        <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000 flex-1 py-5 space-y-5">
          <Row className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-start space-x-5 w-1/4">
              <div className="text-xl font-semibold">Vendors List</div>
              <div className="flex-1">
                <SelectStatuses />
              </div>
            </div>
            <Row className="flex flex-row space-x-5 items-center">
              <div>
                <Input.Search placeholder="Search requests" />
              </div>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={() => refresh()}
              ></Button>
              <Button type="text" icon={<SettingOutlined />}></Button>
            </Row>
          </Row>
          <Row className="flex flex-row space-x-5">
            <Col flex={4}>
              <VendorsTable
                dataSet={dataset}
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
        // <div className="flex items-center justify-center h-screen transition-opacity ease-in-out duration-300 flex-1">
        //   <Image alt="" src="/people_search.svg" width={600} height={600} />
        // </div>
        <></>
      )}
    </>
  ) : (
    buildVendor()
  );

  function buildVendor() {
    return (
      <div className="flex flex-col  transition-opacity ease-in-out duration-1000 px-10 py-5 flex-1 space-y-3 h-full">
        <div className="flex flex-col space-y-5">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center space-x-2">
              <div>
                <Button
                  icon={<ArrowLeftOutlined />}
                  type='primary'
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
                </div>
                <div className="flex flex-col space-y-2">
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
                            text: rowData?.contactPersonNames,
                          }
                        }
                      >
                        {rowData?.contactPersonNames}
                      </Typography.Text>{" "}
                      {!editVendor && (
                        <div>
                          <Tag color="cyan">{rowData?.title}</Tag>
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
                              text: rowData?.title,
                            }
                          }
                        >
                          {rowData?.title}
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
                          text: rowData?.email,
                        }
                      }
                      className="text-sm"
                    >
                      {rowData?.email}{" "}
                    </Typography.Text>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <BankOutlined className="text-gray-400" />
                    <Typography.Text
                      editable={
                        editVendor && {
                          onChange: (e) => {
                            let r = { ...rowData };
                            r.tin = e;
                            setRowData(r);
                          },
                          text: rowData?.tin,
                        }
                      }
                      className="text-sm "
                    >
                      {rowData?.tin}{" "}
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
                          text: rowData?.telephone,
                        }
                      }
                      className="text-sm "
                    >
                      {rowData?.telephone}{" "}
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
                            text: rowData?.webSite,
                          }
                        }
                      >
                        {rowData?.webSite}{" "}
                      </Typography.Link>
                    </div>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <IdcardOutlined className="text-gray-400" />
                    <Typography.Text
                      editable={
                        editVendor && {
                          onChange: (e) => {
                            let r = { ...rowData };
                            r.passportNid = e;
                            setRowData(r);
                          },
                          text: rowData?.passportNid,
                        }
                      }
                      className="text-sm "
                    >
                      {rowData?.passportNid}
                    </Typography.Text>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <GiftOutlined className="text-gray-400" />
                    {!editVendor && (
                      <div className="grid grid-cols-1 gap-2">
                        {rowData?.services?.map((s) => {
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
                        defaultValue={rowData?.services?.map((s) => {
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
                              text: rowData?.hqAddress,
                            }
                          }
                        >
                          {rowData?.hqAddress}{" "}
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
                              text: rowData?.country,
                              tooltip: "Edit Country",
                            }
                          }
                        >
                          {rowData?.country}
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
                        if (rowData?.rdbCertId) {
                          setAttachmentId(`rdbCerts/${rowData?.rdbCertId}.pdf`);
                          setPreviewAttachment(!previewAttachment);
                        }
                      }}
                    >
                      <Typography.Link>Full RDB registration {!rowData?.rdbCertId && '-not available'}</Typography.Link>
                    </div>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <PaperClipOutlined className="text-gray-400" />
                    <div
                      className="text-sm "
                      onClick={() => {
                        if (rowData?.vatCertId) {
                          setAttachmentId(`vatCerts/${rowData?.vatCertId}.pdf`);
                          setPreviewAttachment(!previewAttachment);
                        }
                      }}
                    >
                      <Typography.Link>VAT certificate {!rowData?.vatCertId && '-not available'}</Typography.Link>
                    </div>
                  </div>
                </div>
              </div>
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
        width={"60%"}
        // bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <div>
          <MyPdfViewer fileUrl={`${url}/file/${attachmentId}`} />
        </div>
      </Modal>
    );
  }
}
