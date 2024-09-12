/**
 * @file  Echart 占比柱状图
 * @author gouzixing
 */

import React, {useEffect, useMemo, useRef} from 'react';
import * as echarts from 'echarts/core';
import {DatasetComponent, GridComponent} from 'echarts/components';
import {CanvasRenderer, SVGRenderer} from 'echarts/renderers';
import {BarChart} from 'echarts/charts';

echarts.use([GridComponent, BarChart, CanvasRenderer, SVGRenderer, DatasetComponent]);

const transformToChartDataset = (data, totalData) => {
    const source  = data.map(
        item => {
            const {name, count} = item;
            return {
                name,
                count: count / totalData || 0,
                display: `${count} / ${totalData}`,
            };
        }
    );
    return {dimensions: ['name', 'count', 'display'], source};
};

const BarChartComponent = props => {

    const {data, totalData} = props;

    const chartContainer = useRef(null);

    const barChartOptions = useMemo(
        () => ({
            dataset: transformToChartDataset(data, totalData),
            yAxis: {
                type: 'category',
                axisLabel: {
                    inside: true,
                    color: '#fff',
                    width: 155,
                    height: 100,
                    overflow: 'break',
                },
                axisTick: {show: false},
                axisLine: {show: false},
                z: 10,
            },
            xAxis: {show: false, max: 1},
            series: [{
                type: 'bar',
                showBackground: true,
                backgroundStyle: {color: '#ccc', borderRadius: 4},
                barWidth: 35,
                barCategoryGap: 5,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        {offset: 0, color: '#57b09f'},
                        {offset: 1, color: '#647dc8'},
                    ]),
                    borderRadius: 4,
                },
                label: {
                    show: true,
                    formatter: '{@display}',
                    align: 'right',
                    position: [235, '35%'],
                    width: 80,
                    overflow: 'break',
                    color: '#fff',
                },
            }],
            grid: {top: 0, bottom: 0, left: 0, right: 0},
        }),
        [data, totalData]
    );

    useEffect(
        () => {
            const myChart = echarts.init(chartContainer.current, null);
            myChart.setOption(barChartOptions);
            return () => {
                myChart.dispose();
            };
        },
        [barChartOptions]
    );

    return (
        <div ref={chartContainer} style={{width: '240px', height: `${data.length * 40}px`}} />
    );
};

export default BarChartComponent;