import { Button, Col, Divider, Empty } from "antd";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import TopMenu from "../components/common/topMenu";
import Contracts from "../components/screens/contracts";
import Dashboard from "../components/screens/dashboard";
import PurchaseOrders from "../components/screens/purchaseOrders";
import Reports from "../components/screens/reports";
import RequestToVendors from "../components/screens/rfps";
import UserRequests from "../components/screens/userRequests";
import Users from "../components/screens/users";
import Vendors from "../components/screens/vendors";

export default function Home() {
  const [screen, setScreen] = useState("dashboard");
    const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("user"))
  }, []);
  return (
    <>
      <Head>
        <title>EPROC</title>
        <meta name="description" content="the #1 e-procurement tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="h-screen">
        {loggedInUser && (
          <>
            <TopMenu setScreen={setScreen} />
            {screen === "dashboard" && <Dashboard />}
            {screen === "requests" && <UserRequests />}
            {screen === "tenders" && <RequestToVendors />}
            {screen === "contracts" && <Contracts />}
            {screen === "pos" && <PurchaseOrders />}
            {screen === "vendors" && <Vendors />}
            {screen === "users" && <Users />}
            {screen === "reports" && <Reports />}
          </>
        )}

        {!loggedInUser && (
          <div className="flex items-center justify-center h-screen">
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
                <Button type="link" onClick={()=> Router.push('/signup') }>Sign up</Button>
                <Divider plain>Or</Divider>
                <Button type="link" onClick={()=> Router.push('/') }>Login</Button>
              </Col>
            </Empty>
          </div>
        )}
      </main>
    </>
  );
}
