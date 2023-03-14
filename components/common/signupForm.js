import React, { useEffect, useState } from "react";
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  StarFilled,
} from "@ant-design/icons";
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
  Upload,
  Divider,
  Tooltip,
} from "antd";
import Image from "next/image";
import UploadFiles from "./uploadFiles";
import Router from "next/router";
import UploadRDCerts from "./uploadRDBCerts";
import { v4 } from "uuid";
import UploadVatCerts from "./uploadVatCerts";

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
  let [type, setType] = useState("VENDOR");
  let [dpts, setDpts] = useState([]);
  let [servCategories, setServCategories] = useState([]);

  const [form] = Form.useForm();
  const [rdbCertId, setRdbCertId] = useState(null);
  const [vatCertId, setVatCertId] = useState(null);
  const [rdbSelected, setRDBSelected] = useState(false);

  const onFinish = (values) => {
    setSubmitting(true);

    fetch(`${url}/users`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userType: type,
        email: values.email,
        telephone: values.prefix + values.phone,
        experienceDurationInYears: values.experience,
        experienceDurationInMonths: values.experience * 12,
        webSite: values.website,
        status: "created",
        password: values.password,
        tin: values.tin,
        number: values.number,
        companyName: values.companyName,
        department: values.dpt,
        contactPersonNames: values.contactPersonNames,
        title: values.title,
        hqAddress: values.hqAddress,
        country: values.country,
        passportNid: values.passportNid,
        services: values.services,
        rdbCertId,
        vatCertId,
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
    setRdbCertId(v4());
    setVatCertId(v4());
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
        setDpts(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Connection Error!",
        });
      });

    fetch(`${url}/serviceCategories`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setServCategories(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Connection Error!",
        });
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
    //   xs: { span: 10 },
    //   sm: { span: 10 },
    // },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
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
    <div className="flex h-screen">
      {contextHolder}
      {loaded ? (
        <div className="flex bg-slate-50 py-5 my-10 px-10 rounded-lg shadow-lg overflow-y-auto">
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
            <div>
              {submitting ? (
                <Spin indicator={antIcon} />
              ) : (
                <div className="flex flex-row text-sm items-center">
                  <div>Already have an account?</div>
                  <Button type="link" onClick={() => Router.push("/")}>
                    Login
                  </Button>
                </div>
              )}
            </div>
            <Row className="flex flex-row space-x-5 items-center justify-between">
              <div>
                <Typography.Title level={2}>Create an account</Typography.Title>
              </div>

              <Image
                alt=""
                className="pt-3"
                src="/favicon.png"
                width={40}
                height={40}
              />
            </Row>
            {/* <Form.Item
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
            </Form.Item> */}

            {type === "VENDOR" && (
              <>
                <div className="grid md:grid-cols-2 gap-x-10">
                  {/* General Information */}
                  <div>
                    <Typography.Title className="" level={4}>
                      General Information
                    </Typography.Title>
                    <div className="">
                      {/* Grid 1 */}
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <div className="flex flex-row spacex-3">
                            Company Name<div className="text-red-500">*</div>
                          </div>

                          <Form.Item
                            name="companyName"
                            // label="Company name"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Company Name!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </div>

                        <div>
                          <div className="flex flex-row spacex-3">
                            TIN<div className="text-red-500">*</div>
                          </div>
                          <Form.Item
                            name="tin"
                            // label="TIN"
                            rules={[
                              // { len: 10, message: "TIN should be 10 charachers" },
                              {
                                type: "integer",
                                message: "TIN provided is not a number",
                              },
                              { required: true, message: "Please input TIN!" },
                            ]}
                          >
                            <InputNumber style={{ width: "100%" }} />
                          </Form.Item>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <div className="flex flex-row spacex-3">
                            Contact person Names
                            <div className="text-red-500">*</div>
                          </div>
                          <Form.Item
                            name="contactPersonNames"
                            // label="Contact Person's Names"
                            rules={[
                              {
                                required: true,
                                message: "Please input contact person's names!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </div>
                        <div>
                          <div className="flex flex-row spacex-3">
                            Contact Person Title
                            <div className="text-red-500">*</div>
                          </div>
                          <Form.Item
                            name="title"
                            rules={[
                              {
                                required: true,
                                message: "Please input contact person's title!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <div>Email</div>
                          <Form.Item
                            name="email"
                            // label="E-mail"
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
                        </div>
                        <div>
                          <div>Website</div>
                          <Form.Item name="website">
                            <AutoComplete
                              options={websiteOptions}
                              onChange={onWebsiteChange}
                              placeholder="website"
                            >
                              <Input />
                            </AutoComplete>
                          </Form.Item>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <div className="flex flex-row spacex-3">
                            Password<div className="text-red-500">*</div>
                          </div>
                          <Form.Item
                            name="password"
                            // label="Password"
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
                        </div>
                        <div>
                          <div className="flex flex-row spacex-3">
                            Confirm password
                            <div className="text-red-500">*</div>
                          </div>
                          <Form.Item
                            name="confirm"
                            // label="Confirm Password"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                message: "Please confirm your password!",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("password") === value
                                  ) {
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
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <div className="flex flex-row spacex-3">
                            Phone number <div className="text-red-500">*</div>
                          </div>
                          <Form.Item
                            name="phone"
                            rules={[
                              {
                                required: true,
                                message: "Please input your phone number!",
                              },
                            ]}
                          >
                            <Input addonBefore={prefixSelector} />
                          </Form.Item>
                        </div>
                        <div>
                          <div className="flex flex-row spacex-3">
                            Area(s) of expertise
                            <div className="text-red-500">*</div>
                          </div>
                          <Form.Item name="services">
                            <Select
                              mode="multiple"
                              allowClear
                              // style={{width:'100%'}}
                              placeholder="Please select"
                            >
                              {servCategories?.map((s) => {
                                return (
                                  <Option key={s._id} value={s.description}>
                                    {s.description}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <div>Experience (in Years)</div>
                          <Form.Item
                            name="experience"
                            rules={[
                              {
                                type: "integer",
                                message: "The input is not valid Number",
                              },
                            ]}
                          >
                            <InputNumber style={{ width: "100%" }} />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address information */}
                  <div>
                    <Typography.Title className="" level={4}>
                      Address Information
                    </Typography.Title>

                    <div>
                      {/* Grid 1 */}
                      <div className="grid grid-cols-2 gap-x-5">
                        <div>
                          <div>Hq Address</div>
                          <Form.Item name="hqAddress">
                            <Input />
                          </Form.Item>
                        </div>

                        <div>
                          <div>Country</div>
                          <Form.Item name="country">
                            <Input />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <Typography.Title className="" level={4}>
                      Uploads
                    </Typography.Title>

                    <div className="grid md:grid-cols-2 gap-x-5">
                      <div>
                        <div className="flex flex-row space-x-1">
                          <div>Incorporation document</div>
                          <div>
                            <Tooltip
                              placement="top"
                              title="Please attach your incorporation document. For businesses registered in Rwanda, please provide your RDB certificate."
                              arrow={false}
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                        </div>
                        <Form.Item
                          name="rdbRegistraction"
                          rules={[
                            {
                              validator: (_, value) =>
                                rdbSelected
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error("Should attach the incorporation document")
                                    ),
                            },
                          ]}
                        >
                          <UploadRDCerts
                            uuid={rdbCertId}
                            setSelected={setRDBSelected}
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <div>VAT Certificate</div>
                        <Form.Item name="vatCertificate">
                          <UploadVatCerts uuid={vatCertId} />
                        </Form.Item>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>

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

                <Form.Item className="pb-5" {...tailFormItemLayout}>
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
