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
  FileOutlined,
  FileTextFilled,
  FileTextOutlined,
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
  handleSelectRequest,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataSet);
  let [selectedRow, setSelectedRow] = useState("");
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

  function getHighLevelStatus(status) {
    if (status === "Approved" || status === "Declined") {
      return status;
    } else if(status ==='approve (pm)'){
      return 'Approved'
    }
    else {
      return "Pending";
    }
  }

  const cancel = () => {
    setEditingKey("");
  };

  const getTagColor = (status) => {
    if (status === "Pending") return "yellow";
    else if (status === "Approved") return "green";
    else if (status === "approved (fd)") return "cyan";
    else if (status === "approved (pm)") return "geekblue";
    else if (status === "approved") return "green";
    else if (status === "Declined") return "red";
  };

  useEffect(() => {
    setData(dataSet);
  }, [dataSet]);

  const columns = [
    {
      title: "Req Number",
      // dataIndex: "number",
      render: (_, record) => (
        <>
          <div
            className="font-semibold cursor-pointer space-x-1 flex flex-row items-center text-blue-500 hover:underline"
            onClick={() => handleSetRow(record)}
          >
            <div>
              <FileTextOutlined className="text-xs" />
            </div>
            <div>{record?.number}</div>
          </div>
        </>
      ),
      // ...getColumnSearchProps("number"),
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (_, record) => (
        <>
          <div className={record?.number === selectedRow ? "font-bold" : ""}>
            <Typography.Text
              style={{ width: 150 }}
              ellipsis={true}
            >
              {record?.title}
            </Typography.Text>
            
          </div>
        </>
      ),
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
      title: "Category",
      key: "serviceCategory",
      render: (_, record) => (
        <>
          <Typography.Text>{record?.serviceCategory}</Typography.Text>
        </>
      ),
    },

    {
      title: "Budgeted?",
      key: "budgeted",
      render: (_, record) => (
        <>
          {record.budgeted && <Typography.Text>Yes</Typography.Text>}
          {!record.budgeted && <Typography.Text>No</Typography.Text>}
        </>
      ),
    },
    {
      title: "Due date",
      key: "dueDate",
      sorter: (a,b)=>moment(a.dueDate).isAfter(moment(b.dueDate)),
      render: (_, record) => (
        <>
          <Row className="felx flex-row items-center justify-between">
            <Typography.Text>
              {moment(record?.dueDate).fromNow()}{" "}
            </Typography.Text>
          </Row>
        </>
      ),
    },

    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <>
          <Badge
            color={getTagColor(
              getHighLevelStatus(
                record?.status.charAt(0).toUpperCase() + record?.status.slice(1)
              )
            )}
            text={getHighLevelStatus(
              record?.status.charAt(0).toUpperCase() + record?.status.slice(1)
            )}
          />
        </>
      ),
    },

    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       {updatingId !== record._id && (
    //         <>
    //           <EllipsisOutlined
    //             className="text-blue-400 cursor-pointer"
    //             onClick={() => {
    //               handleSetRow(record);
    //               setSelectedRow(record.number);
    //             }}
    //           />
    //         </>
    //       )}

    //       {updatingId === record._id && (
    //         <Spin size="small" indicator={antIcon} />
    //       )}
    //     </Space>
    //   ),
    // },
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
        // pagination={{
        //   pageSize: 20,
        // }}
      />
    </Form>
  );
};
export default UsersRequestsTable;
