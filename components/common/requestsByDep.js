import React, { useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, message, Row, Statistic } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
);

export default function RequestsByDep() {
  let [byDep, setByDepData] = useState(null);
  let [byCat, setByCatData] = useState(null);
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  const [messageApi, contextHolder] = message.useMessage();

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
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
                "rgba(153, 102, 255, 0.5)",
                "rgba(255, 159, 64, 0.5)",
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
          content: JSON.stringify(err),
        });
      });

    fetch(`${url}/requests/countsByCat`, {
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
                "rgba(255, 159, 64, 0.5)",
                "rgba(153, 102, 255, 0.5)",
                "rgba(75, 192, 192, 0.5)",
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
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
          content: JSON.stringify(err),
        });
      });
  }, []);

  return (
    <div className="flex flex-row justify-between">

      <Card
        title="Requests by Department"
        size="default"
        className="w-full"
      >
        {byDep && <Pie data={byDep} />}
      </Card>
      
      {contextHolder}
    </div>
  );
}
