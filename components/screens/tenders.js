import {
  ArrowLeftOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Typography,
  message,
  Input,
} from "antd";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import BidList from "../common/bidList";
import ItemList from "../common/itemList";
import TenderDetails from "../common/tenderDetails";
import TenderStats from "../common/tendersStatistics";
import TendersTable from "../tendersTable";

export default function Tenders({user}) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [dataset, setDataset] = useState([]);
  let [updatingId, setUpdatingId] = useState("");
  const [open, setOpen] = useState(false);
  let [title, setTitle] = useState("");
  let [confirmLoading, setConfirmLoading] = useState(false);
  let [values, setValues] = useState([]);
  let [dueDate, setDueDate] = useState(null);
  let [rowData, setRowData] = useState(null);
  let [loadingRowData, setLoadingRowData] = useState(false);
  let [totalTenders, setTotalTenders] = useState(0);
  let [totalBids, setTotalBids] = useState(0);
  let [doneCreatingContract, setDoneCreatingContract] = useState(false);

  useEffect(() => {
    loadTenders()
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
  }, []);

  function refresh() {
    setDataLoaded(false);
    setLoadingRowData(true);
    loadTenders()
      .then((res) => res.json())
      .then((res) => {
        setDataLoaded(true);
        setLoadingRowData(false);
        setDataset(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }
  async function loadTenders() {
    return fetch(`${url}/tenders/`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    });
  }

  useEffect(() => {
    setUpdatingId("");
    loadStats();
  }, [dataset]);

  const save = () => {
    console.log("Received values of form:", values);
    setConfirmLoading(true);
    let user = JSON.parse(localStorage.getItem("user"));

    fetch(`${url}/tenders/`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dueDate,
        items: values.items,
        createdBy: user?._id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadTenders()
          .then((res) => res.json())
          .then((res) => {
            setDataLoaded(true);
            setDataset(res);
            setConfirmLoading(false);
            setOpen(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        setConfirmLoading(false);
        setOpen(false);
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  };

  function updateStatus(id, status) {
    setLoadingRowData(true);
    setTimeout(() => {
      fetch(`${url}/tenders/status/${id}`, {
        method: "PUT",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          loadTenders()
            .then((res) => res.json())
            .then((res) => {
              setDataset(res);
              let r = res.filter((d) => {
                return d._id === id;
              });
              console.log(r);
              setRowData(r[0]);
              setLoadingRowData(false);
            })
            .catch((err) => {
              setLoadingRowData(false);
              messageApi.open({
                type: "error",
                content: "Something happened! Please try again.",
              });
            });
        })
        .catch((err) => {
          setLoadingRowData(false);
          messageApi.open({
            type: "error",
            content: "Something happened! Please try again.",
          });
        });
    }, 2000);
  }

  function loadStats() {
    fetch(`${url}/tenders/stats`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setTotalTenders(res?.total);
        // setOpen(res?.open)
        // setClosed(res?.closed)
      });

    fetch(`${url}/submissions`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setTotalBids(res?.length);
        // setOpen(res?.open)
        // setClosed(res?.closed)
      });
  }

  function handleSetRow(row) {
    console.log(row);
    setLoadingRowData(true);
    setRowData(row);
    setLoadingRowData(false);
  }

  function createSubmission(data) {
    console.log(data);
    setLoadingRowData(true);
    fetch(`${url}/submissions/`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res1) => {
        loadTenders()
          .then((res2) => res2.json())
          .then((res3) => {
            setDataset(res3);
            let r = res3.filter((d) => {
              return d._id === rowData._id;
            });
            console.log("hereeeeeee", r);
            setRowData(r[0]);
            setLoadingRowData(false);
          })
          .catch((err) => {
            console.error(err);
            setLoadingRowData(false);
            messageApi.open({
              type: "error",
              content: JSON.stringify(err),
            });
          });
      })
      .catch((err) => {
        console.error(err);
        setLoadingRowData(false);
        messageApi.open({
          type: "error",
          content: JSON.stringify(err),
        });
      });
  }

  function createPO(vendor, tender, createdBy, sections,items, B1Data) {
    return fetch(`${url}/purchaseOrders/`, {
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
        items,
        B1Data
      }),
    })
      .then((res) => res.json())
      .then((res1) => {
        if(res1.error){
          messageApi.open({
            type: "error",
            content: res1.message
          });
        }else{
          loadTenders()
          .then((res2) => res2.json())
          .then((res3) => {
            setDataset(res3);
            let r = res3.filter((d) => {
              return d._id === rowData._id;
            });
          
            setRowData(r[0]);
            setLoadingRowData(false);
          })
          .catch((err) => {
            console.error(err);
            setLoadingRowData(false);
            messageApi.open({
              type: "error",
              content: JSON.stringify(err),
            });
          });
        }
        
        
      })
      .catch((err) => {
        console.error(err);
        setLoadingRowData(false);
        messageApi.open({
          type: "error",
          content: JSON.stringify(err),
        });
      });
  }

  function sendInvitation(tenderUpdate){
    setLoadingRowData(true);
    setTimeout(() => {
      fetch(`${url}/tenders/${tenderUpdate?._id}`, {
        method: "PUT",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newTender: tenderUpdate
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          loadTenders()
            .then((res) => res.json())
            .then((res) => {
              setDataset(res);
              let r = res.filter((d) => {
                return d._id === id;
              });
              console.log(r);
              setRowData(r[0]);
              setLoadingRowData(false);
            })
            .catch((err) => {
              setLoadingRowData(false);
              messageApi.open({
                type: "error",
                content: "Something happened! Please try again.",
              });
            });
        })
        .catch((err) => {
          setLoadingRowData(false);
          messageApi.open({
            type: "error",
            content: "Something happened! Please try again.",
          });
        });
    }, 2000);
  }

  
  return !rowData ? (
    <>
      {contextHolder}
      {dataLoaded ? (
        <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000 px-10 flex-1 h-full">
          <Row className="flex flex-row justify-between items-center">
            <Typography.Title level={4}>Tenders</Typography.Title>
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

          <Row className="flex flex-row space-x-5 mt-5 pb-10">
            <Col flex={5}>
              <TendersTable
                handleSetRow={handleSetRow}
                dataSet={dataset}
                updatingId={updatingId}
              />
            </Col>
          </Row>

          <Modal
            title="Create a User Purchase request"
            centered
            open={open}
            onOk={() => save()}
            onCancel={() => setOpen(false)}
            okText="Save"
            okButtonProps={{ size: "small" }}
            cancelButtonProps={{ size: "small" }}
            width={1000}
            confirmLoading={confirmLoading}
          >
            <Form
              // labelCol={{ span: 3 }}
              className="mt-5"
              // wrapperCol={{ span: 14 }}
              // layout="horizontal"
              size="small"
              onFinish={save}
            >
              <Form.Item label="Due date">
                <DatePicker onChange={(v, dstr) => setDueDate(dstr)} />
              </Form.Item>
              <Row className="flex flex-row justify-between">
                <Col>
                  <Typography.Title level={4}>Items</Typography.Title>
                  <ItemList handleSetValues={setValues} />
                </Col>

                <Col>
                  <Typography.Title level={4}>
                    Evalutaion Criterion
                  </Typography.Title>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen flex-1">
          <Image alt="" src="/file_searching.svg" width={600} height={600} />
        </div>
      )}
    </>
  ) : (
    buildTender(
      updateStatus,
      loadingRowData,
      rowData,
      createSubmission,
      setRowData,
      refresh,
      createPO,
      sendInvitation,
      user
    )
  );
}
function buildTender(
  updateStatus,
  loadingRowData,
  rowData,
  createSubmission,
  setRowData,
  refresh,
  createPO,
  sendInvitation,
  user
) {
  return (
    <div className="flex flex-col transition-opacity ease-in-out duration-1000 px-36 py-5 flex-1 space-y-3">
      <div className="flex flex-row items-center space-x-5">
        <Button icon={<ArrowLeftOutlined />} onClick={() => setRowData(null)}>
          Back
        </Button>

        <div className="text-xl font-semibold">
          {rowData?.purchaseRequest?.title}{" "}
        </div>
      </div>
      <TenderDetails
        handleUpdateStatus={updateStatus}
        loading={loadingRowData}
        data={rowData}
        handleCreateSubmission={createSubmission}
        handleClose={() => setRowData(null)}
        handleRefreshData={refresh}
        handleCreatePO={createPO}
        handleSendInvitation={sendInvitation}
        user={user}
      />
    </div>
  );
}
