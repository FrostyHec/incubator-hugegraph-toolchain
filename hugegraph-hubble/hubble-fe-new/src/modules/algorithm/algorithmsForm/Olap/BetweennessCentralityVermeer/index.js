/**
 * @file BetweennessCentralityVermeer算法
 * @author gouzixing@
 */

import React, {useState, useCallback, useContext, useEffect} from 'react';
import {Form, Collapse, InputNumber, Select} from 'antd';
import {ControlOutlined} from '@ant-design/icons';
import GraphAnalysisContext from '../../../../Context';
import AlgorithmNameHeader from '../../AlgorithmNameHeader';
import _ from 'lodash';
import * as api from '../../../../../api';
import removeNilKeys from '../../../../../utils/removeNilKeys';
import {GRAPH_STATUS, ALGORITHM_NAME, GRAPH_LOAD_STATUS} from '../../../../../utils/constants';
import {positiveIntegerValidator, greaterThanZeroAndLowerThanOneContainsValidator} from '../../utils';
import {useTranslation} from 'react-i18next';

const {BETWEENNESS_CENTRALITY} = ALGORITHM_NAME;
const {LOADING, SUCCESS, FAILED} = GRAPH_STATUS;
const {LOADED} = GRAPH_LOAD_STATUS;

const BetweennessCentralityVermeer = props => {
    const {
        handleFormSubmit,
        searchValue,
        currentAlgorithm,
        updateCurrentAlgorithm,
    } = props;
    const {t} = useTranslation();
    const info = {
        name: 'Betweenness Centrality',
        desc: t('analysis.algorithm.olap.betweenness_centrality.desc'),
        icon: <ControlOutlined />,
    };
    const boolOptions = [
        {label: t('common.verify.yes'), value: 1},
        {label: t('common.verify.no'), value: 0},
    ];
    const {graphSpace, graph, graphStatus} = useContext(GraphAnalysisContext);
    const [isEnableRun, setEnableRun] = useState(true);
    const [isRequiring, setRequiring] = useState(false);

    useEffect(
        () => {
            setEnableRun(graphStatus === LOADED);
        },
        [graphStatus]
    );

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
            updateCurrentAlgorithm(BETWEENNESS_CENTRALITY);
            handleFormSubmit(LOADING);
            const formParams =  {'compute.algorithm': 'betweenness_centrality', ...algorithmParams};
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
                    name={BETWEENNESS_CENTRALITY}
                    description={info.desc}
                    isRunning={isRequiring}
                    isDisabled={!isEnableRun}
                    handleRunning={handleRunning}
                    searchValue={searchValue}
                    highlightName={currentAlgorithm === BETWEENNESS_CENTRALITY}
                />
            }
            forceRender
            {...props}
        >
            <Form
                disabled={graphStatus !== LOADED}
                form={form}
                onFinish={onFormFinish}
                onValuesChange={_.debounce(onFormValuesChange, 300)}
                layout="vertical"
            >
                <Form.Item
                    label='compute.parallel'
                    name='compute.parallel'
                    initialValue={1}
                    tooltip={t('analysis.algorithm.common.worker_num')}
                    rules={[{validator: positiveIntegerValidator}]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label='betweenness_centrality.sample_rate'
                    name='betweenness_centrality.sample_rate'
                    initialValue={1}
                    tooltip={t('analysis.algorithm.olap.betweenness_centrality.sample_rate_long')}
                    rules={[{validator: greaterThanZeroAndLowerThanOneContainsValidator}]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label='betweenness_centrality.use_endpoint'
                    name='betweenness_centrality.use_endpoint'
                    initialValue={0}
                    tooltip={t('analysis.algorithm.olap.betweenness_centrality.use_endpoint')}
                >
                    <Select allowClear options={boolOptions} />
                </Form.Item>
            </Form>
        </Collapse.Panel>
    );
};

export default BetweennessCentralityVermeer;