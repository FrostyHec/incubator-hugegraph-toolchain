/**
 * @file KCoreVermeer算法
 * @author gouzixing@
 */

import React, {useState, useCallback, useContext, useEffect} from 'react';
import {Form, Collapse, InputNumber} from 'antd';
import {TagsOutlined} from '@ant-design/icons';
import _ from 'lodash';
import * as api from '../../../../../api';
import removeNilKeys from '../../../../../utils/removeNilKeys';
import {positiveIntegerValidator} from '../../utils';
import {GRAPH_STATUS, ALGORITHM_NAME, GRAPH_LOAD_STATUS} from '../../../../../utils/constants';
import GraphAnalysisContext from '../../../../Context';
import AlgorithmNameHeader from '../../AlgorithmNameHeader';

const {K_CORE} = ALGORITHM_NAME;
const {LOADING, SUCCESS, FAILED} = GRAPH_STATUS;
const {LOADED} = GRAPH_LOAD_STATUS;

const info = {
    name: 'K-Core',
    desc: 'K-Core算法，标记所有度数为K的顶点。',
    icon: <TagsOutlined />,
};

const KCoreVermeer = props => {
    const {
        handleFormSubmit,
        searchValue,
        currentAlgorithm,
        updateCurrentAlgorithm,
    } = props;

    const {graphSpace, graph, graphStatus} = useContext(GraphAnalysisContext);

    const [isEnableRun, setEnableRun] = useState(true);
    const [isRequiring, setRequiring] = useState(false);

    const [form] = Form.useForm();

    useEffect(
        () => {
            setEnableRun(graphStatus === LOADED);
        },
        [graphStatus]
    );

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
            updateCurrentAlgorithm(K_CORE);
            handleFormSubmit(LOADING);
            const formParams = {'compute.algorithm': 'kcore', ...algorithmParams};
            const filteredParams = removeNilKeys(formParams);
            const response =  await api.analysis.runOlapVermeer(graphSpace, graph, filteredParams);
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
                    name={K_CORE}
                    description={info.desc}
                    isRunning={isRequiring}
                    isDisabled={!isEnableRun}
                    handleRunning={handleRunning}
                    searchValue={searchValue}
                    highlightName={currentAlgorithm === K_CORE}
                />
            }
            forceRender
            {...props}
        >
            <Form
                form={form}
                disabled={graphStatus !== LOADED}
                onFinish={onFormFinish}
                onValuesChange={_.debounce(onFormValuesChange, 300)}
                layout="vertical"
            >
                <Form.Item
                    label='compute.parallel'
                    name='compute.parallel'
                    initialValue={1}
                    tooltip='worker计算线程数'
                    rules={[{validator: positiveIntegerValidator}]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label='kcore.degree_k'
                    name='kcore.degree_k'
                    initialValue={3}
                    tooltip='最小度数阈值'
                    rules={[{validator: positiveIntegerValidator}]}
                >
                    <InputNumber />
                </Form.Item>
            </Form>
        </Collapse.Panel>
    );
};

export default KCoreVermeer;
