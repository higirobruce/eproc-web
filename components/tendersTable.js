import React, { useEffect, useState } from "react";
import {
  Badge,
  Form,
  Pagination,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EllipsisOutlined,
  FileOutlined,
  FileProtectOutlined,
  LoadingOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import moment from "moment/moment";

const TendersTable = ({
  dataSet,
  handleApproveRequest,
  handleDeclineRequest,
  updatingId,
  handleSetRow,
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
      title: "Tender Number",
      dataIndex: "number",
      render: (_, record) => (
        <>
          <div
            className="font-semibold cursor-pointer space-x-1 flex flex-row items-center text-blue-500 hover:underline"
            onClick={() => handleSetRow(record)}
          >
            <div>
              <FileProtectOutlined />
            </div>
            <div>{record?.number}</div>
          </div>
        </>
      ),
    },
    {
      title: "Title",
      key: "title",
      render: (_, record) => (
        <>
          <Typography.Text>{record?.purchaseRequest?.title}</Typography.Text>
        </>
      ),
    },
    {
      title: "Department",
      key: "department",
      render: (_, record) => (
        <>
          <Typography.Text>
            {record?.createdBy?.department?.description}
          </Typography.Text>
        </>
      ),
    },

    {
      title: "Deadline date",
      key: "submissionDeadLine",
      render: (_, record) => (
        <>
          <Row className="felx flex-row items-center justify-between">
            <Typography.Text>
              {moment(record?.submissionDeadLine).format("YYYY-MMM-DD")}{" "}
            </Typography.Text>
            {/* <Typography.Text>
              <Tag color="lime">
                <Statistic.Countdown
                  className="text-xs text-gray-500"
                  valueStyle={{ fontSize: "0.75rem", lineHeight: "1rem" }}
                  format="DD:HH:mm:ss"
                  value={moment(record?.submissionDeadLine)}
                />
              </Tag>
            </Typography.Text> */}
          </Row>
        </>
      ),
    },

    {
      title: "Status",
      key: "action",
      render: (_, record) => (
        <>
          {(record.status === "open" || record.status === "pending") && (
            <Tag color="yellow">OPEN</Tag>
          )}

          {record.status === "bidSelected" && (
            <Tag color="green">BID SELECTED</Tag>
          )}

          {record.status === "bidAwarded" && (
            <Tag color="blue">BID AWARDED</Tag>
          )}

          {record.status === "closed" && <Tag color="lime">CLOSED</Tag>}
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
              {/* {record.status !== "approved" && (
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
              )} */}
              <EllipsisOutlined
                className="text-blue-400 cursor-pointer"
                onClick={() => {
                  handleSetRow(record);
                }}
              />
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
    handleApproveRequest(id);
  }

  async function decline(id) {
    handleDeclineRequest(id);
  }

  return (
    <Form form={form} component={false}>
      <Table
        size="small"
        dataSource={data}
        columns={columns}
        className="shadow-lg rounded-md"
        pagination={{
          total: 10,
        }}
        // pagination={{
        //   onChange: cancel,
        // }}
      />
    </Form>
  );
};
export default TendersTable;
