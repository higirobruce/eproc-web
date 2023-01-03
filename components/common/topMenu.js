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

const TopMenu = ({ setScreen, screen }) => {
  const [current, setCurrent] = useState(screen);
  const [items, setItems] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(()=>{},[screen])

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    let _items = [];
    if (user.userType !== "VENDOR") {
      _items = [
        {
          label: (
            <Image
              alt=""
              className="pt-3"
              src="/favicon.png"
              width={20}
              height={20}
            />
          ),
          key: "logo",
          // icon: <LogoutOutlined className="text-red-400" />,
          // style: { marginLeft: "auto" },
          // onClick: logout,
        },
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
          label: "Internal Users",
          key: "users",
          icon: <UserOutlined />,
        },
        {
          label: "Reports",
          key: "reports",
          icon: <CopyOutlined />,
        },
        {
          key: "logout",
          icon: <LogoutOutlined className="text-red-400" />,
          style: { marginLeft: "auto" },
          // onClick: logout,
        },
      ];
    } else {
      _items = [
        {
          label: <Image alt="" className="pt-3" src="/favicon.png" width={20} height={20} />,
          key: "logo",
          // icon: <LogoutOutlined className="text-red-400" />,
          // style: { marginLeft: "auto" },
          // onClick: logout,
        },
       
        {
          label: "Tenders",
          key: "tenders",
          icon: <MessageOutlined />,
         
        },
        {
          key: "logout",
          icon: <LogoutOutlined className="text-red-400" />,
          style: { marginLeft: "auto" },
          // onClick: logout,
        },
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
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default TopMenu;
