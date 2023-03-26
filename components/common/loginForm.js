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
  const [forgotPassword, setForgotPassword] = useState(false);

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

  const resetPassword = (values) => {
    setSubmitting(true);

    fetch(`${url}/users/reset/${values.email}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      //   email: values.email,
      //   password: values.password,
      // }),
    })
      .then((res) => res.json())
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Success!!",
        });
        localStorage.setItem("user", JSON.stringify(res));
        setSubmitting(false);
        setForgotPassword(false)
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

  const formItemLayout = {};
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
        <div className="flex flex-col bg-gray-50 items-center justify-center rounded shadow-md h-screen md:px-20">
          {!forgotPassword && <>
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
              style={{ width: "100%" }}
            >
              <Row className="flex flex-col items-center justify-between pb-5">
                <div className="flex flex-row items-center">
                  {/* <div>
                  <Image
                    alt=""
                    className="pt-3"
                    src="/icons/blue icon.png"
                    width={43}
                    height={40}
                  />{" "}
                </div>
                <div className="font-bold text-lg">Irembo Procure</div> */}
                </div>
                <Typography.Title className="" level={3}>
                  Login
                </Typography.Title>
              </Row>

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
                <div>Password</div>
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

              <Form.Item {...tailFormItemLayout}>
                {submitting ? (
                  <Spin indicator={antIcon} />
                ) : (
                  <div className="flex flex-row items-center justify-between">
                    <Button type="default" htmlType="submit">
                      Login
                    </Button>

                    <Button type="link" onClick={()=>setForgotPassword(true)}>Forgot password?</Button>
                  </div>
                )}
              </Form.Item>
            </Form>

            <div className="flex flex-row space-x-2 self-start">
              <Typography.Text level={5}>New User? </Typography.Text>
              <Typography.Link onClick={() => Router.push("/signup")}>
                Sign up
              </Typography.Link>
            </div>
          </>}

          {forgotPassword && <>
            <Form
              {...formItemLayout}
              form={form}
              name="reset"
              onFinish={resetPassword}
              
              scrollToFirstError
              style={{ width: "100%" }}
            >
              <Row className="flex flex-col items-center justify-between pb-5">
                <div className="flex flex-row items-center">
                  {/* <div>
                  <Image
                    alt=""
                    className="pt-3"
                    src="/icons/blue icon.png"
                    width={43}
                    height={40}
                  />{" "}
                </div>
                <div className="font-bold text-lg">Irembo Procure</div> */}
                </div>
                <Typography.Title className="" level={3}>
                  Reset Password
                </Typography.Title>
              </Row>

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


              <Form.Item {...tailFormItemLayout}>
                {submitting ? (
                  <Spin indicator={antIcon} />
                ) : (
                  <div className="flex flex-row items-center justify-between">
                    <Button type="default" htmlType="submit">
                      Send me reset token
                    </Button>

                    <Button type="link" onClick={()=>setForgotPassword(false)}>Back to Login</Button>
                  </div>
                )}
              </Form.Item>
            </Form>
          </>}
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default LoginForm;
