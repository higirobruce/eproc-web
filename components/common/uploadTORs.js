import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message, UploadFile } from "antd";

function UploadTORs({ label, uuid, fileList, setFileList }) {
  const [messageApi, contextHolder] = message.useMessage();
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList, uuid);
    },
    multiple: false,
    showUploadList: {
      showDownloadIcon: false,
    },
    beforeUpload: (file) => {
      let isPDF = file.type == "application/pdf";
      if (!isPDF) {
        messageApi.error(`${file.name} is not a PDF file`);
      }

      return isPDF || Upload.LIST_IGNORE;
    },
    action: `${url}/uploads/termsOfReference?id=${uuid}`,
    headers: {
      Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
      "Content-Type": "application/json",
    },
    listType: "document",
    previewFile(file) {
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
      <Upload {...props} headers={{}} maxCount={1}>
        <Button icon={<UploadOutlined />}>{label ? label : "Upload"}</Button>
      </Upload>
    </>
  );
}
export default UploadTORs;
