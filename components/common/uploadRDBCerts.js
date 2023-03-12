import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";

function UploadRDCerts({ label, uuid, setSelected}) {
  const [messageApi, contextHolder] = message.useMessage();
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

  const props = {
    beforeUpload: (file) => {
      let isPDF = file.type == "application/pdf";
      if (!isPDF) {
        messageApi.error(`${file.name} is not a PDF file`);
        setSelected(false)
      } else{
        setSelected(true)
      }
      return isPDF || Upload.LIST_IGNORE;
    },
    action: `${url}/uploads/rdbCerts?id=${uuid}`,
    headers: {
      Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
      "Content-Type": "application/json",
    },
    listType: "document",
    previewFile(file) {
      setSelected(true)
      console.log("Your upload file:", file);
      // Your process logic. Here we just mock to the same file
      return fetch(`${url}/users/`, {
        method: "GET",
        body: file,
        headers: {
          Authorization:
            "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  };
  return (
    <>
      {contextHolder}
      <Upload {...props} headers={{}}>
        <Button icon={<UploadOutlined />}>{label ? label : "Upload"}</Button>
      </Upload>
    </>
  );
}
export default UploadRDCerts;
