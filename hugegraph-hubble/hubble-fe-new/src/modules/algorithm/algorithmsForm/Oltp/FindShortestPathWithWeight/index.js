/**
 * @file 查找带权重的最短路径
 * @author
 */

import React, {useState, useCallback, useContext} from 'react';
import {Input, Form, Collapse, Select, InputNumber} from 'antd';
import {SecurityScanOutlined} from '@ant-design/icons';
import AlgorithmNameHeader from '../../AlgorithmNameHeader';
import * as api from '../../../../../api';
import removeNilKeys from '../../../../../utils/removeNilKeys';
import {GRAPH_STATUS, Algorithm_Url, ALGORITHM_NAME} from '../../../../../utils/constants';
import {maxDegreeValidator, integerValidator} from '../../utils';
import GraphAnalysisContext from '../../../../Context';
import _ from 'lodash';

const {FINDSHORTESTPATHWITHWEIGHT} = ALGORITHM_NAME;
const {LOADING, SUCCESS, FAILED} = GRAPH_STATUS;
const directionOptions = [
    {label: '出边', value: 'OUT'},
    {label: '入边', value: 'IN'},
    {label: '双边', value: 'BOTH'},
];

const description = {
    source: '起始顶点id',
    target: '目的顶点id',
    direction: '起始顶点向外发散的方向(出边，入边，双边)',
    label: '边的类型, 默认代表所有edge label',
    weight: '边的权重属性，属性的类型必须为数字类型，如果不填或者虽然填了但是边没有该属性，则权重为1.0',
    max_degree: '查询过程中，单个顶点遍历的最大邻接边数目',
    skip_degree: `用于设置查询过程中舍弃超级顶点的最小边数，即当某个顶点的邻接边数目大于 skip_degree 时，
    完全舍弃该顶点。选填项，如果开启时，需满足 skip_degree >= max_degree 约束，默认为0 (不启用)，表示不跳过任何点 (注意: 开启此配置后，
    遍历时会尝试访问一个顶点的 skip_degree 条边，而不仅仅是 max_degree 条边，这样有额外的遍历开销，对查询性能影响可能有较大影响，请确认理解后再开启)`,
    capacity: '遍历过程中最大的访问的顶点数目',
};

const initialValue = {
    direction: 'BOTH',
    max_degree: 10000,
    skip_degree: 0,
    capacity: 10000000,
};

const algorithmDescription = '根据起始顶点、目的顶点、方向、边的类型（可选）和最大深度，查找一条带权最短路径';

const FindShortestPathWithWeight = props => {
    const {
        handleFormSubmit,
        searchValue,
        currentAlgorithm,
        updateCurrentAlgorithm,
    } = props;

    const [form] = Form.useForm();
    const {graphSpace, graph} = useContext(GraphAnalysisContext);
    const [isEnableRun, setEnableRun] = useState(false);
    const [isRequiring, setRequiring] = useState(false);

    const handleSubmit = useCallback(
        async algorithmParams => {
            setRequiring(true);
            updateCurrentAlgorithm(FINDSHORTESTPATHWITHWEIGHT);
            handleFormSubmit(LOADING);
            algorithmParams = {...algorithmParams, 'algorithmName': Algorithm_Url[FINDSHORTESTPATHWITHWEIGHT]};
            const filteredParams = removeNilKeys(algorithmParams);
            const response =  await api.analysis.runOltpInfo(graphSpace, graph, filteredParams);
            const {data, status, message} = response || {};
            const {graph_view} = data || {};
            if (status !== 200) {
                handleFormSubmit(FAILED, {}, message);
            }
            else {
                handleFormSubmit(SUCCESS, graph_view || {}, message, {});
            }
            setRequiring(false);
        },
        [graph, graphSpace, handleFormSubmit, updateCurrentAlgorithm]
    );

    const handleRunning = useCallback(
        e => {
            e.stopPropagation();
            form.submit();
        },
        [form]
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
                    icon={<SecurityScanOutlined />}
                    name={FINDSHORTESTPATHWITHWEIGHT}
                    searchValue={searchValue}
                    description={algorithmDescription}
                    isRunning={isRequiring}
                    isDisabled={!isEnableRun}
                    handleRunning={handleRunning}
                    highlightName={currentAlgorithm === FINDSHORTESTPATHWITHWEIGHT}
                />
            }
            {...props}
        >
            <Form
                form={form}
                onFinish={onFormFinish}
                onValuesChange={_.debounce(onFormValuesChange, 300)}
                layout="vertical"
                initialValues={initialValue}
            >
                <Form.Item
                    label='source'
                    name='source'
                    rules={[{required: true}]}
                    tooltip={description.source}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='target'
                    label="target"
                    rules={[{required: true}]}
                    tooltip={description.target}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='direction'
                    label="direction"
                    tooltip={description.direction}
                >
                    <Select options={directionOptions} allowClear />
                </Form.Item>
                <Form.Item
                    name='label'
                    label="label"
                    tooltip={description.label}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='weight'
                    label="weight"
                    rules={[{required: true}]}
                    tooltip={description.weight}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='max_degree'
                    label="max_degree"
                    rules={[{validator: maxDegreeValidator}]}
                    tooltip={description.max_degree}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name='skip_degree'
                    label="skip_degree"
                    rules={[{validator: integerValidator}]}
                    tooltip={description.skip_degree}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name='capacity'
                    label="capacity"
                    rules={[{validator: maxDegreeValidator}]}
                    tooltip={description.capacity}
                >
                    <InputNumber />
                </Form.Item>
            </Form>
        </Collapse.Panel>
    );
};

export default FindShortestPathWithWeight;