import { PlusOutlined, SaveOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Typography,
  message,
} from "antd";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import ItemList from "../common/itemList";
import TenderDetails from "../common/tenderDetails";
import TendersTable from "../tendersTable";

export default function Tenders() {
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
    console.log(dataset);
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


  function handleSetRow(row) {
    console.log(row);
    setLoadingRowData(true);
    setRowData(row);
    setLoadingRowData(false);
  }
  return (
    <>
      {contextHolder}
      {dataLoaded ? (
        <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000">
          <Row className="flex flex-row justify-between items-center">
            <Typography.Title level={3}>Tenders</Typography.Title>
            {/* <Row className="flex flex-row space-x-5 items-center">
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
              >
                New request
              </Button>

              <Button type="text" icon={<SettingOutlined />}></Button>
            </Row> */}
          </Row>
          <Row className="flex flex-row space-x-5">
            <Col flex={5}>
              <TendersTable
                handleSetRow={handleSetRow}
                dataSet={dataset}
               
                updatingId={updatingId}
              />
            </Col>
            <Col flex={2}>
              <TenderDetails
                handleUpdateStatus={updateStatus}
                loading={loadingRowData}
                data={rowData}
                // handleCreateTender={createTender}
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
        <div className="flex items-center justify-center h-screen">
          <Image alt="" src="/file_searching.svg" width={600} height={600} />
        </div>
      )}
    </>
  );
}
