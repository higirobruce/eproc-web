import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
const props = {
  action: '//jsonplaceholder.typicode.com/posts/',
  listType: 'document',
  previewFile(file) {
    console.log('Your upload file:', file);
    // Your process logic. Here we just mock to the same file
    return fetch('https://run.mocky.io/v3/41beb3f4-f4b1-46a5-8214-e1ecc5e23139', {
      method: 'POST',
      body: file,
    })
      .then((res) => res.json())
      .then(({ thumbnail }) => thumbnail);
  },
};
const UploadFiles = ({label}) => (
  <Upload {...props}>
    <Button icon={<UploadOutlined />}>{label?label:'Upload'}</Button>
  </Upload>
);
export default UploadFiles;