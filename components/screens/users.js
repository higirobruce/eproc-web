import Image from "next/image";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import {
  Typography,
  message,
  Button,
  Tag,
  Segmented,
  List,
  Table,
  Form,
  Checkbox,
  Select,
  Input,
  Spin,
  Modal,
  Row,
} from "antd";
import UsersTable from "../usersTable";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  BarsOutlined,
  EditOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  GiftOutlined,
  GlobalOutlined,
  IdcardOutlined,
  LoadingOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  DocumentCheckIcon,
  EnvelopeIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import PermissionsTable from "../permissionsTable";

export default function Users({ user }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [dataset, setDataset] = useState([]);
  let [updatingId, setUpdatingId] = useState("");
  let [row, setRow] = useState(null);
  let [segment, setSegment] = useState("Permissions");
  let [usersRequests, setUsersRequests] = useState([]);

  let [submitting, setSubmitting] = useState(false);
  let [type, setType] = useState("VENDOR");
  let [dpts, setDpts] = useState([]);
  let [servCategories, setServCategories] = useState([]);

  const [form] = Form.useForm();
  const [rdbCertId, setRdbCertId] = useState(null);
  const [vatCertId, setVatCertId] = useState(null);
  const [rdbSelected, setRDBSelected] = useState(false);

  const [openCreateUser, setOpenCreateUser] = useState(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 100 }}>
        <Select.Option value="+250">+250</Select.Option>
        <Select.Option value="+254">+254</Select.Option>
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

  const onFinish = (values) => {};

  useEffect(() => {
    loadUsers();

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
  }, []);

  useEffect(() => {
    setUpdatingId("");
    console.log(dataset);
  }, [dataset]);

  useEffect(() => {
    if (row) loadUsersRequests();
  }, [row]);

  function refresh() {
    loadUsers();
  }

  function loadUsersRequests() {
    fetch(`${url}/requests/${row?._id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUsersRequests(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function loadUsers() {
    setDataLoaded(false);
    fetch(`${url}/users/internal`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDataLoaded(true);
        setDataset(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function approveUser(id) {
    setUpdatingId(id);
    fetch(`${url}/users/approve/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {

        let _data = [...dataset];

        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(_data, { _id: id });
        let elindex = _data[index];
        elindex.status = "approved";

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function declineUser(id) {
    setUpdatingId(id);
    fetch(`${url}/users/decline/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let _data = [...dataset];

        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(_data, { _id: id });
        let elindex = _data[index];
        elindex.status = "declined";

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function setCanView(canView, module) {
    let newUser = { ...row };
    let permissionLable = "canView" + module;
    newUser.permissions[permissionLable] = canView;

    fetch(`${url}/users/${row?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUser }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadUsers();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });

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
  }

  function setCanApproveAsHod(can) {
    let newUser = { ...row };
    let permissionLable = "canApproveAsHod";
    newUser.permissions[permissionLable] = can;

    fetch(`${url}/users/${row?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUser }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadUsers();
      })
      .catch((err) => {
        // messageApi.open({
        //   type: "error",
        //   content: "Something happened! Please try again.",
        // });
      });
  }

  function setCanApproveAsHof(can) {
    let newUser = { ...row };
    let permissionLable = "canApproveAsHof";
    newUser.permissions[permissionLable] = can;

    fetch(`${url}/users/${row?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUser }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadUsers();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function setCanApproveAsPM(can) {
    let newUser = { ...row };
    let permissionLable = "canApproveAsPM";
    newUser.permissions[permissionLable] = can;

    fetch(`${url}/users/${row?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUser }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadUsers();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function setCanApprove(canApprove, module) {
    let newUser = { ...row };
    let permissionLable = "canApprove" + module;
    newUser.permissions[permissionLable] = canApprove;

    fetch(`${url}/users/${row?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUser }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadUsers();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function setCanCreated(canCreate, module) {
    let newUser = { ...row };
    let permissionLable = "canCreate" + module;
    newUser.permissions[permissionLable] = canCreate;

    fetch(`${url}/users/${row?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUser }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadUsers();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function setCanEdit(canEdit, module) {
    let newUser = { ...row };
    let permissionLable = "canEdit" + module;
    newUser.permissions[permissionLable] = canEdit;

    fetch(`${url}/users/${row?._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUser }),
    })
      .then((res) => res.json())
      .then((res) => {
        loadUsers();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }

  function createUser(newUser) {

    let permissions = {};
    newUser?.permissions?.map((p) => {
      permissions[p] = true
    });

    newUser.permissions = permissions
    newUser.password = "password"
    newUser.createdBy = user?._id
    newUser.userType = 'DPT-USER'
    newUser.companyName = newUser?.firstName + ' ' + newUser?.lastName
    fetch(`${url}/users`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((res) => {
        loadUsers();
        form.resetFields()
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });

  }

  return !row ? (
    <>
      {contextHolder}
      {buildCreateUserScreen()}
      {dataLoaded ? (
        <div className="flex flex-col mx-10 flex-1 px-10">
          <Row className="flex flex-row justify-between items-center">
            <Typography.Title level={4}>Users</Typography.Title>
            <Row className="flex flex-row space-x-5 items-center">
              <div>
                <Input.Search placeholder="Search users" />
              </div>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={() => refresh()}
              ></Button>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setOpenCreateUser(true)}
              >
                New user
              </Button>

              <Button type="text" icon={<SettingOutlined />}></Button>
            </Row>
          </Row>
          <UsersTable
            dataSet={dataset}
            handleApproveUser={approveUser}
            handleDeclineUser={declineUser}
            updatingId={updatingId}
            handleSetRow={setRow}
          />
          <div class="absolute -bottom-28 right-10 opacity-10">
            <Image src="/icons/blue icon.png" width={110} height={100} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Image alt="" src="/hire.svg" width={600} height={600} />
        </div>
      )}
    </>
  ) : (
    buildUser()
  );

  function buildUser() {
    return (
      <div className="flex flex-col  transition-opacity ease-in-out duration-1000 px-10 py-5 flex-1 space-y-3 h-full overflow-x-scroll">
        <div className="flex flex-col space-y-5">
          <div>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setRow(null);
                setSegment("Permissions");
              }}
            >
              Back to users
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Data */}
            <div className="flex flex-col space-y-5">
              <div className="bg-white ring-1 ring-gray-100 rounded shadow p-5">
                <div className="text-xl font-semibold mb-5 flex flex-row justify-between items-center">
                  <div>General Information</div>
                  <div>
                    <EditOutlined />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center space-x-10">
                    <UserIcon className="text-gray-400 h-4 w-4" />
                    <div className="text-sm flex flex-row items-center space-x-2">
                      <div>
                        {row?.firstName} {row?.lastName}
                      </div>{" "}
                      <div>
                        <Tag color="cyan">
                          {row?.title ? row?.title : row?.number}
                        </Tag>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center space-x-10">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <div className="text-sm ">{row?.email} </div>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <PhoneOutlined className="text-gray-400" />
                    <div className="text-sm ">{row?.telephone} </div>
                  </div>
                  <div className="flex flex-row items-center space-x-10">
                    <UsersIcon className="h-4 w-4 text-gray-400" />
                    <div className="text-sm ">
                      <Typography.Link>
                        {row?.department?.description}{" "}
                      </Typography.Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="col-span-2 flex flex-col space-y-5 bg-white ring-1 ring-gray-100 rounded shadow p-10">
              <Segmented
                block
                size="large"
                options={[
                  {
                    label: "Permissions",
                    value: "Permissions",
                    icon: <BarsOutlined />,
                  },
                  {
                    label: "Requests History",
                    value: "Requests History",
                    icon: <FieldTimeOutlined />,
                  },
                ]}
                onChange={setSegment}
              />
              {segment === "Permissions" && (
                <div>
                  <PermissionsTable
                    canApproveRequests={row?.permissions?.canApproveRequests}
                    canCreateRequests={row?.permissions?.canCreateRequests}
                    canEditRequests={row?.permissions?.canEditRequests}
                    canViewRequests={row?.permissions?.canViewRequests}
                    canApproveTenders={row?.permissions?.canApproveTenders}
                    canCreateTenders={row?.permissions?.canCreateTenders}
                    canEditTenders={row?.permissions?.canEditTenders}
                    canViewTenders={row?.permissions?.canViewTenders}
                    canApproveBids={row?.permissions?.canApproveBids}
                    canCreateBids={row?.permissions?.canCreateBids}
                    canEditBids={row?.permissions?.canEditBids}
                    canViewBids={row?.permissions?.canViewBids}
                    canApproveContracts={row?.permissions?.canApproveContracts}
                    canCreateContracts={row?.permissions?.canCreateContracts}
                    canEditContracts={row?.permissions?.canEditContracts}
                    canViewContracts={row?.permissions?.canViewContracts}
                    canApprovePurchaseOrders={
                      row?.permissions?.canApprovePurchaseOrders
                    }
                    canCreatePurchaseOrders={
                      row?.permissions?.canCreatePurchaseOrders
                    }
                    canEditPurchaseOrders={
                      row?.permissions?.canEditPurchaseOrders
                    }
                    canViewPurchaseOrders={
                      row?.permissions?.canViewPurchaseOrders
                    }
                    canApproveVendors={row?.permissions?.canApproveVendors}
                    canCreateVendors={row?.permissions?.canCreateVendors}
                    canEditVendors={row?.permissions?.canEditVendors}
                    canViewVendors={row?.permissions?.canViewVendors}
                    canApproveUsers={row?.permissions?.canApproveUsers}
                    canCreateUsers={row?.permissions?.canCreateUsers}
                    canEditUsers={row?.permissions?.canEditUsers}
                    canViewUsers={row?.permissions?.canViewUsers}
                    canApproveDashboard={row?.permissions?.canApproveDashboard}
                    canCreateDashboard={row?.permissions?.canCreateDashboard}
                    canEditDashboard={row?.permissions?.canEditDashboard}
                    canViewDashboard={row?.permissions?.canViewDashboard}
                    handleSetCanView={setCanView}
                    handleSetCanCreated={setCanCreated}
                    handleSetCanEdit={setCanEdit}
                    handleSetCanApprove={setCanApprove}
                  />
                  <Form>
                    <Form.Item
                      name="canApproveAsHod"
                      label="Can approve as a Head of department"
                    >
                      <Checkbox
                        defaultChecked={row?.permissions.canApproveAsHod}
                        onChange={(e) => setCanApproveAsHod(e.target.checked)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="canApproveAsHof"
                      label="Can approve as a Head of finance"
                    >
                      <Checkbox
                        defaultChecked={row?.permissions.canApproveAsHof}
                        onChange={(e) => setCanApproveAsHof(e.target.checked)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="canApproveAsPM"
                      label="Can approve as a Procurement manager"
                    >
                      <Checkbox
                        defaultChecked={row?.permissions.canApproveAsPM}
                        onChange={(e) => setCanApproveAsPM(e.target.checked)}
                      />
                    </Form.Item>
                  </Form>
                </div>
              )}
              {segment === "Requests History" && (
                <div className="p-3">
                  {usersRequests?.map((request) => {
                    return (
                      <div
                        key={request?._id}
                        className="grid grid-cols-4 ring-1 ring-gray-200 rounded my-3 p-3 text-gray-700"
                      >
                        <div>
                          <div className="flex-row  flex items-center">
                            <div>
                              <FileTextOutlined className="h-4 w-4" />
                            </div>{" "}
                            <div>{request?.number}</div>
                          </div>
                          <div>{request?.title}</div>
                          <div>{request?.description}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Status</div>
                          <div>
                            <Tag color="gold">{request.status}</Tag>
                          </div>
                        </div>
                        <div>{`Due ${moment(request?.dueDate).fromNow()}`}</div>
                        <div>
                          {request?.budgeted ? (
                            <div>
                              <Tag color="green">BUDGETED</Tag>
                            </div>
                          ) : (
                            <div>
                              <Tag color="magenta">NOT BUDGETED</Tag>
                            </div>
                          )}
                        </div>
                        <div></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function buildCreateUserScreen() {
    return (
      <Modal
        title="New User"
        centered
        open={openCreateUser}
        onOk={() => {
          form.validateFields().then(
            (value) => {
              createUser(value);
              setOpenCreateUser(false)
            },
            (reason) => {}
          );

          // setOpenCreateUser(false);
        }}
        okText={"Ok"}
        onCancel={() => setOpenCreateUser(false)}
        width={"80%"}
        bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="newUser"
          onFinish={onFinish}
          initialValues={{
            firstName: "",
            prefix: "+250",
            email: "",
          }}
          scrollToFirstError
        >
          <div className="">
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
                      First Name
                      <div className="text-red-500">*</div>
                    </div>
                    <Form.Item
                      name="firstName"
                      // label="Contact Person's Names"
                      rules={[
                        {
                          required: true,
                          message: "Please input user's firstName!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                  <div>
                    <div className="flex flex-row spacex-3">
                      Last Name
                      <div className="text-red-500">*</div>
                    </div>
                    <Form.Item
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Please input user's lastName!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <div className="flex flex-row spacex-3">
                      Phone number <div className="text-red-500">*</div>
                    </div>
                    <Form.Item
                      name="telephone"
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
                      Department
                      <div className="text-red-500">*</div>
                    </div>
                    <Form.Item name="department">
                      <Select
                        // mode="multiple"
                        // allowClear
                        // style={{width:'100%'}}

                        placeholder="Please select"
                      >
                        {dpts?.map((dpt) => {
                          return (
                            <Select.Option key={dpt._id} value={dpt._id}>
                              {dpt.description}
                            </Select.Option>
                          );
                        })}
                      </Select>
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
                          message: "Please input user's e-mail!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div>
                    <div className="flex flex-row spacex-3">
                      Permissions
                      <div className="text-red-500">*</div>
                    </div>
                    <Form.Item name="permissions">
                      <Select
                        mode="multiple"
                        allowClear
                        // style={{width:'100%'}}

                        placeholder="Please select"
                        options={[
                          {
                            value: "canApproveAsHod",
                            label: "Approve as Head of Department",
                          },
                          {
                            value: "canApproveAsHof",
                            label: "Approve as Head of Finance",
                          },
                          {
                            value: "canApproveAsPM",
                            label: "Approve as Procurement Manager",
                          },
                          {
                            value: "canViewRequests",
                            label: "View Purchase requests",
                          },
                          {
                            value: "canViewTenders",
                            label: "View Tenders",
                          },
                          {
                            value: "canViewPurchaseOrders",
                            label: "View Purchase Orders",
                          },
                          {
                            value: "canViewVendors",
                            label: "View Vendors",
                          },
                          {
                            value: "canViewUsers",
                            label: "View Users",
                          },
                          {
                            value: "canViewDashboard",
                            label: "View Dashboards",
                          },
                          {
                            value: "canViewBids",
                            label: "View Bids",
                          },
                          {
                            value: "canViewContracts",
                            label: "View Contracts",
                          },
                        ]}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}
