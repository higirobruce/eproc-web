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
import Router, { useRouter } from "next/router";

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

const LoginForm = () => {
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

  const [messageApi, contextHolder] = message.useMessage();
  let [loaded, setLoaded] = useState(false);
  let [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    setSubmitting(true);

    fetch(`${url}/users/login`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.allowed) {
          
          if (res.user.status === "approved") {
            messageApi.open({
              type: "success",
              content: "Success!!",
            });
            localStorage.setItem("user", JSON.stringify(res.user));
            Router.push("/mainPage").then(() => {
              setSubmitting(false);
            });
          } else {
            messageApi.open({
              type: "error",
              content: "You are not yet approved to access the system!",
            });
            setSubmitting(false);
          }
        } else {
          setSubmitting(false);
          messageApi.open({
            type: "error",
            content: "Please check email and password!",
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

    // setTimeout(()=>{
    //   Router.push('/mainPage').then(()=>{
    //     setSubmitting(false)
    //   })
    // },3000)
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    setLoaded(true);
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
        <div className="flex bg-gray-50 py-2 px-16 rounded shadow-md">
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
            <Row className="flex flex-row items-center justify-between pb-5">
              <Typography.Title className="" level={2}>
                Login
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

            <Form.Item {...tailFormItemLayout}>
              {submitting ? (
                <Spin indicator={antIcon} />
              ) : (
                <Button type="default" htmlType="submit">
                  Login
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default LoginForm;
