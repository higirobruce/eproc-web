import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Empty, Layout, Spin } from "antd";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import LoginForm from "../components/common/loginForm";
import LoginText from "../components/common/loginText";
import SideMenu from "../components/common/sideMenu";
import TopMenu from "../components/common/topMenu";
import Contracts from "../components/screens/contracts";
import Dashboard from "../components/screens/dashboard";
import Profile from "../components/screens/profile";
import PurchaseOrders from "../components/screens/purchaseOrders";
import Reports from "../components/screens/reports";
import Tenders from "../components/screens/tenders";
import UserRequests from "../components/screens/userRequests";
import Users from "../components/screens/users";
import Vendors from "../components/screens/vendors";

export default function Home() {
  let [screen, setScreen] = useState("");
  let [loggedInUser, setLoggedInUser] = useState(null);
  let [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("user"));
    let user = JSON.parse(localStorage.getItem("user"));
    if (user?.userType !== "VENDOR") setScreen("dashboard");
    else setScreen("tenders");
  }, []);
  return (
    <>
      <Head>
        <title>EPROC</title>
        <meta name="description" content="the #1 e-procurement tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        {loggedInUser && (
          <div className="flex flex-col h-full min-h-screen">
            <TopMenu
              setScreen={setScreen}
              screen={screen}
              handleLogout={(v) => setLoggingOut(v)}
            />
            <Layout>
              <div className="hidden md:flex">
                <Layout.Sider width={200}>
                  <SideMenu
                    setScreen={setScreen}
                    screen={screen}
                    user={JSON.parse(loggedInUser)}
                  />
                </Layout.Sider>
              </div>
              <Layout>
                <Layout.Content className="bg-gray-100 h-full">
                  <Spin
                    spinning={loggingOut}
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  >
                    {screen === "dashboard" && (
                      <Dashboard user={JSON.parse(loggedInUser)} />
                    )}
                    {screen === "requests" && (
                      <UserRequests user={JSON.parse(loggedInUser)} />
                    )}
                    {screen === "tenders" && (
                      <Tenders user={JSON.parse(loggedInUser)} />
                    )}
                    {screen === "contracts" && (
                      <Contracts user={JSON.parse(loggedInUser)} />
                    )}
                    {screen === "pos" && (
                      <PurchaseOrders user={JSON.parse(loggedInUser)} />
                    )}
                    {screen === "vendors" && (
                      <Vendors user={JSON.parse(loggedInUser)} />
                    )}
                    {screen === "users" && (
                      <Users user={JSON.parse(loggedInUser)} />
                    )}
                    {screen === "reports" && (
                      <Reports user={JSON.parse(loggedInUser)} />
                    )}
                    {screen === "setting:1" && (
                      <Profile user={JSON.parse(loggedInUser)} />
                    )}
                  </Spin>
                </Layout.Content>
              </Layout>
            </Layout>
          </div>
        )}

        {!loggedInUser && (
          <div className="grid md:grid-cols-3 bg-blue-500 w-screen text-white">
          <LoginText />
          <div>
            {" "}
            <LoginForm />
          </div>
        </div>
        )}
        
      </main>
    </>
  );
}

