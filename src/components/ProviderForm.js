import React from 'react';
import { Layout, Form, Input, Row, Col, Select, AutoComplete } from 'antd';
import ImageUploadAndNameInputs from 'components/inputs/ImageUploadAndNameInputs';
import SearchFunnel from 'components/inputs/SearchFunnel';

const { Option } = Select;

const ProviderForm = React.forwardRef((props, ref) => {
    const { formRef, uploadRef } = ref;
    const [ form ] = Form.useForm();

    return (
        <Layout>
            <Form
                form={form}
                ref={formRef}
            >
                <ImageUploadAndNameInputs
                    ref={uploadRef}
                >
                    <Row gutter={8}>
                        <Col span={18}>
                            <Form.Item
                                label="Location"
                                name="location"
                                labelAlign={"left"}
                                colon={false}
                                className="mb-0 inherit"
                            >
                                <AutoComplete />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Type"
                                name="type"
                                labelAlign={"left"}
                                colon={false}
                                className="mb-0 inherit"
                            >
                                <Select>
                                    <Option value="international">international</Option>
                                    <Option value="second">Second</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <Form.Item
                                label="Learn/Earn"
                                name="learn_or_earn"
                                labelAlign={"left"}
                                colon={false}
                                className="mb-0 inherit"
                            >
                                <Select>
                                    <Option value="learn">Learn</Option>
                                    <Option value="earn">Earn</Option>
                                    <Option value="both">Learn and Earn</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Public/Private"
                                name="public_or_private"
                                labelAlign={"left"}
                                colon={false}
                                className="mb-0 inherit"
                            >
                                <Select>
                                    <Option value="public">Public</Option>
                                    <Option value="private">Private</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Industry"
                                name="industry"
                                labelAlign={"left"}
                                colon={false}
                                className="mb-0 inherit"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </ImageUploadAndNameInputs>
                <Form.Item
                    label="Description"
                    name="description"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Keywords"
                    name="keywords"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
                <SearchFunnel
                    title={"Related Provider Images"}
                />
                <SearchFunnel
                    title={"Topics"}
                />
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            label="Financial Aid"
                            name="financial_aid"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            label="Cost"
                            name="cost"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            label="Pay"
                            name="pay"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            label="Credit"
                            name="credit"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="News"
                    name="news"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Contact"
                    name="contact"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Layout>
    );
});

export default ProviderForm;