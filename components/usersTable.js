import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const UsersTable = ({
  dataSet,
  handleApproveUser,
  handleDeclineUser,
  updatingId,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataSet);
  const antIcon = <LoadingOutlined style={{ fontSize: 9 }} spin />;

  const cancel = () => {
    setEditingKey("");
  };

  useEffect(() => {
    setData(dataSet);
  }, [dataSet]);

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "telephone",
    },
    {
      title: "Status",
      key: "action",
      render: (_, record) => (
        <>
          {record.status === "created" && (
            <Badge color="yellow" text={record.status} />
          )}

          {record.status === "approved" && (
            <Badge color="green" text={record.status} />
          )}

          {record.status === "declined" && (
            <Badge color="red" text={record.status} />
          )}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {updatingId !== record._id && (
            <>
              {record.status !== "approved" && (
                <CheckOutlined
                  className="text-green-400 cursor-pointer"
                  onClick={() => approve(record._id)}
                />
              )}
              {record.status !== "declined" && (
                <CloseOutlined
                  className="text-red-400 cursor-pointer"
                  onClick={() => decline(record._id)}
                />
              )}
            </>
          )}

          {updatingId === record._id && (
            <Spin size="small" indicator={antIcon} />
          )}
        </Space>
      ),
    },
  ];

  async function approve(id) {
    handleApproveUser(id);
  }

  async function decline(id) {
    handleDeclineUser(id);
  }

  return (
    <Form form={form} component={false}>
      <Table
        size="small"
        bordered
        dataSource={data}
        columns={columns}
        rowClassName="editable-row"
        // pagination={{
        //   onChange: cancel,
        // }}
      />
    </Form>
  );
};
export default UsersTable;
