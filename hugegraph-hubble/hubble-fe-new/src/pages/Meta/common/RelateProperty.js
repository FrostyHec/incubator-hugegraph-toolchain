import {Space, Form, Select} from 'antd';
import {attrOptions} from './config';

const RelateProperty = ({propertyList, selectProperty, removeProperty, exist, isEdit}) => {
    const checkDuplicate = () => ({
        validator(_, value) {
            const existName = exist.map(item => item.name);
            if (value === undefined) {
                return Promise.resolve();
            }

            for (let item of value) {
                if (item === undefined || !item.name) {
                    return Promise.resolve();
                }

                if (existName.includes(item.name)) {
                    return Promise.reject(new Error('属性不可重复'));
                }

                existName.push(item.name);
            }

            return Promise.resolve();
        },
    });

    return (isEdit
        ? (
            <>
                {exist.map(item => (
                    <Space key={item.name} align='baseline'>
                        <Form.Item
                            className="form_attr_select"
                        >
                            <Select
                                options={propertyList}
                                value={item.name}
                                disabled
                            />
                        </Form.Item>
                        <Form.Item
                            className="form_attr_select"
                        >
                            <Select
                                options={attrOptions}
                                value={item.nullable}
                                disabled
                            />
                        </Form.Item>
                    </Space>
                ))}
                <Form.List
                    name='append_properties'
                    rules={[checkDuplicate]}
                >
                    {(fields, {remove, add}, {errors}) => (
                        <>
                            {fields.map((field, index) => (
                                <Space key={field.key} align='baseline'>
                                    <Form.Item
                                        className="form_attr_select"
                                        name={[field.name, 'name']}
                                    >
                                        <Select
                                            options={propertyList}
                                            onChange={_ => selectProperty()}
                                            showSearch
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className="form_attr_select"
                                        name={[field.name, 'nullable']}
                                    >
                                        <Select
                                            options={attrOptions.map(item => ({...item, disabled: !item.value}))}
                                            onChange={_ => selectProperty()}
                                        />
                                    </Form.Item>
                                    <a onClick={() => {
                                        remove(index);
                                        removeProperty();
                                    }}
                                    >
                                        删除
                                    </a>
                                </Space>
                            ))}
                            <Form.ErrorList errors={errors} />
                            <div className="form_attr_add" onClick={() => add()}>+新增</div>
                        </>
                    )}
                </Form.List>
            </>
        )
        : (
            <Form.List
                name='properties'
                rules={[checkDuplicate]}
            >
                {(fields, {remove, add}, {errors}) => (
                    <>
                        {fields.map((field, index) => (
                            <Space key={field.key} align='baseline'>
                                <Form.Item
                                    className="form_attr_select"
                                    name={[field.name, 'name']}
                                >
                                    <Select
                                        options={propertyList}
                                        onChange={_ => selectProperty()}
                                        showSearch
                                    />
                                </Form.Item>
                                <Form.Item
                                    className="form_attr_select"
                                    name={[field.name, 'nullable']}
                                >
                                    <Select
                                        options={attrOptions}
                                        onChange={_ => selectProperty()}
                                    />
                                </Form.Item>
                                <a onClick={() => {
                                    remove(index);
                                    removeProperty();
                                }}
                                >
                                    删除
                                </a>
                            </Space>
                        ))}
                        <Form.ErrorList errors={errors} />
                        <div className="form_attr_add" onClick={() => add()}>+新增</div>
                    </>
                )}
            </Form.List>
        )
    );
};

export default RelateProperty;
