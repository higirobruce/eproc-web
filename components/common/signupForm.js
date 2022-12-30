import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Skeleton,
  Spin,
  Typography,
  message,
} from "antd";
import Image from "next/image";

const { Title } = Typography;
const { Option } = Select;
const residences = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

const SignupForm = () => {
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

  const [messageApi, contextHolder] = message.useMessage();
  let [loaded, setLoaded] = useState(false);
  let [submitting, setSubmitting] = useState(false);
  let [type, setType] = useState("");
  let [dpts, setDpts] = useState([]);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    setSubmitting(true);

    fetch(`${url}/users`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userType: values.type,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        telephone: values.prefix + values.phone,
        experienceDurationInYears: values.experience,
        experienceDurationInMonths: values.experience * 12,
        webSite: values.website,
        status: "created",
        password: values.password,
        tin: values.tin,
        passport: values.passport,
        nid: values.nid,
        number: values.number,
        companyName: values.companyName,
        companyEmail: values.companyEmail,
        notes: values.notes,
        department: values.dpt
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setSubmitting(false);
        if (!res.error) {
          messageApi.open({
            type: "success",
            content: "Successfully registered!",
          });
        } else {
          messageApi.open({
            type: "error",
            content: res.errorMessage,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    setLoaded(true);
    fetch(`${url}/dpts`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setDpts(res);
      });
  }, []);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 100 }}>
        <Option value="+250">+250</Option>
        <Option value="+254">+254</Option>
      </Select>
    </Form.Item>
  );

  const formItemLayout = {
    // labelCol: {
    //   xs: { span: 24 },
    //   sm: { span: 10 },
    // },
    // wrapperCol: {
    //   xs: { span: 24 },
    //   sm: { span: 24 },
    // },
  };
  const tailFormItemLayout = {
    // wrapperCol: {
    //   xs: {
    //     span: 24,
    //     offset: 0,
    //   },
    //   sm: {
    //     span: 16,
    //     offset: 8,
    //   },
    // },
  };

  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        [".com", ".org", ".net"].map((domain) => `${value}${domain}`)
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  return (
    <div>
      {contextHolder}
      {loaded ? (
        <div className="flex bg-slate-50 py-2 px-16 rounded-lg shadow-lg">
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              firstName: "",
              prefix: "+250",
              email: "",
            }}
            scrollToFirstError
          >
            <Row className="flex flex-row space-x-5 items-center justify-between">
              <Typography.Title className="" level={2}>
                Create an account
              </Typography.Title>

              <Image
                alt=""
                className="pt-3"
                src="/favicon.png"
                width={40}
                height={40}
              />
            </Row>
            <Form.Item
              name="type"
              label="Account type"
              rules={[
                { required: true, message: "Please select account type!" },
              ]}
            >
              <Select
                placeholder="select account type"
                onChange={(value) => setType(value)}
              >
                <Option value="VENDOR">Vendor</Option>
                <Option value="DPT-USER">Department User</Option>
              </Select>
            </Form.Item>

            {type === "VENDOR" && (
              <>
                <Row className="row space-x-4">
                  <Form.Item
                    name="companyName"
                    label="Company name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Company Name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="tin"
                    label="TIN"
                    rules={[
                      // { len: 10, message: "TIN should be 10 charachers" },
                      {
                        type: "integer",
                        message: "TIN provided is not a number",
                      },
                      { required: true, message: "Please input TIN!" },
                    ]}
                  >
                    <InputNumber style={{ width: 200 }} />
                  </Form.Item>
                </Row>
                <Row className="row space-x-4">
                  <Form.Item
                    name="firstName"
                    label="First name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your First Name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item name="lastName" label="Last name">
                    <Input />
                  </Form.Item>
                </Row>

                <Row className="row space-x-4">
                  <Form.Item
                    name="companyEmail"
                    label="Company E-mail"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please input your Company E-mail!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Row>

                <Row className="row space-x-4">
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The two passwords that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Row>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input
                    addonBefore={prefixSelector}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="experience"
                  label="Experience in Years"
                  rules={[
                    {
                      type: "integer",
                      message: "The input is not valid Number",
                    },
                    
                  ]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  name="website"
                  label="Website"
                >
                  <AutoComplete
                    options={websiteOptions}
                    onChange={onWebsiteChange}
                    placeholder="website"
                  >
                    <Input />
                  </AutoComplete>
                </Form.Item>

                <Row className="row space-x-4">
                  <Form.Item name="passport" label="Passport">
                    <Input />
                  </Form.Item>

                  <Form.Item name="nid" label="NID">
                    <Input />
                  </Form.Item>
                </Row>

                <Form.Item
                  name="notes"
                  label="Notes"
                >
                  <Input.TextArea showCount maxLength={100} />
                </Form.Item>

                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Should accept agreement")
                            ),
                    },
                  ]}
                  {...tailFormItemLayout}
                >
                  <Checkbox>
                    I have read the <a href="">agreement</a>
                  </Checkbox>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  {submitting ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <Button type="default" htmlType="submit">
                      Register
                    </Button>
                  )}
                </Form.Item>
              </>
            )}

            {type === "DPT-USER" && (
              <>
                <Form.Item
                  name="dpt"
                  label="Department"
                  rules={[
                    { required: true, message: "Please select department!!" },
                  ]}
                >
                  <Select
                    placeholder="select department!"
                    // onChange={(value) => setType(value)}
                  >
                    {dpts?.map((d) => {
                      return (
                        <Option key={d.number} value={d._id}>
                          {d.description}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Row className="row space-x-4">
                  <Form.Item
                    name="firstName"
                    label="First name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your First Name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item name="lastName" label="Last name">
                    <Input />
                  </Form.Item>
                </Row>

                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Row className="row space-x-4">
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The two passwords that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Row>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input
                    addonBefore={prefixSelector}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  {submitting ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <Button type="default" htmlType="submit">
                      Register
                    </Button>
                  )}
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default SignupForm;
