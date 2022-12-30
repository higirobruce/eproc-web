import { PlusOutlined, SaveOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import ItemList from "../common/itemList";
import OverviewWindow from "../common/overviewWindow";
import TagInput from "../common/tagInput";
import UploadFiles from "../common/uploadFiles";
import UsersRequestsTable from "../userRequestsTable";

export default function UserRequests() {
  const [dataLoaded, setDataLoaded] = useState(false);
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

  useEffect(() => {
    loadRequests()
      .then((res) => res.json())
      .then((res) => {
        setDataLoaded(true);
        setDataset(res);
      });
  }, []);

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
    console.log("Received values of form:", values);
    setConfirmLoading(true);
    let user = JSON.parse(localStorage.getItem("user"));

    fetch(`${url}/requests/`, {
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
        
        
        loadRequests()
          .then((res) => res.json())
          .then((res) => {
            setDataLoaded(true);
            setDataset(res);
            setConfirmLoading(false);
            setOpen(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setConfirmLoading(false);
      });
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
      });
  }
  
  function declineRequest(id) {
    setUpdatingId(id);
    fetch(`${url}/requests/decline/${id}`, {
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
        elindex.status = "declined";

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
      });
  }
  return (
    <>
      {dataLoaded ? (
        <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000">
          <Row className="flex flex-row justify-between items-center">
            <Typography.Title level={3}>Purchase Requests</Typography.Title>
            <Row className="flex flex-row space-x-5 items-center">
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
              >
                New request
              </Button>

              <Button type="text" icon={<SettingOutlined />}></Button>
            </Row>
          </Row>
          <Row className="flex flex-row space-x-5">
            <Col flex={4}>
              <UsersRequestsTable
                dataSet={dataset}
                handleApproveRequest={approveRequest}
                handleDeclineRequest={declineRequest}
                updatingId={updatingId}
              />
            </Col>
            {/* <Col flex={1}>
              <OverviewWindow />
            </Col> */}
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
