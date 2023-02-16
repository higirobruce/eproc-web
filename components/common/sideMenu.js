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

const SideMenu = ({ setScreen, screen }) => {
  const [current, setCurrent] = useState(screen);
  const [items, setItems] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {}, [screen]);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    let _items = [];
    if (user?.userType !== "VENDOR") {
      _items = [
        {
          label: "Dashboard",
          key: "dashboard",
          icon: <PieChartOutlined />,
        },

        {
          label: "Requests",
          key: "requests",
          icon: <SolutionOutlined />,
        },

        {
          label: "Tenders",
          key: "tenders",
          icon: <MessageOutlined />,
        },

        // {
        //   label: "Contracts",
        //   key: "contracts",
        //   icon: <FileDoneOutlined />,

        // },
        {
          label: "Purchase Orders",
          key: "pos",
          icon: <OrderedListOutlined />,
        },

        {
          label: "Vendors",
          key: "vendors",
          icon: <UsergroupAddOutlined />,
        },
        {
          type: "divider",
        },

        {
          label: "Internal Users",
          key: "users",
          icon: <UserOutlined />,
        },
        // {
        //   label: "Reports",
        //   key: "reports",
        //   icon: <CopyOutlined />,
        // },
        {
          type: "divider",
        },
        // {
        //   key: "logout",
        //   label:"Logout",
        //   danger:true,
        //   icon: <LogoutOutlined className="text-red-400" />,
        //   // style: { marginTop: "480px"},
        //   // onClick: logout,
        // },
      ];
    } else {
      _items = [
        {
          label: "Tenders",
          key: "tenders",
          icon: <MessageOutlined />,
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
      style={{
        height: "100%",
        // borderRight: 0,
      }}
      selectedKeys={[current]}
      mode="vertical"
      items={items}
    />
  );
};

export default SideMenu;
