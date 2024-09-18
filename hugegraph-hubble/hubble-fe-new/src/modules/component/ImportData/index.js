/**
 * @file  导入数据
 * @author
 */

import React, {useCallback, useContext} from 'react';
import {Button, Tooltip, Upload, message} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import GraphAnalysisContext from '../../Context';
import {GRAPH_STATUS} from '../../../utils/constants';
import * as api from '../../../api';

const {
    LOADING,
    SUCCESS,
    UPLOAD_FAILED,
} = GRAPH_STATUS;

const ImportData = props => {
    const {
        buttonEnable,
        onUploadChange,
        tooltip,
    } = props;

    const {graphSpace, graph} = useContext(GraphAnalysisContext);

    const handleUploadChange = useCallback(
        info => {
            if (info.file.status === 'uploading') {
                onUploadChange(LOADING);
            }
            if (info.file.status === 'done') {
                const {response} = info.fileList[0];
                if (response.status === 200) {
                    onUploadChange(SUCCESS, '导入成功', response.data);
                    message.success('导入成功');
                    return;
                }
                onUploadChange(UPLOAD_FAILED, response.message);
            }
        },
        [onUploadChange]
    );

    return (
        <>
            <Upload
                action={api.analysis.getUploadList(graphSpace, graph)}
                onChange={handleUploadChange}
                accept="application/json"
                maxCount={1}
                showUploadList={false}
                disabled={!buttonEnable}
            >
                <Tooltip placement="bottom" title={buttonEnable ? '' : tooltip}>
                    <Button
                        icon={<UploadOutlined />}
                        type={'text'}
                        disabled={!buttonEnable}
                    >
                        导入
                    </Button>
                </Tooltip>
            </Upload>
        </>
    );
};

export default ImportData;