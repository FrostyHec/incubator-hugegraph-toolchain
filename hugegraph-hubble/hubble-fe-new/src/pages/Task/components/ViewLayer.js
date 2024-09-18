import {
    Modal,
    message,
    Spin,
} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import * as api from '../../../api';
import ReactJsonView from 'react-json-view';

const ViewLayer = ({visible, onCancel, task_id}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const onFinish = useCallback(() => {
        onCancel();
    }, [onCancel]);

    useEffect(() => {
        if (!visible) {
            return;
        }
        api.manage.getTaskDetail(task_id).then(res => {
            if (res.status === 200) {
                setData(JSON.parse(JSON.stringify(res.data)));
                setLoading(false);
                return;
            }
            message.error(res.message);
        });

    }, [visible, task_id]);

    return (
        <Modal
            title='查看任务'
            onCancel={onCancel}
            open={visible}
            width={600}
            onOk={onFinish}
            destroyOnClose
        >
            <Spin spinning={loading}>
                {/* {data && (
                    <Form
                        labelCol={{span: 4}}
                        form={form}
                        // initialValues={data}
                        preserve={false}
                    >
                        <Form.Item label='任务名称'>{data.task_name}</Form.Item>
                        <Form.Item label='数据源类型'>
                            {sourceType.find(item =>
                                item.value === getStruct(data).input?.type)?.label ?? ''}
                        </Form.Item>
                        <Form.Item label='目标图空间'>{data.ingestion_option.graphspace}</Form.Item>
                        <Form.Item label='目标图'>{data.ingestion_option.graph}</Form.Item>
                        <Form.Item label='同步方式'>
                            {syncType.find(item => item.value === data.task_schedule_type)?.label ?? ''}
                            {data.task_schedule_extend ? `(${data.task_schedule_extend})` : ''}
                        </Form.Item>
                        <Form.Item label='导入时间'>{data.create_time}</Form.Item>
                        <Form.Item label='创建人'>{data.creator}</Form.Item>
                    </Form>
                )} */}
                {data && (
                    <div style={{height: 400, overflow: 'scroll'}}>
                        <ReactJsonView
                            src={data}
                            name={false}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            groupArraysAfterLength={50}
                        />
                    </div>
                )}
            </Spin>
        </Modal>
    );
};

export default ViewLayer;