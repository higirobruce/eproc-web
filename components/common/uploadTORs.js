import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message, UploadFile } from "antd";

function UploadTORs({ label, uuid, fileList, setFileList }) {
  const [messageApi, contextHolder] = message.useMessage();
  let url = process.env.NEXT_PUBLIC_BKEND_URL;
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
  let [uploading, setUploading] = useState(false);
  let [files, setFiles] = useState([]);

  const handleUpload = () => {
    const formData = new FormData();
    files.forEach((file) => {
      
      formData.append("files[]", file);
    });
    setUploading(true);
    // You can use any AJAX library you like
    fetch(`${url}/uploads/termsOfReference/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
        // "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => res.json())
      .then((savedFiles) => {
        let _files = savedFiles?.map(f=>{
          return f?.filename
        })
        let _fileList = [...fileList]
        _fileList.push(_files)

        setFileList(_fileList)
        setFiles([]);
        messageApi.success("upload successfully.");
      })
      .catch((err) => {
        console.log(err);
        messageApi.error("upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props = {
    onRemove: (file) => {
      const index = fileList[uuid].indexOf(file);
      const newFileList = fileList[uuid].slice();
      newFileList.splice(index, 1);
      setFileList(newFileList, uuid);

      const _index = files.indexOf(file);
      const _newFileList = files.slice();
      _newFileList.splice(index, 1);
      setFiles(_newFileList);

    },
    // multiple: false,
    // showUploadList: {
    //   showDownloadIcon: false,
    // },
    beforeUpload: (file) => {
      let isPDF = file.type == "application/pdf";
      if (!isPDF) {
        messageApi.error(`${file.name} is not a PDF file`);
      }
      // let _fileList = fileList[uuid] ? [...fileList[uuid]] : [];
      
      // _fileList.push(file);
      // setFileList(_fileList, uuid);
      setFiles([...files, file]);
      return isPDF || Upload.LIST_IGNORE;
    },
    // action: `${url}/uploads/termsOfReference?id=23232`,
    headers: {
      Authorization: "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
      "Content-Type": "application/json",
    },
    // listType: "document",
    files,
    // previewFile(file) {
    //   console.log("Your upload file:", file);
    //   // Your process logic. Here we just mock to the same file
    //   return fetch(`${url}/users/`, {
    //     method: "GET",
    //     body: file,
    //     headers: {
    //       Authorization:
    //         "Basic " + window.btoa(`${apiUsername}:${apiPassword}`),
    //       "Content-Type": "application/json",
    //     },
    //   })
    //     .then((res) => res.json())
    //     .then(({ thumbnail }) => thumbnail);
    // },
  };
  return (
    <>
      {contextHolder}
      <Upload {...props} name='nemaeTEst' headers={{}}>
        <Button icon={<UploadOutlined />}>{label ? label : "Upload"}</Button>
      </Upload>

      <Button
        type="primary"
        onClick={handleUpload}
        disabled={files.length === 0}
        loading={uploading}
        style={{
          marginTop: 16,
        }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </>
  );
}
export default UploadTORs;
