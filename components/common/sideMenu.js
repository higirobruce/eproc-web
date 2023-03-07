import React, { useEffect, useState } from "react";
import {
  CopyOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  MessageOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Router from "next/router";
import Image from "next/image";

const SideMenu = ({ setScreen, screen, user }) => {
  const [current, setCurrent] = useState(screen);
  const [items, setItems] = useState([]);
  useEffect(() => {}, [screen]);

  useEffect(() => {
    let _items = [];
    if (user?.userType !== "VENDOR") {
      _items = [];
      if (user?.permissions?.canViewDashboard) {
        _items.push({
          label: "Dashboard",
          key: "dashboard",
          icon: <PieChartOutlined />,
        });
      }

      if (user?.permissions?.canViewRequests) {
        _items.push({
          label: "Requests",
          key: "requests",
          icon: <SolutionOutlined />,
        });
      }

      if (user?.permissions?.canViewTenders) {
        _items.push({
          label: "Tenders",
          key: "tenders",
          icon: <MessageOutlined />,
        });
      }

      if (user?.permissions?.canViewContracts) {
        _items.push({
          label: "Contracts",
          key: "contracts",
          icon: <FileDoneOutlined />,
        });
      }

      if (user?.permissions?.canViewPurchaseOrders) {
        _items.push({
          label: "Purchase Orders",
          key: "pos",
          icon: <OrderedListOutlined />,
        });
      }

      if (user?.permissions?.canViewVendors) {
        _items.push({
          label: "Vendors",
          key: "vendors",
          icon: <UsergroupAddOutlined />,
        });
      }

      if (user?.permissions?.canViewUsers) {
        _items.push({
          type: "divider",
        });

        _items.push({
          label: "Internal Users",
          key: "users",
          icon: <UserOutlined />,
        },)
      }


    } else {
      _items = [
        {
          label: "Tenders",
          key: "tenders",
          icon: <MessageOutlined />,
        },
        {
          label: "My Contracts",
          key: "contracts",
          icon: <FileDoneOutlined />,
        },
        {
          label: "My Purchase Orders",
          key: "pos",
          icon: <OrderedListOutlined />,
        },
        // {
        //   key: "logout",
        //   label:"Logout",
        //   danger: true,
        //   icon: <LogoutOutlined className="text-red-400" />,
        //   // style: { marginTop: "780px", color:"#F97B7B"},
        //   // onClick: logout,
        // },
      ];
    }

    setItems(_items);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    Router.push("/");
  };
  const onClick = (e) => {
    if (e.key === "logout") {
      logout();
    } else {
      setScreen(e.key);
    }
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      className="h-full"
      style={{
        // height: "100%",
        // borderRight: 0,
      }}
      selectedKeys={[current]}
      mode="vertical"
      items={items}
    />
  );
};

export default SideMenu;
