import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Empty, Layout, Spin } from "antd";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import SideMenu from "../components/common/sideMenu";
import TopMenu from "../components/common/topMenu";
import Contracts from "../components/screens/contracts";
import Dashboard from "../components/screens/dashboard";
import PurchaseOrders from "../components/screens/purchaseOrders";
import Reports from "../components/screens/reports";
import Tenders from "../components/screens/tenders";
import UserRequests from "../components/screens/userRequests";
import Users from "../components/screens/users";
import Vendors from "../components/screens/vendors";

export default function Home() {
  let [screen, setScreen] = useState("dashboard");
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
          <div className="flex flex-col pb-5 h-screen bg-white">
            <TopMenu
              setScreen={setScreen}
              screen={screen}
              handleLogout={(v) => setLoggingOut(v)}
            />
            <Layout>
              <div className="hidden md:flex">
                <Layout.Sider style={{ height: "100%" }} width={200}>
                  <SideMenu setScreen={setScreen} screen={screen} />
                </Layout.Sider>
              </div>
              <Layout>
                <Layout.Content className="bg-gray-50">
                  <Spin
                    spinning={loggingOut}
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  >
                    {screen === "dashboard" && <Dashboard />}
                    {screen === "requests" && <UserRequests />}
                    {screen === "tenders" && <Tenders />}
                    {screen === "contracts" && <Contracts />}
                    {screen === "pos" && <PurchaseOrders />}
                    {screen === "vendors" && <Vendors />}
                    {screen === "users" && <Users />}
                    {screen === "reports" && <Reports />}
                  </Spin>
                </Layout.Content>
              </Layout>
            </Layout>
          </div>
        )}

        {!loggedInUser && (
          <div className="flex flex-row items-center justify-center h-screen w-full">
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={
                <span>Oups! You are not authorized to access the app!</span>
              }
            >
              <Col>
                <Button type="link" onClick={() => Router.push("/signup")}>
                  Sign up
                </Button>
                <Divider plain>Or</Divider>
                <Button type="link" onClick={() => Router.push("/")}>
                  Login
                </Button>
              </Col>
            </Empty>
          </div>
        )}
      </main>
    </>
  );
}
