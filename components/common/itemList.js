import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import UploadFiles from "./uploadFiles";
import TagInput from "./tagInput";
const ItemList = ({ handleSetValues }) => {
  const [serviceCategories, setServiceCategories] = useState([]);
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

  useEffect(() => {
    fetch(`${url}/serviceCategories`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    }).then(res=>res.json())
    .then(res=>{
      setServiceCategories(res)
    })
  }, []);

  const onValuesChange = (changedValues, allValues) => {
    handleSetValues(allValues);
  };

  return (
    <Form
      name="dynamic_form_nest_item"
      onValuesChange={onValuesChange}
      autoComplete="off"
      // labelCol={{ span: 9 }}
      // wrapperCol={{ span: 20 }}
    >
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} className="flex flex-row border-2 mb-5 space-x-10">
                <Col>
                  <Form.Item label="Title/Description" name={[name, "title"]}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Quantity" className="w-96" name={[name, "quantity"]}>
                    <InputNumber />
                  </Form.Item>

                  {/* <Form.Item
                    label="Estimated Unit Cost"
                    name={[name, "estimatedUnitCost"]}
                  >
                    <InputNumber />
                  </Form.Item> */}

                  <Form.Item label="Estimated Unit Cost">
                    <Input.Group compact>
                      <Form.Item noStyle name={[name, "currency"]}>
                        <Select
                          defaultValue="RWF"
                          options={[
                            {
                              value: "RWF",
                              label: "RWF",
                            },
                            {
                              value: "USD",
                              label: "USD",
                            },
                          ]}
                        ></Select>
                      </Form.Item>
                      <Form.Item name={[name, "estimatedUnitCost"]} noStyle>
                        <InputNumber />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>

                  <Form.Item
                    label="Request Category"
                    name={[name, "serviceCategory"]}
                  >
                    <Select
                      showSearch
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      filterOption={(inputValue, option) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase())
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

                  {/* <Form.Item
                    label="Attachements"
                    {...restField}
                    name={[name, "first"]}
                    //   rules={[
                    //     {
                    //       required: true,
                    //       message: 'Missing first name',
                    //     },
                    //   ]}
                  >
                    <UploadFiles />
                  </Form.Item> */}
                  

                  <Divider />
                </Col>
                <DeleteOutlined
                  className="text-red-400"
                  onClick={() => remove(name)}
                />
              </Row>
            ))}
            <Form.Item>
              <Button
                className="w-full"
                type="link"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Item
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      {/* <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item> */}
    </Form>
  );
};
export default ItemList;
