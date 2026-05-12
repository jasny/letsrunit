import { Upload } from 'antd';

export function AntdUpload(props: any) {
  return (
    <Upload beforeUpload={() => false} {...props}>
      <button type="button">Upload</button>
    </Upload>
  );
}
