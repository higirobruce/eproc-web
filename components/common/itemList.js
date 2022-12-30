import React, { useState } from "react";
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
  const onValuesChange = (changedValues, allValues) => {
    handleSetValues(allValues);
  };

  return (
    <Form
      name="dynamic_form_nest_item"
      onValuesChange={onValuesChange}
      autoComplete="off"
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} className="flex flex-row border-2 mb-5">
                <Col>
                  <Form.Item label="Title/Description" name={[name, "title"]}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Quantity" name={[name, "quantity"]}>
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
                        >
                          
                        </Select>
                      </Form.Item>
                      <Form.Item name={[name, "estimatedUnitCost"]} noStyle>
                        <InputNumber />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>

                  <Form.Item
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
                  </Form.Item>
                  <Form.Item
                    label="Reference links"
                    {...restField}
                    name={[name, "links"]}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Missing last name",
                    //   },
                    // ]}
                  >
                    <Input.TextArea className="w-96" rows={5} />
                  </Form.Item>

                  <Form.Item
                    label="TORs"
                    {...restField}
                    name={[name, "tors"]}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Missing last name",
                    //   },
                    // ]}
                  >
                    <Input.TextArea className="w-96" rows={5} />
                  </Form.Item>

                  <Form.Item label="Tech specs" name={[name, "techSpechs"]}>
                    <Input.TextArea className="w-96" rows={5} />
                  </Form.Item>

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
