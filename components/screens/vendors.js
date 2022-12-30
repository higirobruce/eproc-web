import { Grid, Typography,Col, Divider, Row } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import VendorsTable from "../vendorsTable";
import MSteps from "../common/mSteps";
import _ from "lodash";
import OverviewWindow from "../common/overviewWindow";
export default function Vendors() {
  const [dataLoaded, setDataLoaded] = useState(false);
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [dataset, setDataset] = useState([]);
  let [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    fetch(`${url}/users/vendors`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDataLoaded(true);
        setDataset(res);
      });
  }, []);

  useEffect(() => {
    setUpdatingId("");
    console.log(dataset);
  }, [dataset]);

  function approveUser(id) {
    setUpdatingId(id);
    fetch(`${url}/users/approve/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let _data = [...dataset];

        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(_data, { _id: id });
        let elindex = _data[index];
        elindex.status = "approved";

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
      });
  }

  function declineUser(id) {
    setUpdatingId(id);
    fetch(`${url}/users/decline/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let _data = [...dataset];

        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(_data, { _id: id });
        let elindex = _data[index];
        elindex.status = "declined";

        console.log(_data[index]);
        // Replace item at index using native splice
        _data.splice(index, 1, elindex);

        setDataset(_data);
      });
  }

  return (
    <>
      {dataLoaded ? (
        <div className="flex flex-col mx-10 transition-opacity ease-in-out duration-1000">
          <Typography.Title level={3}>Vendors List</Typography.Title>
          <Row className="flex flex-row space-x-5">
            <Col flex={4}>
              <VendorsTable
                dataSet={dataset}
                handleApproveUser={approveUser}
                handleDeclineUser={declineUser}
                updatingId={updatingId}
              />
            </Col>
            {/* <Col flex={1}><OverviewWindow/></Col> */}
          </Row>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen transition-opacity ease-in-out duration-300">
          <Image alt="" src="/people_search.svg" width={600} height={600} />
        </div>
      )}
    </>
  );
}
