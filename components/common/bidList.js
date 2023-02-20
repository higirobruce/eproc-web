import React, { useEffect, useState } from "react";
import { Avatar, Button, Empty, Form, List, message, Modal, Tag, Typography } from "antd";
import VirtualList from "rc-virtual-list";
import moment from "moment";
import {
  FileOutlined,
  FileTextOutlined,
  FolderViewOutlined,
} from "@ant-design/icons";
import UploadFiles from "./uploadFiles";
import {
  CheckCircleIcon,
  MinusCircleIcon,
  UserCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";

const BidList = ({
  tenderId,
  handleSelectBid,
  refresh,
  handleAwardBid,
  handleSetBidList,
  canSelectBid,
  comitee,
}) => {
  const [data, setData] = useState(null);
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [selectedBid, setSelectedBid] = useState(null);
  let [ContainerHeight, setContainerHeight] = useState(0);
  let [openSelectBid, setOpenSelectBid] = useState(false);

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
        handleSetBidList(body);
        if (body?.length >= 2) setContainerHeight(200);
        else if (body?.length == 1) setContainerHeight(200);
        else setContainerHeight(0);
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
            // height={ContainerHeight}
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
                    <div className="grid grid-cols-6">
                      <div>
                        <div className="text-xs text-gray-600">
                          {item?.createdBy?.companyName}
                        </div>
                        <a href="#">
                          <FileTextOutlined />{" "}
                        </a>
                      </div>

                      <div className="">
                        <div className="text-xs text-gray-400">Price</div>
                        <div className="text-xs text-gray-600">
                          {item?.price.toLocaleString() + " " + item?.currency}
                        </div>
                      </div>

                      <div className="">
                        <div className="text-xs text-gray-400">Discount</div>
                        <div className="text-xs text-gray-600">
                          {item?.discount}%
                        </div>
                      </div>

                      <div className="">
                        <div className="text-xs text-gray-400">
                          Delivery date
                        </div>
                        <div className="text-xs text-gray-600">
                          {moment(item?.deliveryDate).fromNow()}
                        </div>
                      </div>

                      <div className="">
                        <div>
                          {item?.status === "pending" && (
                            <Tag color="blue">{item?.status}</Tag>
                          )}
                          {item?.status === "selected" && (
                            <Tag color="green">{item?.status}</Tag>
                          )}
                          {item?.status === "awarded" && (
                            <>
                              <Tag color="green">selected</Tag>
                              <Tag color="green">{item?.status}</Tag>
                            </>
                          )}
                          {item?.status === "not awarded" && (
                            <>
                              <Tag color="red">not selected</Tag>
                              <Tag color="red">{item?.status}</Tag>
                            </>
                          )}
                        </div>
                      </div>

                      {item?.status === "pending" && (
                        <>
                          <Button
                            size="small"
                            type="primary"
                            disabled={!canSelectBid}
                            onClick={() => {
                              setSelectedBid(item._id);
                              setOpenSelectBid(true);
                            }}
                          >
                            Select Bid
                          </Button>
                        </>
                      )}

                      {item?.status === "selected" && (
                        <>
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => handleAwardBid(item._id)}
                          >
                            Award Bid
                          </Button>
                        </>
                      )}

                      {/* {(item?.status === "not selected" || item?.status === "not awarded") && (
                    <Button
                      size="small"
                      disabled
                      //   onClick={() => handleSelectBid(item._id)}
                    >
                      Select Bid
                    </Button>
                  )} */}
                    </div>
                  }
                />
                <div className="flex flex-row items-end space-x-10 justify-between">
                  <div className="flex flex-row space-x-2">
                    <div className="flex flex-col"></div>
                  </div>
                </div>
              </List.Item>
            )}
          </VirtualList>
        </List>
      )}

      {(!data || data.length < 1) && <Empty />}

      {selectBidModal()}
    </>
  );

  function selectBidModal() {
    return (
      <Modal
        title="Select Bid"
        centered
        open={openSelectBid}
        onOk={() => {
          setOpenSelectBid(false);
          handleSelectBid(selectedBid);
        }}
        width={"30%"}
        okText="Save and Submit"
        onCancel={() => setOpenSelectBid(false)}
        // bodyStyle={{ maxHeight: "700px", overflow: "scroll" }}
      >
        <Form>
          <div className="flex flex-col">
            <Typography.Title level={4}>Please upload the evaluation report.</Typography.Title>
            <Form.Item>
              <UploadFiles label="Select the file!" />
            </Form.Item>

            <Typography.Title level={4}>Please mention evaluation results.</Typography.Title>
            <div className="grid grid-cols-2 gap-3 pb-5">
              {comitee?.map((c) => {
                return (
                  <>
                    <div
                      key={c}
                      className="flex flex-row space-x-5 items-center text-sm"
                    >
                      {c}
                    </div>
                    <div className="flex flex-row space-x-2 items-center">
                      <CheckCircleIcon className="cursor-pointer h-5 w-5 text-green-500" />
                      <XCircleIcon className="cursor-pointer h-5 w-5 text-red-500" />
                      <MinusCircleIcon className="cursor-pointer h-5 w-5 text-yellow-500" />
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
};
export default BidList;
