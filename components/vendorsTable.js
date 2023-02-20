import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Popover,
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
  SafetyCertificateOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";

const VendorsTable = ({
  dataSet,
  handleApproveUser,
  handleDeclineUser,
  updatingId,
  handleBanUser,
  handleSetRow,
  handleActivateUser,

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
      title: "#",
      // dataIndex: "number",
      render: (_, record) => (
        <>
          <div
            className="font-semibold cursor-pointer space-x-1 flex flex-row items-center text-blue-500 hover:underline"
            onClick={() => handleSetRow(record)}
          >
            <div>
              <UserOutlined className="text-xs" />
            </div>
            <div>{record?.number}</div>
          </div>
        </>
      ),
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
    },
    {
      title: "TIN",
      dataIndex: "tin",
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
      title: "Experience (Yrs)",
      dataIndex: "experienceDurationInYears",
    },
    {
      title: "Website",
      dataIndex: "webSite",
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

          {record.status === "banned" && (
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
              {record.status === "created" && (
                <Popover content="Approve">
                  <Popconfirm
                    title="Approve vendor"
                    description="Are you sure to approve this vendor?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => approve(record._id)}
                  >
                    <CheckOutlined className="text-green-400 cursor-pointer" />
                  </Popconfirm>
                </Popover>
              )}
              {record.status === "declined" && (
                <Popover content="Activate">
                  <Popconfirm
                    title="Activate vendor"
                    description="Are you sure to activate this vendor?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => activate(record._id)}
                  >
                    <SafetyCertificateOutlined className="text-green-400 cursor-pointer" />
                  </Popconfirm>
                </Popover>
              )}
              {record.status === "approved" && (
                <Popover content="Ban">
                  <Popconfirm
                    title="Ban vendor"
                    description="Are you sure to ban this vendor?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => ban(record._id)}
                  >
                    <StopOutlined className="text-red-400 cursor-pointer" />
                  </Popconfirm>
                </Popover>
              )}
              {record.status === "banned" && (
                <Popover content="Activate">
                  <Popconfirm
                    title="Acivate vendor"
                    description="Are you sure to activate this vendor?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => activate(record._id)}
                  >
                    <SafetyCertificateOutlined className="text-green-400 cursor-pointer" />
                  </Popconfirm>
                </Popover>
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

  async function ban(id) {
    handleBanUser(id);
  }

  async function activate(id) {
    handleActivateUser(id);
  }

  return (
    <Form form={form} component={false}>
      <Table
        size="small"
        dataSource={data}
        columns={columns}
        className="shadow-lg rounded-md"
        pagination={{
          pageSize:20
        }}
      />
    </Form>
  );
};
export default VendorsTable;
