/**
 * @file  导出画布和数据
 * @author
 */

import React, {useState, useCallback} from 'react';
import {Button, Tooltip, Dropdown, Menu, Modal, Form, Input} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';

const ExportData = props => {
    const {
        buttonEnable,
        onExportJsonChange,
        onExportPngChange,
        tooltip,
    } = props;

    const [exportPngForm] = Form.useForm();
    const [exportJsonForm] = Form.useForm();

    const [isExportPngVisible, setExportPngVisible] = useState(false);
    const [isExportJsonVisible, setExportJsonVisible] = useState(false);

    const handleClickExportJson = useCallback(
        () => {
            setExportJsonVisible(true);
        },
        []
    );

    const handleClickExportPng = useCallback(
        () => {
            setExportPngVisible(true);
        },
        []
    );

    const handleExportJsonOk = useCallback(
        () => {
            exportJsonForm.submit();
        },
        [exportJsonForm]
    );

    const handleExportJsonCancel = useCallback(
        () => {
            setExportJsonVisible(false);
            exportJsonForm.resetFields();
        },
        [exportJsonForm]
    );

    const handleExportPngOk = useCallback(
        () => {
            exportPngForm.submit();
        },
        [exportPngForm]
    );

    const handleExportPngCancel = useCallback(
        () => {
            setExportPngVisible(false);
            exportPngForm.resetFields();
        },
        [exportPngForm]
    );


    const handleExportPngFinish = useCallback(
        values => {
            const {filename} = values;
            onExportPngChange(filename);
            setExportPngVisible(false);
            exportPngForm.resetFields();
        },
        [exportPngForm, onExportPngChange]
    );

    const handleExportJsonFinish = useCallback(
        values => {
            const {exportFileName} = values;
            onExportJsonChange(exportFileName);
            setExportJsonVisible(false);
            exportJsonForm.resetFields();
        },
        [exportJsonForm, onExportJsonChange]
    );

    const exportMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (<a onClick={handleClickExportJson}>导出 JSON</a>),
                },
                {
                    key: '2',
                    label: (<a onClick={handleClickExportPng}>导出 PNG</a>),
                },
            ]}
        />
    );

    return (
        <>
            <Dropdown overlay={exportMenu} placement="bottomLeft" disabled={!buttonEnable}>
                <Tooltip placement="bottom" title={buttonEnable ? '' : tooltip}>
                    <Button
                        type='text'
                        icon={<DownloadOutlined />}
                        disabled={!buttonEnable}
                    >
                        导出
                    </Button>
                </Tooltip>
            </Dropdown>
            <Modal
                width={600}
                title="导出JSON"
                open={isExportJsonVisible}
                onOk={handleExportJsonOk}
                onCancel={handleExportJsonCancel}
            >
                <Form name='fileConfig' form={exportJsonForm} onFinish={handleExportJsonFinish}>
                    <Form.Item
                        label="文件名称"
                        name="exportFileName"
                        rules={[{required: true, message: '请输入不超过12个字的文件名称'}]}
                    >
                        <Input placeholder="请输入文件名称" maxLength="12" showCount />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                width={600}
                title="导出图片"
                open={isExportPngVisible}
                onOk={handleExportPngOk}
                onCancel={handleExportPngCancel}
            >
                <Form name='fileConfig' form={exportPngForm} onFinish={handleExportPngFinish}>
                    <Form.Item
                        label="文件名称"
                        name="filename"
                        rules={[{required: true, message: '请输入不超过12个字的文件名称'}]}
                    >
                        <Input placeholder="请输入文件名称" maxLength="12" showCount />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ExportData;
