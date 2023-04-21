import {
  ArrowLeftOutlined,
  LoadingOutlined,
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
  Empty,
  Select,
  Spin,
} from "antd";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import BidList from "../common/bidList";
import ItemList from "../common/itemList";
import TenderDetails from "../common/tenderDetails";
import TenderStats from "../common/tendersStatistics";
import TendersTable from "../tendersTable";

export default function Tenders({ user }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [dataset, setDataset] = useState([]);
  let [tempDataset, setTempDataset] = useState([]);
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

  let [searchStatus, setSearchStatus] = useState("all");
  let [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadTenders()
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
  }, [user]);

  function refresh() {
    setDataLoaded(false);
    setLoadingRowData(true);
    loadTenders()
      .then((res) => res.json())
      .then((res) => {
        setDataLoaded(true);
        setLoadingRowData(false);
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

  async function loadTenders() {
    if (user?.userType === "VENDOR")
      return fetch(`${url}/tenders/byServiceCategories/`, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceCategories: user?.services,
        }),
      });
    else
      return fetch(`${url}/tenders/`, {
        method: "GET",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
      });
  }

  useEffect(() => {
    setUpdatingId("");
    loadStats();
  }, [dataset]);

  useEffect(() => {
    if (searchText === "") {
      refresh();
    } else {
      let _dataSet = [...dataset];
      let filtered = _dataSet.filter((d) => {
        return (
          d?.number?.toString().indexOf(searchText) > -1 ||
          d?.purchaseRequest?.number?.toString().indexOf(searchText) > -1
        );
      });
      setTempDataset(filtered);
      // else setTempDataset(dataset)
    }
  }, [searchText]);

  useEffect(() => {
    if (searchStatus === "all") {
      refresh();
    } else {
      setDataLoaded(false);
      fetch(`${url}/tenders/byStatus/${searchStatus}`, {
        method: "GET",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setDataLoaded(true);
          if (user?.userType !== "VENDOR") {
            setDataset(res);
            setTempDataset(res);
          } else {
            setDataset(
              res?.filter(
                (r) =>
                  user?.services?.indexOf(r?.purchaseRequest?.serviceCategory) >
                  -1
              )
            );
            setTempDataset(
              res?.filter(
                (r) =>
                  user?.services?.indexOf(r?.purchaseRequest?.serviceCategory) >
                  -1
              )
            );
          }
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "Something happened! Please try again.",
          });
        });
    }
  }, [searchStatus]);

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
            setTempDataset(res);
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
    fetch(`${url}/tenders/status/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
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
            setTempDataset(res);
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
            setTempDataset(res3);
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

  function createPO(
    vendor,
    tender,
    createdBy,
    sections,
    items,
    B1Data,
    signatories
  ) {
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
        B1Data,
        signatories,
      }),
    })
      .then((res) => res.json())
      .then((res1) => {
        if (res1.error) {
          messageApi.open({
            type: "error",
            content: res1?.error?.message?.value
              ? res1?.error?.message?.value
              : res1?.message,
          });
        } else {
          loadTenders()
            .then((res2) => res2.json())
            .then((res3) => {
              setDataset(res3);
              setTempDataset(res3);
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

  function sendInvitation(tenderUpdate) {
    setLoadingRowData(true);
    fetch(`${url}/tenders/${tenderUpdate?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sendInvitation: true,
        newTender: tenderUpdate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadTenders()
          .then((res) => res.json())
          .then((res) => {
            setDataset(res);
            setTempDataset(res);
            let r = res.filter((d) => {
              return d._id === id;
            });
            console.log(r);
            setRowData(r[0]);
            setLoadingRowData(false);
          })
          .catch((err) => {
            setLoadingRowData(false);
            // messageApi.open({
            //   type: "error",
            //   content: "Something happened! Please try again.",
            // });
          });
      })
      .catch((err) => {
        setLoadingRowData(false);
        // messageApi.open({
        //   type: "error",
        //   content: "Something happened! Please try again.",
        // });
      });
  }

  function sendEvalApproval(tenderUpdate, invitees) {
    setLoadingRowData(true);
    tenderUpdate.invitees = invitees;

    fetch(`${url}/tenders/${tenderUpdate?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newTender: tenderUpdate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadTenders()
          .then((res) => res.json())
          .then((res) => {
            setDataset(res);
            setTempDataset(res);
            let r = res.filter((d) => {
              return d._id === tenderUpdate?._id;
            });
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
  }

  return !rowData ? (
    <>
      {contextHolder}
      {dataLoaded ? (
        <div className="flex flex-col transition-opacity ease-in-out duration-1000 flex-1 space-y-10 h-full">
          <Row className="flex flex-col space-y-2 bg-white px-10 py-3 shadow">
            <div className="flex flex-row justify-between items-center">
              <div className="text-xl font-semibold">Tenders</div>
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
                    { value: "open", label: "Open" },
                    {
                      value: "closed",
                      label: "Closed",
                    },
                  ]}
                />
              </div>
              <div className="">
                <Input.Search
                  style={{ width: "300px" }}
                  autoFocus
                  onChange={(e) => {
                    setSearchText(e?.target?.value);
                  }}
                  placeholder="Search by tender#, request#"
                />
              </div>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={() => refresh()}
              ></Button>
            </Row>
          </Row>

          <Row className="flex flex-row space-x-5 mx-10">
            <Col flex={5}>
              <TendersTable
                handleSetRow={handleSetRow}
                dataSet={tempDataset}
                updatingId={updatingId}
                user={user}
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
                <DatePicker
                  onChange={(v, dstr) => setDueDate(dstr)}
                  disabledDate={(current) =>
                    current.isBefore(moment().subtract(1, "d"))
                  }
                />
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
          <div class="absolute -bottom-32 right-10 opacity-10">
            <Image src="/icons/blue icon.png" width={110} height={100} />
          </div>
        </div>
      ) : dataLoaded && dataset?.length === 0 ? (
        <Empty />
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
    buildTender(
      updateStatus,
      loadingRowData,
      rowData,
      createSubmission,
      setRowData,
      refresh,
      createPO,
      sendInvitation,
      user,
      sendEvalApproval,
      contextHolder
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
  user,
  sendEvalApproval,
  contextHolder
) {
  return (
    <div className="flex flex-col transition-opacity ease-in-out duration-1000 px-10 py-5 flex-1 space-y-3">
      {contextHolder}
      <div className="flex flex-row items-center space-x-5">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => setRowData(null)}
        >
          Back
        </Button>

        <div className="text-xl font-semibold">
          Tender - {rowData?.purchaseRequest?.title}{" "}
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
        handleSendEvalApproval={sendEvalApproval}
        user={user}
      />
    </div>
  );
}
