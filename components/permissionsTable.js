import { Checkbox, Space, Table, Tag } from "antd";

function PermissionsTable({
  canViewRequests,
  canCreateRequests,
  canEditRequests,
  canApproveRequests,
  canViewTenders,
  canCreateTenders,
  canEditTenders,
  canApproveTenders,
  canViewBids,
  canCreateBids,
  canEditBids,
  canApproveBids,
  canViewContracts,
  canCreateContracts,
  canEditContracts,
  canApproveContracts,
  canViewPurchaseOrders,
  canCreatePurchaseOrders,
  canEditPurchaseOrders,
  canApprovePurchaseOrders,
  canViewVendors,
  canCreateVendors,
  canEditVendors,
  canApproveVendors,
  canViewUsers,
  canCreateUsers,
  canEditUsers,
  canApproveUsers,
  canViewDashboard,
  canCreateDashboard,
  canEditDashboard,
  canApproveDashboard,
  handleSetCanView,
  handleSetCanCreated,
  handleSetCanEdit,
  handleSetCanApprove,
  canNotEdit
}) {
  const columns = [
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "View",
      //   dataIndex: "view",
      key: "view",
      render: (_, row) => {
        return <Checkbox disabled={canNotEdit} defaultChecked={row?.view} onChange={(e) => handleSetCanView(e.target.checked, row?.alias)} />;
      },
    },
    {
      title: "Create",
      //   dataIndex: "create",
      key: "create",
      render: (_, row) => {
        return <Checkbox disabled={canNotEdit}defaultChecked={row?.create} onChange={(e) => handleSetCanCreated(e.target.checked,row?.alias)} />;
      },
    },
    {
      title: "Edit",
      //   dataIndex: "edit",
      key: "edit",
      render: (_, row) => {
        return <Checkbox disabled={canNotEdit} defaultChecked={row?.edit} onChange={(e) => handleSetCanEdit(e.target.checked,row?.alias)} />;
      },
    },

    {
      title: "Approve",
      //   dataIndex: "approve",
      key: "approve",
      render: (_, row) => {
        return <Checkbox disabled={canNotEdit} defaultChecked={row?.approve} onChange={(e) => handleSetCanApprove(e.target.checked,row?.alias)} />;
      },
    },
  ];
  const data = [
    {
      key: "1",
      module: "Requests",
      alias: "Requests",
      view: canViewRequests,
      create: canCreateRequests,
      edit: canEditRequests,
      approve: canApproveRequests,
    },
    {
      key: "2",
      module: "Tenders",
      alias: "Tenders",
      view: canViewTenders,
      create: canCreateTenders,
      edit: canEditTenders,
      approve: canApproveTenders,
    },
    {
      key: "3",
      module: "Bids",
      alias: "Bids",
      view: canViewBids,
      create: canCreateBids,
      edit: canEditBids,
      approve: canApproveBids,
    },
    {
      key: "4",
      module: "Contracts",
      alias: "Contracts",
      view: canViewContracts,
      create: canCreateContracts,
      edit: canEditContracts,
      approve: canApproveContracts,
    },
    {
      key: "5",
      module: "Purchase Orders",
      alias: "PurchaseOrders",
      view: canViewPurchaseOrders,
      create: canCreatePurchaseOrders,
      edit: canEditPurchaseOrders,
      approve: canApprovePurchaseOrders,
    },
    {
      key: "6",
      module: "Vendors",
      alias: "Vendors",
      view: canViewVendors,
      create: canCreateVendors,
      edit: canEditVendors,
      approve: canApproveVendors,
    },
    {
      key: "7",
      module: "Users",
      alias: "Users",
      view: canViewUsers,
      create: canCreateUsers,
      edit: canEditUsers,
      approve: canApproveUsers,
    },
    {
      key: "8",
      module: "Dashboard",
      alias: "Dashboard",
      view: canViewDashboard,
      create: canCreateDashboard,
      edit: canEditDashboard,
      approve: canApproveDashboard,
    },
  ];
  return <Table columns={columns} dataSource={data} size="small" />;
}
export default PermissionsTable;
