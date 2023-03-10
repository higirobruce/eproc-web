import {
  ApartmentOutlined,
  BankOutlined,
  BarsOutlined,
  CompassOutlined,
  EditOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  GiftOutlined,
  GlobalOutlined,
  IdcardOutlined,
  MailOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { EnvelopeIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import {
  Checkbox,
  Empty,
  Form,
  List,
  message,
  Segmented,
  Tag,
  Typography,
} from "antd";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { PDFObject } from "react-pdfobject";
import PermissionsTable from "../permissionsTable";

export default function Profile({ user }) {
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
  return <div>{buildUser()}</div>;

  function buildUser() {
    return (
      <div className="flex flex-col  transition-opacity ease-in-out duration-1000 px-10 py-5 flex-1 space-y-3 h-full overflow-x-scroll">
        <div className="flex flex-col space-y-5">
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
                        {user?.firstName} {user?.lastName}
                      </div>{" "}
                      <div>
                        <Tag color="cyan">
                          {user?.title ? user?.title : user?.number}
                        </Tag>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center space-x-10">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <div className="text-sm ">{user?.email} </div>
                  </div>

                  <div className="flex flex-row items-center space-x-10">
                    <PhoneOutlined className="text-gray-400" />
                    <div className="text-sm ">{user?.telephone} </div>
                  </div>
                  <div className="flex flex-row items-center space-x-10">
                    <UsersIcon className="h-4 w-4 text-gray-400" />
                    <div className="text-sm ">
                      <Typography.Link>
                        {user?.department?.description}{" "}
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
                    canApproveRequests={user?.permissions?.canApproveRequests}
                    canCreateRequests={user?.permissions?.canCreateRequests}
                    canEditRequests={user?.permissions?.canEditRequests}
                    canViewRequests={user?.permissions?.canViewRequests}
                    canApproveTenders={user?.permissions?.canApproveTenders}
                    canCreateTenders={user?.permissions?.canCreateTenders}
                    canEditTenders={user?.permissions?.canEditTenders}
                    canViewTenders={user?.permissions?.canViewTenders}
                    canApproveBids={user?.permissions?.canApproveBids}
                    canCreateBids={user?.permissions?.canCreateBids}
                    canEditBids={user?.permissions?.canEditBids}
                    canViewBids={user?.permissions?.canViewBids}
                    canApproveContracts={user?.permissions?.canApproveContracts}
                    canCreateContracts={user?.permissions?.canCreateContracts}
                    canEditContracts={user?.permissions?.canEditContracts}
                    canViewContracts={user?.permissions?.canViewContracts}
                    canApprovePurchaseOrders={
                      user?.permissions?.canApprovePurchaseOrders
                    }
                    canCreatePurchaseOrders={
                      user?.permissions?.canCreatePurchaseOrders
                    }
                    canEditPurchaseOrders={
                      user?.permissions?.canEditPurchaseOrders
                    }
                    canViewPurchaseOrders={
                      user?.permissions?.canViewPurchaseOrders
                    }
                    canApproveVendors={user?.permissions?.canApproveVendors}
                    canCreateVendors={user?.permissions?.canCreateVendors}
                    canEditVendors={user?.permissions?.canEditVendors}
                    canViewVendors={user?.permissions?.canViewVendors}
                    canApproveUsers={user?.permissions?.canApproveUsers}
                    canCreateUsers={user?.permissions?.canCreateUsers}
                    canEditUsers={user?.permissions?.canEditUsers}
                    canViewUsers={user?.permissions?.canViewUsers}
                    canApproveDashboard={user?.permissions?.canApproveDashboard}
                    canCreateDashboard={user?.permissions?.canCreateDashboard}
                    canEditDashboard={user?.permissions?.canEditDashboard}
                    canViewDashboard={user?.permissions?.canViewDashboard}
                    handleSetCanView={() => {}}
                    handleSetCanCreated={() => {}}
                    handleSetCanEdit={() => {}}
                    handleSetCanApprove={() => {}}
                    canNotEdit={true}
                  />
                  <Form>
                    <Form.Item
                      name="canApproveAsHod"
                      label="Can approve as a Head of department"
                    >
                      <Checkbox
                        disabled
                        defaultChecked={user?.permissions.canApproveAsHod}
                        onChange={(e) => setCanApproveAsHod(e.target.checked)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="canApproveAsHof"
                      label="Can approve as a Head of finance"
                    >
                      <Checkbox
                        disabled
                        defaultChecked={user?.permissions.canApproveAsHof}
                        onChange={(e) => setCanApproveAsHof(e.target.checked)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="canApproveAsPM"
                      label="Can approve as a Procurement manager"
                    >
                      <Checkbox
                        disabled
                        defaultChecked={user?.permissions.canApproveAsPM}
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
}
