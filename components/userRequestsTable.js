import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Form,
  Input,
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
  LoadingOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment/moment";
import Highlighter from "react-highlight-words";

const UsersRequestsTable = ({
  dataSet,
  handleApproveRequest,
  handleDeclineRequest,
  updatingId,
  handleSetRow,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataSet);
  const antIcon = <LoadingOutlined style={{ fontSize: 9 }} spin />;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const cancel = () => {
    setEditingKey("");
  };

  useEffect(() => {
    setData(dataSet);
  }, [dataSet]);

  const columns = [
    {
      title: "Req Number",
      dataIndex: "number",
      ...getColumnSearchProps('number'),
    },
    {
      title: "Initiator",
      key: "initiator",
      render: (_, record) => (
        <>
          <Typography.Text>{record?.createdBy?.firstName}</Typography.Text>
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
      title: "Due date",
      key: "dueDate",
      render: (_, record) => (
        <>
          <Row className="felx flex-row items-center justify-between">
            <Typography.Text>
              {moment(record?.dueDate).format("YYYY-MMM-DD")}{" "}
            </Typography.Text>
            <Typography.Text>
              <Tag color="lime">
                <Statistic.Countdown
                  className="text-xs text-gray-500"
                  valueStyle={{ fontSize: "0.75rem", lineHeight: "1rem" }}
                  format="DD:HH:mm:ss"
                  value={moment(record?.dueDate)}
                />
              </Tag>
            </Typography.Text>
          </Row>
        </>
      ),
    },

    // {
    //   title: "Status",
    //   key: "action",
    //   render: (_, record) => (
    //     <>
    //       {(record.status === "created" || record.status === "pending") && (
    //         <Badge color="yellow" text={record.status} />
    //       )}

    //       {record.status === "approved" && (
    //         <Badge color="green" text={record.status} />
    //       )}

    //       {record.status === "active" && (
    //         <Badge color="green" text={record.status} />
    //       )}

    //       {record.status === "declined" && (
    //         <Badge color="red" text={record.status} />
    //       )}
    //     </>
    //   ),
    // },
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
        bordered
        dataSource={data}
        columns={columns}
        // pagination={{
        //   onChange: cancel,
        // }}
      />
    </Form>
  );
};
export default UsersRequestsTable;
