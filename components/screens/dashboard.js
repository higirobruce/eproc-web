import { Typography, message } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import RequestStats from "../common/requestsStatistics";
import TendersStats from "../common/tendersStatistics";

export default function Dashboard() {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [requests, setRequests] = useState([]);
  const [tenders, setTenders] = useState([]);
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    loadTenders()
      .then((res) => res.json())
      .then((res) => {
        setTenders(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });

    loadRequests()
      .then((res) => res.json())
      .then((res) => {
        setRequests(res)
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });
  }, []);

  async function loadTenders() {
    return fetch(`${url}/tenders/`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    });
  }
  async function loadRequests() {
    return fetch(`${url}/requests/`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    });
  }
  return (
    <>
      {contextHolder}
      {dataLoaded ? (
        <div className="grid grid-cols-2 p-5 gap-10">
          <div className="p-5 ">
            <Typography.Title level={5}>Requests</Typography.Title>
            <RequestStats totalRequests={requests?.length} />
          </div>
          <div className="p-5">
            <Typography.Title level={5}>Tenders</Typography.Title>
            <TendersStats totalTenders={tenders?.length} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 overflow-x-scroll">
          <Image alt="" src="/dashboard_loading.gif" width={800} height={800} />
        </div>
      )}
    </>
  );
}
