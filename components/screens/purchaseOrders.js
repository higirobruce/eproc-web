import { PlaySquareOutlined, PrinterOutlined } from "@ant-design/icons";
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
  Tooltip,
} from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import * as _ from "lodash";
import moment from "moment-timezone";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";

export default function PurchaseOrders({ user }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [pOs, setPOs] = useState(null);
  let [po, setPO] = useState(null);
  let [totalValue, setTotalValue] = useState(0);
  let [openViewPO, setOpenViewPO] = useState(false);
  let [startingDelivery, setStartingDelivery] = useState(false);
  const items = [
    {
      key: "1",
      label: "Sign PO",
    },
    {
      key: "2",
      label: "View PO",
    },
  ];

  const onMenuClick = (e) => {
    setOpenViewPO(true);
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

  let [sections, setSections] = useState([
    { title: "Set section title", body: "" },
  ]);
  const [signatories, setSignatories] = useState([]);
  const [docDate, setDocDate] = useState(moment());
  const [docType, setDocType] = useState("dDocument_Service");
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (user?.userType === "VENDOR") {
      fetch(`${url}/purchaseOrders/byVendorId/${user?._id}`, {
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
          setPOs(res);
          setDataLoaded(true);
        })
        .catch((err) => {
          setDataLoaded(true);
        });
    } else {
      fetch(`${url}/purchaseOrders/`, {
        method: "GET",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setPOs(res);
          setDataLoaded(true);
        })
        .catch((err) => {
          setDataLoaded(true);
        });
    }
  }, []);

  function getPOs() {}

  function getMyPOs() {}

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
                <div
                  key={s?.email}
                  className="flex flex-col ring-1 ring-gray-300 rounded pt-5 space-y-3 justify-between"
                >
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

                  {user?.email === s?.email && !s?.signed && (
                    <Popconfirm
                      title="Confirm Contract Signature"
                      onConfirm={() => handleSignPo(s, index)}
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
                  {user?.email !== s?.email && !s.signed && (
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

  function handleSignPo(signatory, index) {
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

  function handleStartDelivery(po) {
    let _pos = [...pOs];
    // Find item index using _.findIndex (thanks @AJ Richardson for comment)
    var index = _.findIndex(_pos, { _id: po._id });
    let elindex = _pos[index];
    elindex.status = "starting";
    // Replace item at index using native splice
    _pos.splice(index, 1, elindex);

    setPOs(_pos);

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
          let _pos = [...pOs];
          // Find item index using _.findIndex (thanks @AJ Richardson for comment)
          var index = _.findIndex(_pos, { _id: po._id });
          let elindex = _pos[index];
          elindex.status = "pending";
          // Replace item at index using native splice
          _pos.splice(index, 1, elindex);

          setPOs(_pos);
        } else {
          let _pos = [...pOs];
          // Find item index using _.findIndex (thanks @AJ Richardson for comment)
          var index = _.findIndex(_pos, { _id: po._id });
          let elindex = _pos[index];
          elindex.status = "started";
          // Replace item at index using native splice
          _pos.splice(index, 1, elindex);

          setPOs(_pos);
        }
      });
  }

  function documentFullySigned(document) {
    let totSignatories = document?.signatories;
    let signatures = document?.signatories?.filter((s) => s.signed);

    return totSignatories?.length === signatures?.length;
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
      {dataLoaded ? (
        <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000 px-10 flex-1">
          {viewPOMOdal()}

          <Typography.Title className="mx-5" level={4}>
            Purchase Orders List
          </Typography.Title>

          {(pOs?.length < 1 || !pOs) && <Empty />}
          {pOs && pOs?.length >= 1 && (
            <div
              className="space-y-4 pb-5"
              style={{
                height: "800px",
                overflowX: "scroll",
                overflowY: "unset",
              }}
            >
              {pOs?.map((po) => {
                let t = 0;
                return (
                  <div
                    key={po?.number}
                    className="grid md:grid-cols-6 gap-3 ring-1 ring-gray-200 bg-white rounded px-5 py-3 shadow hover:shadow-md m-5"
                  >
                    <div className="flex flex-col space-y-1">
                      <div className="text-xs text-gray-600">
                        Purchase Order
                      </div>
                      <div className="font-semibold">{po?.number}</div>
                      <div className="text-gray-600">
                        {po?.tender?.purchaseRequest?.description}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="text-xs text-gray-600">Vendor</div>
                      <div className="font-semibold">
                        {po?.vendor?.companyName}
                      </div>
                      <div className=" text-gray-500">
                        TIN: {po?.vendor?.tin}
                      </div>
                      <div className=" text-gray-500">
                        email: {po?.vendor?.companyEmail}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <div className="text-xs text-gray-600">Total value</div>
                      <div className="font-semibold">
                        {po?.items?.map((i) => {
                          let lTot = i?.quantity * i?.estimatedUnitCost;
                          t = t + lTot;
                        })}{" "}
                        {t.toLocaleString()} RWF
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 text-gray-600">
                      {po?.signatories?.map((s) => {
                        return (
                          <div
                            key={s?.email}
                            className="flex flex-row items-center space-x-2"
                          >
                            <div>
                              {s?.signed ? (
                                <Tooltip
                                  placement="top"
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
                      <Dropdown.Button
                        disabled={
                          user?.userType === "VENDOR" &&
                          !documentFullySignedInternally(po)
                        }
                        menu={{ items, onClick: onMenuClick }}
                        onOpenChange={() => {
                          setPO(po);
                        }}
                      >
                        Actions
                      </Dropdown.Button>
                    </div>

                    <div className="flex flex-col space-y-1 justify-center">
                      {/* <div className="text-xs text-gray-400">Delivery</div> */}
                      {documentFullySigned(po) && (
                        <div>
                          <Tag color="green">Signed</Tag>
                        </div>
                      )}
                      {po?.status !== "started" && po?.status !== "stopped" && (
                        <Button
                          type="primary"
                          disabled={!documentFullySigned(po)}
                          size="small"
                          loading={po.status === "starting"}
                          icon={<PlaySquareOutlined />}
                          onClick={() => handleStartDelivery(po)}
                        >
                          Start delivering
                        </Button>
                      )}
                      <Progress
                        percent={_.round(po?.deliveryProgress, 1)}
                        size="small"
                        status="active"
                      />
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
