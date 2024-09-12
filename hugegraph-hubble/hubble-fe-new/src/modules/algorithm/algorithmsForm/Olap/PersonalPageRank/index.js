/**
 * @file PersonalPageRank算法
 * @author zhanghao14@
 */

import React, {useState, useCallback, useContext} from 'react';
import {Input, Form, Collapse, Select, InputNumber} from 'antd';
import {TeamOutlined} from '@ant-design/icons';
import GraphAnalysisContext from '../../../../Context';
import AlgorithmNameHeader from '../../AlgorithmNameHeader';
import OlapComputerItem from '../OlapComputerItem';
import _ from 'lodash';
import * as api from '../../../../../api';
import removeNilKeys from '../../../../../utils/removeNilKeys';
import {GRAPH_STATUS, ALGORITHM_NAME} from '../../../../../utils/constants';
import {
    alphaValidator,
    greaterThanZeroAndLowerThanTwoThousandAndOneIntegerValidator,
} from '../../utils';

const {PERSONAL_PAGE_RANK} = ALGORITHM_NAME;
const {LOADING, SUCCESS, FAILED} = GRAPH_STATUS;

const info = {
    name: 'PersonalPageRank',
    desc: `PersonalPageRank 算法又称个性化推荐算法，
        是一种由搜索引擎根据网页（节点）之间相互的超链接进行计算的技术，用来体现网页（节点）的相关性和重要性`,
    icon: <TeamOutlined />,
};

const PersonalPageRank = props => {
    const {
        handleFormSubmit,
        searchValue,
        currentAlgorithm,
        updateCurrentAlgorithm,
    } = props;

    const {graphSpace, graph} = useContext(GraphAnalysisContext);
    const [isEnableRun, setEnableRun] = useState(false);
    const [isRequiring, setRequiring] = useState(false);

    const [form] = Form.useForm();

    const handleRunning = useCallback(
        e => {
            e.stopPropagation();
            form.submit();
        },
        [form]
    );

    const handleSubmit = useCallback(
        async algorithmParams => {
            setRequiring(true);
            updateCurrentAlgorithm(PERSONAL_PAGE_RANK);
            handleFormSubmit(LOADING);
            const {worker, ...args} = algorithmParams;
            const formParams = {
                algorithm: 'ppr',
                worker: worker,
                params: {...args},
            };
            const filteredParams = removeNilKeys(formParams);
            const response =  await api.analysis.postOlapInfo(graphSpace, graph, filteredParams);
            const {data, status, message} = response || {};
            if (status !== 200) {
                handleFormSubmit(FAILED, '', message);
            }
            else {
                handleFormSubmit(SUCCESS, data?.task_id, message);
            }
            setRequiring(false);
        },
        [graph, graphSpace, handleFormSubmit, updateCurrentAlgorithm]
    );

    const onFormFinish = useCallback(
        value => {
            handleSubmit(value);
        },
        [handleSubmit]
    );

    const onFormValuesChange = useCallback(
        () => {
            form.validateFields()
                .then(() => {
                    setEnableRun(true);
                })
                .catch(() => {
                    setEnableRun(false);
                });
        },
        [form]
    );

    return (
        <Collapse.Panel
            header={
                <AlgorithmNameHeader
                    icon={info.icon}
                    name={PERSONAL_PAGE_RANK}
                    description={info.desc}
                    isRunning={isRequiring}
                    isDisabled={!isEnableRun}
                    handleRunning={handleRunning}
                    searchValue={searchValue}
                    highlightName={currentAlgorithm === PERSONAL_PAGE_RANK}
                />
            }
            {...props}
        >
            <Form
                form={form}
                onFinish={onFormFinish}
                onValuesChange={_.debounce(onFormValuesChange, 300)}
                layout="vertical"
            >
                <Form.Item
                    labelCol={{span: 24}}
                    label='worker'
                    name='worker'
                    rules={[{required: true}]}
                    tooltip='实例数'
                >
                    <InputNumber min={1} precision={0} />
                </Form.Item>
                <Form.Item
                    labelCol={{span: 24}}
                    label='ppr.source'
                    name='ppr.source'
                    initialValue='/'
                    tooltip='起始顶点'
                    rules={[{required: true}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    labelCol={{span: 24}}
                    label='ppr.alpha'
                    name='ppr.alpha'
                    initialValue={0.85}
                    tooltip='权重系数(又称阻尼系数)'
                    rules={[{validator: alphaValidator}]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    labelCol={{span: 24}}
                    label='ppr.l1DiffThreshold'
                    name='ppr.l1DiffThreshold'
                    initialValue={0.00001}
                    tooltip='收敛精度'
                    rules={[{validator: alphaValidator}]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    labelCol={{span: 24}}
                    label='input.use_id_fixlength'
                    name='input.use_id_fixlength'
                    initialValue
                    tooltip='true时，系统采用自增id运算'
                >
                    <Select
                        placeholder="是否采用自增id运算"
                        allowClear
                    >
                        <Select.Option value>是</Select.Option>
                        <Select.Option value={false}>否</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    labelCol={{span: 24}}
                    label='bsp.max_super_step'
                    name='bsp.max_super_step'
                    initialValue={10}
                    tooltip='最大迭代次数'
                    rules={[{validator: greaterThanZeroAndLowerThanTwoThousandAndOneIntegerValidator}]}
                >
                    <InputNumber />
                </Form.Item>
                <OlapComputerItem />
            </Form>
        </Collapse.Panel>
    );
};

export default PersonalPageRank;
