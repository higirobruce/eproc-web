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

const TopMenu = ({setScreen}) => {
  const [current, setCurrent] = useState("mail");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const _items = [
      {
        label: <Image alt="" className="pt-3" src="/favicon.png" width={20} height={20} />,
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
        label: "User Requests",
        key: "requests",
        icon: <SolutionOutlined />,
        
      },

      {
        label: "RFPs - RFQs",
        key: "rfps",
        icon: <MessageOutlined />,
       
      },

      {
        label: "Contracts",
        key: "contracts",
        icon: <FileDoneOutlined />,
        
      },
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

    setItems(_items);
  }, []);

  const logout = () => {
    localStorage.removeItem('user')
    Router.push("/");
  };
  const onClick = (e) => {
    
    if(e.key==='logout'){
        logout();
    }else{
        setScreen(e.key)
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
