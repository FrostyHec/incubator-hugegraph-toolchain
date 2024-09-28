/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to You under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * @file SingleSourceShortestPath
 * @author
 */

import React, {useState, useCallback, useContext} from 'react';
import {Input, Form, Collapse, Select, InputNumber} from 'antd';
import {SisternodeOutlined} from '@ant-design/icons';
import GraphAnalysisContext from '../../../../Context';
import * as api from '../../../../../api';
import removeNilKeys from '../../../../../utils/removeNilKeys';
import AlgorithmNameHeader from '../../AlgorithmNameHeader';
import {GRAPH_STATUS, Algorithm_Url, ALGORITHM_NAME} from '../../../../../utils/constants';
import {maxDegreeValidator, integerValidator} from '../../utils';
import _ from 'lodash';

const {SINGLESOURCESHORTESTPATH} = ALGORITHM_NAME;
const {LOADING, SUCCESS, FAILED} = GRAPH_STATUS;

const directionOptions = [
    {label: '出边', value: 'OUT'},
    {label: '入边', value: 'IN'},
    {label: '双边', value: 'BOTH'},
];

const description = {
    source: '起始顶点id',
    direction: '起始顶点向外发散的方向(出边，入边，双边)',
    label: '边的类型, 默认代表所有edge label',
    weight: '边的权重属性，属性的类型必须为数字类型,如果不填或者虽然填了但是边没有该属性，则权重为1.0',
    max_degree: '查询过程中，单个顶点遍历的最大邻接边数目',
    skip_degree: `用于设置查询过程中舍弃超级顶点的最小边数，即当某个顶点的邻接边数目大于 skip_degree 时，完全舍弃该顶点。
    选填项，如果开启时，需满足 skip_degree >= max_degree 约束，默认为0 (不启用)，表示不跳过任何点 (注意: 开启此配置后，
    遍历时会尝试访问一个顶点的 skip_degree 条边，而不仅仅是 max_degree 条边，这样有额外的遍历开销，对查询性能影响可能有较大影响，请确认理解后再开启)`,
    capacity: '遍历过程中最大的访问的顶点数目',
    limit: '查询到的目标顶点个数，也是返回的最短路径的条数',
};

const initialValue = {
    direction: 'BOTH',
    max_degree: 10000,
    skip_degree: 0,
    capacity: 10000000,
    limit: 10,
};

const algorithmDescription = '从一个顶点出发，查找该点到图中其他顶点的最短路径（可选是否带权重）';

const SingleSourceShortestPath = props => {
    const {
        handleFormSubmit,
        searchValue,
        currentAlgorithm,
        updateCurrentAlgorithm,
    } = props;
    const [form] = Form.useForm();

    const [isEnableRun, setEnableRun] = useState(false);
    const [isRequiring, setRequiring] = useState(false);
    const {graphSpace, graph} = useContext(GraphAnalysisContext);

    const handleSubmit = useCallback(
        async algorithmParams => {
            setRequiring(true);
            updateCurrentAlgorithm(SINGLESOURCESHORTESTPATH);
            handleFormSubmit(LOADING);
            algorithmParams = {...algorithmParams, 'algorithmName': Algorithm_Url[SINGLESOURCESHORTESTPATH]};
            const filteredParams = removeNilKeys(algorithmParams);
            const response =  await api.analysis.runOltpInfo(graphSpace, graph, filteredParams);
            const {data, status, message} = response || {};
            const {graph_view} = data || {};
            if (status !== 200) {
                handleFormSubmit(FAILED, {}, message);
            }
            else {
                handleFormSubmit(SUCCESS, graph_view || {}, message);
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
                    icon={<SisternodeOutlined />}
                    name={SINGLESOURCESHORTESTPATH}
                    searchValue={searchValue}
                    description={algorithmDescription}
                    isRunning={isRequiring}
                    isDisabled={!isEnableRun}
                    handleRunning={handleRunning}
                    highlightName={currentAlgorithm === SINGLESOURCESHORTESTPATH}
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
                    tooltip={description.max_degree}
                    rules={[{validator: maxDegreeValidator}]}
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

export default SingleSourceShortestPath;
