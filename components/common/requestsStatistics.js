import React, { useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function RequestStats({ totalRequests, totalBids }) {
  let [byDep, setByDepData] = useState(null);
  let [byCat, setByCatData] = useState(null);
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

  useEffect(() => {
    fetch(`${url}/requests/countsByDep`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        let values = res.map((r) => {
          return r.totalCount;
        });
        let lables = res.map((r) => {
          return r._id;
        });

        let d = {
          labels: lables,
          datasets: [
            {
              label: "# of Counts",
              data: values,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };

        setByDepData(d);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Something happened! Please try again.",
        });
      });

      fetch(`${url}/tenders/countsByCat`, {
        method: "GET",
        headers: {
          Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          let values = res.map((r) => {
            return r.totalCount;
          });
          let lables = res.map((r) => {
            return r._id;
          });
  
          let d = {
            labels: lables,
            datasets: [
              {
                label: "# of Counts",
                data: values,
                backgroundColor: [
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 159, 64, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
              },
            ],
          };
  
          setByCatData(d);
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "Something happened! Please try again.",
          });
        });
  }, []);
  
  return (
    <Row gutter={[16, 16]}>
      
      {/* <Col>
        <Card title="Counts by Category" size="small" className="shadow-xl">
          {byCat && <Pie height={100} width={250} data={byCat}  />}
        </Card>
      </Col> */}
      <Col span={6} className="flex flex-col justify-between">
        <Card className="shadow-xl" style={{width:150}}>
          <Statistic
            title="Total Requests"
            value={totalRequests}
            // precision={2}
            valueStyle={{
              color: "#2299FF",
            }}
            //   prefix={<ArrowDownOutlined />}
            //   suffix="%"
          />
        </Card>

        
      </Col>

      <Col>
        <Card title="Counts by Department" size="small" className="shadow-xl">
          {byDep && <Pie width={30} data={byDep} />}
        </Card>
      </Col>

      
      {/* <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Closed"
            value={closed}
            precision={2}
            valueStyle={{
              color: "#cf1322",
            }}
            //   prefix={<ArrowDownOutlined />}
            //   suffix="%"
          />
        </Card>
      </Col> */}
    </Row>
  );
}
