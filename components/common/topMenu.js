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

const TopMenu = ({ setScreen, screen, handleLogout }) => {
  const [current, setCurrent] = useState(screen);
  const [items, setItems] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
  }, [screen]);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    let _items = [];
    _items = [
      {
        label: (
          <Image
            alt=""
            
            src="/favicon.png"
            width={30}
            height={30}
          />
        ),
        key: "dashboard",
        // icon: <LogoutOutlined className="text-red-400" />,
        // style: { marginTop: "5px" },
        // onClick: logout,
      },
      {
        // key: "username",
        label: `Hi, ${
          user.userType === "VENDOR" ? user?.contactPersonNames : user?.firstName
        } (${user?.userType.toLowerCase()})`,
        icon: <UserOutlined />,
        style: { marginLeft: "auto" },
        children: [
          {
            label: 'My Profile',
            key: 'setting:1',
          },
        ],
        // onClick: logout,
      },
      {
        key: "logout",
        label: "Logout",
        danger: true,
        icon: <LogoutOutlined className="text-red-400" />,
        // style: { marginLeft: "auto" },
        // onClick: logout,
      },
    ];

    setItems(_items);
  }, []);

  const logout = () => {
    handleLogout(true);
    localStorage.removeItem("user");
    Router.push("/").then(() => {
      setTimeout(() => {
        handleLogout(false);
      }, 3000);
    });
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
      className="w-screen"
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      theme="light"
      items={items}
      style={{ position: 'sticky', zIndex: 1, width: '100%' }}
    />
  );
};

export default TopMenu;
