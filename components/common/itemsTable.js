import { Button, Form, Input, InputNumber, Popconfirm, Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import UploadFiles from "./uploadFiles";
import {v4} from 'uuid'
import UploadTORs from "./uploadTORs";
import { uniqueId } from "lodash";

const EditableContext = React.createContext(null);
const EditableRow = ({ index,rowForm, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(true);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef?.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Input required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} placeholder={dataIndex==='title'?'enter title':'eg. 1000000'} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const ItemsTable = ({ setDataSource, dataSource, setFileList, fileList }) => {
  const [count, setCount] = useState(1);
  const [rowForm] = Form.useForm();
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key && item.key);
    setCount(count-1)
    setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: "Item title",
      dataIndex: "title",
      width: "20%",
      editable: true,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "15%",
      editable: true,
    },
    {
      title: "Estimated Unit cost (RWF)",
      dataIndex: "estimatedUnitCost",
      width: "20%",
      editable: true,
    },
    {
      title: <div>Supporting Docs <i className="text-xs font-thin">(e.g specs, ToR,... expected in PDF format)</i></div>,
      dataIndex: "attachements",
      render: (_, record) => (dataSource.length >= 1 ? <UploadTORs uuid={record?.id} setFileList={setFileList} fileList={fileList} /> : null),
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      title: ``,
      quantity: '',
      estimatedUnitCost: '',
      id: v4()
    };
    
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        size="small"
      />
    </div>
  );
};
export default ItemsTable;
