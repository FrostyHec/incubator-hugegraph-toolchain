import {Utils} from '@antv/graphin';
import icons from './graph';
import {iconsMap} from './constants';

/**
 * huge格式转为graphin格式
 * edge: {
        "id": "person-knows->person",
        "label": "knows",
        "source": "person",
        "target": "person",
        "sort_keys": [],
        "properties": {
            "date": "date",
            "weight": "double"
        },
        "~style": {
            "color": "#5C73E6",
            "with_arrow": true,
            "line_type": "SOLID",
            "thickness": "NORMAL",
            "display_fields": [
                "~id"
            ],
            "join_symbols": [
                "-"
            ]
        }
    }

    "node": {
        "id": "software",
        "label": "software",
        "primary_keys": [
            "name"
        ],
        "properties": {
            "price": "int",
            "lang": "text",
            "name": "text"
        },
        "~style": {
            "icon": "",
            "color": "#5C73E6",
            "size": "NORMAL",
            "display_fields": [
                "~id"
            ],
            "join_symbols": [
                "-"
            ]
        }
    }
 * @param {object} hugeData
 * @returns
 */
const formatToGraphInData = hugeData => {

    const nodes = [];
    const edges = [];

    for (let item of hugeData.vertices) {
        const color = item['~style']?.color ?? '#eee';
        const icon = item['~style']?.icon ?? '';
        nodes.push({
            id: item.id,
            // label: item.label,
            style: {
                label: {
                    value: item.label,
                },
                keyshape: {
                    fill: color,
                    // stroke: increase_brightness(color, 10),
                    stroke: color,
                },
                icon: {
                    show: true,
                    text: icons[iconsMap[icon]],
                    fontFamily: 'graphin',
                    fontSize: 12,
                    _iconName: icon,
                },
            },
            data: {...item,
                properties: {...item.properties},
                '~style': {...item['~style']},
            },
        });
    }

    const polyEdges = Utils.processEdges(hugeData.edges, {poly: 50, loop: 10});

    for (let item of polyEdges) {
        const color = item['~style']?.color ?? '#eee';
        // const endArrow = item['~style'].with_arrow ? {path: 'M 0,0 L 8,4 L 8,-4 Z', fill: color} : false;
        const endArrow = item['~style'].with_arrow ? undefined : false;

        edges.push({
            source: item.source,
            target: item.target,
            // status: {
            //     selected: true,
            // },
            // label: item.label,
            style: {
                ...item.style,
                label: {
                    value: item.label,
                    fill: '#000',
                },
                keyshape: {
                    ...item?.style?.keyshape,
                    stroke: color,
                    endArrow,
                },
            },
            data: {...item,
                properties: {...item.properties},
                '~style': {...item['~style']},
            },
        });
    }

    return {nodes, edges};
};

export {formatToGraphInData};