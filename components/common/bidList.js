import React, { useEffect, useState } from "react";
import { Avatar, Button, Empty, List, message, Tag } from "antd";
import VirtualList from "rc-virtual-list";
import moment from "moment";
import {
  FileOutlined,
  FileTextOutlined,
  FolderViewOutlined,
} from "@ant-design/icons";
const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";

const BidList = ({ tenderId, handleSelectBid, refresh }) => {
  const [data, setData] = useState(null);
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [ContainerHeight, setContainerHeight] = useState(50);

  const appendData = () => {
    fetch(`${url}/submissions/byTender/${tenderId}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        setData(body);
        if (body?.length >= 1) setContainerHeight(340);
        else setContainerHeight(50);
      });
  };

  useEffect(() => {
    appendData();
  }, [refresh]);
  useEffect(() => {
    appendData();
  }, [tenderId]);
  const onScroll = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData();
    }
  };
  return (
    <>
      {data && (
        <List size="small">
          <VirtualList
            data={data}
            height={ContainerHeight}
            itemHeight={47}
            itemKey="number"
            onScroll={onScroll}
          >
            {(item) => (
              <List.Item key={item?.number}>
                <List.Item.Meta
                  //   avatar={<Avatar src={item.picture.large} />}
                  title={<a href="#">{item.number}</a>}
                  description={
                    <>
                      <div className="text-xs text-gray-400">
                        {item?.createdBy?.companyName}
                      </div>
                      <a href="#">
                        <FileTextOutlined />{" "}
                      </a>
                    </>
                  }
                />
                <div className="flex flex-row items-end space-x-10 justify-between">
                  <div className="flex flex-row space-x-2">
                    <div className="flex flex-col">
                      <div className="flex flex-row space-x-2">
                        <div className="text-xs font-bold text-gray-500">
                          Price:
                        </div>
                        <div className="text-xs text-gray-400">
                          {item?.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-row space-x-2">
                        <div className="text-xs font-bold text-gray-500">
                          Discount:
                        </div>
                        <div className="text-xs text-gray-400">
                          {item?.discount}%
                        </div>
                      </div>

                      <div className="flex flex-row space-x-2">
                        <div className="text-xs font-bold text-gray-500">
                          Delivery date:
                        </div>
                        <div className="text-xs text-gray-400">
                          {moment(item?.deliveryDate).format("YYYY-MMM-DD")}
                        </div>
                      </div>

                      <div className="flex flex-row space-x-2">
                        <div>
                          {item?.status === "pending" && (
                            <Tag color="blue">{item?.status}</Tag>
                          )}
                          {item?.status === "selected" && (
                            <Tag color="green">{item?.status}</Tag>
                          )}
                          {item?.status === "rejected" && (
                            <Tag color="red">{item?.status}</Tag>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {item?.status === "pending" && (
                    
                    <Button
                      size="small"
                      onClick={() => handleSelectBid(item._id)}
                    >
                      Select Bid
                    </Button>
                  )}

                  {item?.status !== "pending" && (
                    <Button
                      size="small"
                      disabled
                    //   onClick={() => handleSelectBid(item._id)}
                    >
                      Select Bid
                    </Button>
                  )}
                </div>
              </List.Item>
            )}
          </VirtualList>
        </List>
      )}

      {(!data || data.length < 1) && <Empty />}
    </>
  );
};
export default BidList;
