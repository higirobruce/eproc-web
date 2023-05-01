import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Popover,
  Rate,
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
import { random } from "lodash";

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
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

  const cancel = () => {
    setEditingKey("");
  };

  useEffect(() => {
    setData(dataSet);
  }, [dataSet]);

  async function getVendorRate(id) {
    return fetch(`${url}/users/vendors/rate/${id}`, {
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        return 2;
      });
  }

  const columns = [
    {
      title: "Company Name",
      // dataIndex: "vendor.number",
      sorter: (a, b) => a.vendor?.companyName.localeCompare(b.vendor?.companyName),
      render: (_, record) => (
        <>
          <div
            className="cursor-pointer space-x-1 flex flex-row items-center text-blue-500 hover:underline"
            onClick={() => handleSetRow(record)}
          >
            {/* <div>
              <UserOutlined className="text-xs" />
            </div> */}
            <div>{record?.vendor?.companyName}</div>
          </div>
        </>
      ),
    },
    {
      title: "TIN",
      // dataIndex: "tin",
      sorter: (a, b) => a.vendor?.tin > b.vendor?.tin,
      render: (_, record) => (
        <>
          <div className="cursor-pointer space-x-1 flex flex-row items-center">
            {/* <div>
              <UserOutlined className="text-xs" />
            </div> */}
            <div>{record?.vendor?.tin}</div>
          </div>
        </>
      ),
    },
    {
      title: "Contact person email",
      dataIndex: "email",
      sorter: (a, b) => a.vendor?.email > b.vendor?.email,
      render: (_, record) => (
        <>
          <div className="cursor-pointer space-x-1 flex flex-row items-center">
            {/* <div>
              <UserOutlined className="text-xs" />
            </div> */}
            <div>{record?.vendor?.email}</div>
          </div>
        </>
      ),
    },
    {
      title: "Phone",
      dataIndex: "telephone",
      sorter: (a, b) => a.vendor?.telephone > b.vendor?.telephone,
      render: (_, record) => (
        <>
          <div className="cursor-pointer space-x-1 flex flex-row items-center">
            {/* <div>
              <UserOutlined className="text-xs" />
            </div> */}
            <div>{record?.vendor?.telephone}</div>
          </div>
        </>
      ),
    },
    {
      title: "Status",
      key: "action",
      sorter: (a, b) => a.vendor?.status > b.vendor?.status,
      render: (_, record) => (
        <>
          {record?.vendor?.status === "pending-approval" && (
            <Badge color="yellow" text={record?.vendor?.status} />
          )}

          {record?.vendor?.status === "approved" && (
            <Badge color="green" text={record?.vendor?.status} />
          )}

          {record?.vendor?.status === "declined" && (
            <Badge color="red" text={record?.vendor?.status} />
          )}

          {record?.vendor?.status === "rejected" && (
            <Badge color="red" text={record?.vendor?.status} />
          )}
        </>
      ),
    },
    {
      title: "Rank",
      // dataIndex: "vendor.telephone",
      render: (_, record) => {
        return (
          <Rate
            tooltips={["Very bad", "Bad", "Good", "Very good", "Excellent"]}
            count={5}
            disabled
            value={record?.avgRate}
          />
        );
      },
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       {updatingId !== record?.vendor?._id && (
    //         <>
    //           {record?.vendor?.status === "created" && (
    //             <Popover content="Approve">
    //               <span><Popconfirm
    //                 title="Approve vendor"
    //                 description="Are you sure to approve this vendor?"
    //                 okText="Yes"
    //                 cancelText="No"
    //                 onConfirm={() => approve(record?.vendor?._id)}
    //               >
    //                 <CheckOutlined className="text-green-400 cursor-pointer" />
    //               </Popconfirm></span>
    //             </Popover>
    //           )}
    //           {record?.vendor?.status === "declined" && (
    //             <Popover content="Activate">
    //              <span> <Popconfirm
    //                 title="Activate vendor"
    //                 description="Are you sure to activate this vendor?"
    //                 okText="Yes"
    //                 cancelText="No"
    //                 onConfirm={() => activate(record?.vendor?._id)}
    //               >
    //                 <SafetyCertificateOutlined className="text-green-400 cursor-pointer" />
    //               </Popconfirm></span>
    //             </Popover>
    //           )}
    //           {record?.vendor?.status === "approved" && (
    //             <Popover content="Ban">
    //               <span><Popconfirm
    //                 title="Ban vendor"
    //                 description="Are you sure to ban this vendor?"
    //                 okText="Yes"
    //                 cancelText="No"
    //                 onConfirm={() => ban(record?.vendor?._id)}
    //               >
    //                 <StopOutlined className="text-red-400 cursor-pointer" />
    //               </Popconfirm></span>
    //             </Popover>
    //           )}
    //           {record?.vendor?.status === "banned" && (
    //             <Popover content="Activate">
    //               <span><Popconfirm
    //                 title="Acivate vendor"
    //                 description="Are you sure to activate this vendor?"
    //                 okText="Yes"
    //                 cancelText="No"
    //                 onConfirm={() => activate(record?.vendor?._id)}
    //               >
    //                 <SafetyCertificateOutlined className="text-green-400 cursor-pointer" />
    //               </Popconfirm></span>
    //             </Popover>
    //           )}
    //         </>
    //       )}

    //       {updatingId === record?.vendor?._id && (
    //         <Spin size="small" indicator={antIcon} />
    //       )}
    //     </Space>
    //   ),
    // },
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
          pageSize: 10,
        }}
      />
    </Form>
  );
};
export default VendorsTable;
