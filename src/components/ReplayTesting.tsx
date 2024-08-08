import { Button, Upload, UploadFile, UploadProps } from "antd";
import { useRef, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch } from "hooks/useAppDispatch";
import { processHrpLocal } from "stores/season/async-actions";
import { ReplayTick } from "models/IReplayViewerResponse";
import ReplayViewer from "./ReplayViewer";

const API_URL = process.env.REACT_APP_API_URL;

const ReplayTesting = () => {
    const dispatch = useAppDispatch();

    const [uploading, setUploading] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [fragments, setFragments] = useState<ReplayTick[]>([]);

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleUpload = async () => {
        const file = fileList[0] as unknown as File;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);

        const response = await fetch(API_URL + '/api/replay/ProcessHrpLocal', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        setUploading(false);
        setFragments(result as ReplayTick[]);
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([file]);

            return false;
        },
        fileList,
        accept: ".hrp"
    };

    return (
        <div>
            {fragments.length !== 0 &&
                <ReplayViewer externalFragments={fragments} />
            }
            {fragments.length === 0 &&
                <>
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                        loading={uploading}
                        style={{ marginTop: 16 }}
                    >
                        {uploading ? 'Processing' : 'Start upload'}
                    </Button>
                </>
            }
        </div>
    )
}

export default ReplayTesting;