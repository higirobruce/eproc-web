import {
  ArrowLeftOutlined,
  BackwardOutlined,
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
  Space,
  Typography,
  message,
  Input,
  Select,
  Checkbox,
  Radio,
  Tabs,
  Tag,
} from "antd";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import ItemList from "../common/itemList";
import ItemsTable from "../common/itemsTable";
import RequestDetails from "../common/requestDetails";
import RequestStats from "../common/requestsStatistics";
import SelectStatuses from "../common/statusSelectTags";
import UsersRequestsTable from "../userRequestsTable";

export default function UserRequests() {
  const requestStatuses = [
    {
      key: "1",
      label: `Tab 1`,
    },
    {
      key: "2",
      label: `Tab 2`,
    },
    {
      key: "3",
      label: `Tab 3`,
    },
  ];
  const [serviceCategories, setServiceCategories] = useState([]);
  let [serviceCategory, setServiceCategory] = useState("");
  let [budgetLines, setBudgetLines] = useState([]);
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
  const [values, setValues] = useState([]);

  let [dueDate, setDueDate] = useState(null);
  let [description, setDescription] = useState("");
  let [rowData, setRowData] = useState(null);
  let [loadingRowData, setLoadingRowData] = useState(false);
  let [confirmRejectLoading, setConfirmRejectLoading] = useState(false);
  let [budgeted, setBudgeted] = useState(true);
  let [budgetLine, setBudgetLine] = useState("");
  let [reload, setReload] = useState(false);

  let [selectedReqId, setSelectedReqId] = useState(null);

  useEffect(() => {
    loadRequests()
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

    fetch(`${url}/serviceCategories`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setServiceCategories(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });

    fetch(`${url}/budgetLines`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setBudgetLines(res);
      });
  }, []);

  function refresh() {
    setDataLoaded(false);
    loadRequests()
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

  async function loadRequests() {
    return fetch(`${url}/requests/`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    });
  }
  useEffect(() => {
    setUpdatingId("");
    console.log(dataset);
  }, [dataset]);

  const save = () => {
    if (values && values[0]) {
      console.log("Received values of form:", values);
      setConfirmLoading(true);
      let user = JSON.parse(localStorage.getItem("user"));
      fetch(`${url}/requests/`, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dueDate,
          description,
          serviceCategory,
          items: values,
          createdBy: user?._id,
          budgeted,
          budgetLine: budgetLine,
          title,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          loadRequests()
            .then((res) => res.json())
            .then((res) => {
              setDataLoaded(true);
              setDataset(res);
              setConfirmLoading(false);
              setOpen(false);
            })
            .catch((err) => {
              setConfirmLoading(false);
              setOpen(false);
              console.log(err);
              messageApi.open({
                type: "error",
                content: "Something happened! Please try again.",
              });
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
    }
  };

  function approveRequest(id) {
    setUpdatingId(id);
    fetch(`${url}/requests/approve/${id}`, {
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
        elindex.status = "approved";

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

  function declineRequest(id, reason, declinedBy) {
    setUpdatingId(id);
    setConfirmRejectLoading(true);
    fetch(`${url}/requests/decline/${id}`, {
      method: "POST",
      body: JSON.stringify({
        reason,
        declinedBy,
      }),
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
        elindex.status = "declined";
        elindex.reasonForRejection = reason;
        elindex.declinedBy = declinedBy;

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
        setConfirmRejectLoading(false);
      })
      .catch((err) => {
        setConfirmRejectLoading(false);
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function updateStatus(id, status) {
    setLoadingRowData(true);
    setTimeout(() => {
      fetch(`${url}/requests/status/${id}`, {
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
          loadRequests()
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

  function handleSetRow(row) {
    console.log(row);
    setLoadingRowData(true);
    setRowData(row);
    setLoadingRowData(false);
  }

  function createTender(tenderData) {
    setLoadingRowData(true);
    fetch(`${url}/tenders`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tenderData),
    })
      .then((res) => res.json())
      .then((res) => {
        updateStatus(rowData._id, "completed");
      })
      .catch((err) => {
        console.log(err);
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function updateProgress(poId, progress) {
    fetch(`${url}/purchaseOrders/progress/${poId}`, {
      method: "PUT",
      body: JSON.stringify({
        deliveryProgress: progress,
      }),
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let r = rowData;
        setReload(!reload);
        refresh();
      });
  }

  function createPO(vendor, tender, createdBy, sections, items) {
    fetch(`${url}/purchaseOrders/`, {
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
        request: rowData?._id,
      }),
    })
      .then((res) => res.json())
      .then((res1) => {
        updateStatus(rowData._id, "po created");
        messageApi.open({
          type: "success",
          content: "PO created!",
        });
      })
      .catch((err) => {
        console.log(err);
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
        <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000 px-10 py-5 flex-1 space-y-3">
          <Row className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-start space-x-5">
              <div className="text-xl font-semibold">Purchase Requests</div>
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
              >
                New request
              </Button>

              <Button type="text" icon={<SettingOutlined />}></Button>
            </Row>
          </Row>
          {/* <RequestStats totalRequests={dataset?.length}/> */}
          <UsersRequestsTable
            handleSetRow={handleSetRow}
            dataSet={dataset}
            handleApproveRequest={approveRequest}
            handleDeclineRequest={declineRequest}
            updatingId={updatingId}
          />
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
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              className="mt-5"
              // layout="horizontal"

              onFinish={save}
            >
              <Form.Item label="Due date">
                <DatePicker onChange={(v, dstr) => setDueDate(dstr)} />
              </Form.Item>
              <Form.Item label="Request title">
                <Input
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="How would you name your request?"
                />
              </Form.Item>
              <Form.Item label="Request Description">
                <Input.TextArea
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe your request"
                  showCount
                  maxLength={100}
                />
              </Form.Item>
              <Form.Item
                label="Request Category"
                name="serviceCategory"
              >
                <Select
                  placeholder="Select service category"
                  showSearch
                  onChange={(value) => {
                    setServiceCategory(value);
                  }}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  filterOption={(inputValue, option) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                  // defaultValue="RWF"
                  options={serviceCategories.map((s) => {
                    return {
                      value: s.description,
                      label: s.description,
                    };
                  })}
                ></Select>
              </Form.Item>

              <Form.Item
                name="budgeted"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
              >
                <Radio.Group
                  onChange={(e) => {
                    setBudgeted(e.target.value);
                  }}
                  value={budgeted}
                >
                  <Radio value={true}>Budgeted</Radio>
                  <Radio value={false}>Not Budgeted</Radio>
                </Radio.Group>
              </Form.Item>

              {budgeted && (
                // <Form.Item label="Budget Line" name="budgetLine">
                //   <Input
                //     onChange={(e) => {
                //       setBudgetLine(e.target.value);
                //     }}
                //     placeholder=""
                //   />
                // </Form.Item>

                <Form.Item
                label="Budget Line" name="budgetLine"
                >
                  <Select
                    placeholder="Select service category"
                    showSearch
                    onChange={(value) => {
                      setBudgetLine(value)
                    }}
                   
                    options={budgetLines.map((s) => {
                      return {
                        label:s.title.toUpperCase(),
                        options: s.subLines.map(sub=>{
                          return {
                            label: sub,
                            value:sub
                          }
                        })
                      }
                    })}
                  ></Select>
                </Form.Item>
              )}
            </Form>

            <div>
              <Typography.Title level={4}>Items</Typography.Title>
              {/* <ItemList handleSetValues={setValues} /> */}
              <ItemsTable setDataSource={setValues} dataSource={values} />
            </div>
          </Modal>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen flex-1">
          <Image alt="" src="/file_searching.svg" width={600} height={600} />
        </div>
      )}
    </>
  ) : (
    buildRequest(
      rowData,
      setRowData,
      updateStatus,
      loadingRowData,
      rowData,
      createTender,
      declineRequest,
      setConfirmRejectLoading,
      confirmRejectLoading,
      updateProgress,
      reload,
      createPO
    )
  );
}
function buildRequest(
  selectedReqId,
  setSelectedReqId,
  updateStatus,
  loadingRowData,
  rowData,
  createTender,
  declineRequest,
  setConfirmRejectLoading,
  confirmRejectLoading,
  updateProgress,
  reload,
  createPO
) {
  return (
    <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000 px-36 py-5 flex-1 space-y-3">
      <div className="flex flex-row items-center space-x-5">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => setSelectedReqId(null)}
        >
          Back
        </Button>

        <div className="text-xl font-semibold">{selectedReqId?.title} </div>
      </div>
      <RequestDetails
        handleUpdateStatus={updateStatus}
        loading={loadingRowData}
        data={rowData}
        handleCreateTender={createTender}
        handleReject={declineRequest}
        setConfirmRejectLoading={setConfirmRejectLoading}
        confirmRejectLoading={confirmRejectLoading}
        handleUpdateProgress={updateProgress}
        reload={reload}
        handleCreatePO={createPO}
      />
    </div>
  );
}
