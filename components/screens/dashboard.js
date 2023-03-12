import { FileOutlined } from "@ant-design/icons";
import {
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  DocumentTextIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Typography, message } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CountCard from "../common/countCard";
import RequestStats from "../common/requestsStatistics";
import TendersStats from "../common/tendersStatistics";

export default function Dashboard({ user }) {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [requests, setRequests] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
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
        setRequests(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });

    loadContracts()
      .then((res) => res.json())
      .then((res) => {
        setContracts(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });

    loadPurchaseOrders()
      .then((res) => res.json())
      .then((res) => {
        setPurchaseOrders(res);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });

    loadVendors()
      .then((res) => res.json())
      .then((res) => {
        setVendors(res);
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

  async function loadContracts() {
    return fetch(`${url}/contracts/`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    });
  }

  async function loadPurchaseOrders() {
    return fetch(`${url}/purchaseOrders/`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    });
  }

  async function loadVendors() {
    return fetch(`${url}/users/vendors/`, {
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
        <div>
          <div className="grid md:grid-cols-5 gap-4 p-5">
          <div class="absolute opacity-10">
            <Image src='/icons/blue icon.png' width={962} height={900} />
          </div>
            <div>
              <CountCard
                title="Requests"
                count={requests?.length}
                icon={<DocumentIcon className="h-5 w-5" />}
                color="blue-400"
              />
            </div>

            <div>
              <CountCard
                title="Tenders"
                count={tenders?.length}
                icon={<DocumentCheckIcon className="h-5 w-5" />}
                color="blue-400"
              />
            </div>

            <div>
              <CountCard
                title="Contracts"
                count={contracts?.length}
                icon={<DocumentTextIcon className="h-5 w-5" />}
                color="blue-400"
              />
            </div>

            <div>
              <CountCard
                title="Purchase Orders"
                count={purchaseOrders?.length}
                icon={<DocumentDuplicateIcon className="h-5 w-5" />}
                color="blue-400"
              />
            </div>

            <div>
              <CountCard
                title="Vendors"
                count={vendors?.length}
                icon={<UsersIcon className="h-5 w-5" />}
                color="blue-400"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4 p-5 h-1/3">
            <RequestStats />
            <TendersStats />
          </div>
          
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <Image alt="" src="/dashboard_loading.gif" width={800} height={800} />
        </div>
      )}
    </>
  );
}
