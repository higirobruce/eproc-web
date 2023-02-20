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
} from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import * as _ from "lodash";

export default function PurchaseOrders() {
  const [dataLoaded, setDataLoaded] = useState(false);
  let user = JSON.parse(localStorage.getItem("user"));
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
    if (e.key === "2") {
      setOpenViewPO(true);
    }
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
    let t = 0;
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
              dataSource={po?.tender?.items}
              columns={columns}
              pagination={false}
            />
            <Typography.Title level={5} className="self-end ">
              Total:{" "}
              {po?.tender?.items?.map((i) => {
                t = t + i?.quantity * i?.estimatedUnitCost;
              })}{" "}
              {t.toLocaleString()} RWF
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
  return (
    <>
      {dataLoaded ? (
        <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000 px-10 flex-1">
          {viewPOMOdal()}

          <Typography.Title className="mx-5" level={4}>Purchase Orders List</Typography.Title>

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
                  <div key={po?.number} className="grid grid-cols-6 ring-1 ring-gray-200 bg-white rounded px-5 py-3 shadow hover:shadow-md m-5">
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-400">
                        Purchase Order
                      </div>
                      <div className="font-semibold">{po?.number}</div>
                      <div className="font-semibold text-gray-500">
                        {po?.tender?.purchaseRequest?.description}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-400">Vendor</div>
                      <div className="font-semibold">
                        {po?.vendor?.companyName}
                      </div>
                      <div className="font-semibold text-xs text-gray-400">
                        TIN: {po?.vendor?.tin}
                      </div>
                      <div className="font-semibold text-xs text-gray-400">
                        email: {po?.vendor?.companyEmail}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xs text-gray-400">Total value</div>
                      <div className="font-semibold">
                        {po?.items?.map((i) => {
                          let lTot = i?.quantity * i?.estimatedUnitCost;
                          t = t + lTot;
                        })}{" "}
                        {t.toLocaleString()} RWF
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-400">Status</div>
                      <div className="font-semibold">
                        <Image
                          width={25}
                          height={25}
                          src="/icons/icons8-approval-60.png"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <Dropdown.Button
                        menu={{ items, onClick: onMenuClick }}
                        onOpenChange={() => {
                          setPO(po);
                        }}
                      >
                        Actions
                      </Dropdown.Button>
                    </div>

                    <div className="flex flex-col justify-center">
                      {/* <div className="text-xs text-gray-400">Delivery</div> */}
                      {po?.status !== "started" && po?.status !== "stopped" && (
                        <Button
                          type="primary"
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
