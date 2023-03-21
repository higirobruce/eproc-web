import { FileOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  DocumentTextIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Typography, message, Spin, Divider } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CountCard from "../common/countCard";
import RequestsByDep from "../common/requestsByDep";
import RequestsByStatus from "../common/requestsByStatus";
import RequestStats from "../common/requestsStatistics";
import TendersByDep from "../common/tendersByDep";
import TendersStats from "../common/tendersStatistics";

export default function Dashboard({ user }) {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [requests, setRequests] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [budgeted, setBudgeted] = useState(0);
  const [unbudgeted, setUnbudgeted] = useState(0);
  const [openTenders, setOpenTenders] = useState(0);
  const [closedTenders, setClosedTenders] = useState(0);
  const [avgBids, setAvgBids] = useState(0);

  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    loadTenders()
      .then((res) => res.json())
      .then((res) => {
        setTenders(res);
        loadAvgBidsPerTender()
          .then((res) => res.json())
          .then((res) => {
            // alert(JSON.stringify(res))
            setAvgBids(res[0]?.avg);
          });
        loadTendersStats()
          .then((res) => res.json())
          .then((res) => {
            setOpenTenders(Math.round((res?.open / res?.total) * 100));
            setClosedTenders(Math.round((res?.closed / res?.total) * 100));
          });
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
        loadRequestsByBudgetStatus()
          .then((res) => res.json())
          .then((resBudg) => {
            let _budgeted = resBudg?.filter((r) => r._id === true);
            let _unbudgeted = resBudg?.filter((r) => r._id === false);
            let total = setBudgeted(
              Math.round((_budgeted[0]?.count / res?.length) * 100)
            );
            setUnbudgeted(
              Math.round((_unbudgeted[0]?.count / res?.length) * 100)
            );
          });
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

  async function loadRequestsByBudgetStatus() {
    return fetch(`${url}/requests/countsByBudgetStatus`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    });
  }

  async function loadAvgBidsPerTender() {
    return fetch(`${url}/submissions/avgBidsPerTender`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    });
  }

  async function loadTendersStats() {
    return fetch(`${url}/tenders/stats`, {
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
          <div className="grid md:grid-cols-5 gap-4 m-5 p-5 bg-white rounded-md shadow-md">
            <div className="col-span-5 text-xl font-bold">Requests</div>
            <RequestStats />
            <RequestsByDep />
            <div className="col-span-2">
              <RequestsByStatus />
            </div>
            <div className="flex flex-col space-y-2">
              <div className="text-xs font-bold">
                Breakdown by Budgeted vs Unbudgeted
              </div>
              <div className="flex flex-row justify-between items-center pt-5">
                <div className="flex flex-row space-x-2 items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">Budgeted</div>
                </div>
                <div className="text-xs text-gray-600">{budgeted}%</div>
              </div>
              <Divider></Divider>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-2 items-center">
                  <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                  <div className="text-sm text-gray-600">Unbudgeted</div>
                </div>

                <div className="text-xs text-gray-600">{unbudgeted}%</div>
              </div>
            </div>
            {/* <TendersStats />
            <TendersByDep/> */}
          </div>

          <div className="grid md:grid-cols-5 gap-4 m-5 p-5 bg-white rounded-md shadow-md">
            <div className="col-span-5 text-xl font-bold">Tenders</div>

            <TendersStats />
            <TendersByDep />
            <div className="flex flex-col space-y-2">
              <div className="text-xs font-bold">Breakdown by Status</div>
              <div className="flex flex-row justify-between items-center pt-5">
                <div className="flex flex-row space-x-2 items-center">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">Open</div>
                </div>
                <div className="text-xs text-gray-600">{openTenders}%</div>
              </div>
              <Divider></Divider>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-2 items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <div className="text-sm text-gray-600">Closed</div>
                </div>
                <div className="text-xs text-gray-600">{closedTenders}%</div>
              </div>
              

              <div className="pt-5">
                <div className="text-xs font-bold"> {avgBids} bid(s) submitted per Tender on Average</div>
               
              </div>
            </div>
          </div>

          {/* <div class="absolute opacity-10 top-0 z-20">
              <Image src="/icons/blue icon.png" width={962} height={900} />
            </div> */}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 h-screen">
          <Spin
            indicator={
              <LoadingOutlined
                className="text-gray-500"
                style={{ fontSize: 42 }}
                spin
              />
            }
          />
        </div>
      )}
    </>
  );
}
