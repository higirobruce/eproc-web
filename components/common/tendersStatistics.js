import React, { useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

export default function TendersStats({totalTenders, totalBids}) {

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Total Tenders"
            value={totalTenders}
            // precision={2}
            valueStyle={{
              color: "#3f8600",
            }}
            //   prefix={<ArrowUpOutlined />}
            //   suffix="%"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Total Bids"
            value={totalBids}
            // precision={2}
            valueStyle={{
              color: "#2299FF",
            }}
            //   prefix={<ArrowDownOutlined />}
            //   suffix="%"
          />
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
