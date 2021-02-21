import React, { Component } from "react";
import {
    Row,
    Col,
    Layout,
    Form,
    Select,
    message,
    Button,
    Spin,
} from "antd";
import {
    MenuFoldOutlined, MenuUnfoldOutlined, CloseOutlined
} from '@ant-design/icons';

import Navbar from './Navbar';
import darkVars from './dark.json';
import lightVars from './light.json';
import anotherVars from './another.json'
import './styles/main.less';

// eslint-disable jsx-a11y/anchor-has-content
const {Footer, Content, Sider} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class App extends Component {
    constructor(props) {
        super(props);
        let initialValue = lightVars;
        let vars = {};
        let themeName = localStorage.getItem("theme-name") || 'light';

        try {
            vars = localStorage.getItem("app-theme");
            if (!vars) {
                vars = initialValue;
            } else {
                vars = Object.assign(
                    {},
                    JSON.parse(vars)
                );
            }

        } catch (e) {
            vars = initialValue;
        } finally {
            this.state = {
                vars, initialValue, size: 'default',
                disabled: false,
                themeName,
                themeApplied: false,
            };
            window.less
                .modifyVars(vars)
                .then(() => {
                    this.setState({themeApplied: true});
                })
                .catch(error => {
                    message.error(`Failed to update theme`);
                });
        }
    }

    handleColorChange = (varname, color) => {
        const vars = {...this.state.vars};
        if (varname) vars[varname] = color;
        console.log(vars);
        window.less
            .modifyVars(vars)
            .then(() => {
                // message.success(`Theme updated successfully`);
                this.setState({vars});
                localStorage.setItem("app-theme", JSON.stringify(vars));
            })
            .catch(error => {
                message.error(`Failed to update theme`);
            });
    };

    resetTheme = () => {
        localStorage.setItem("app-theme", "{}");
        localStorage.setItem("theme-name", 'light');
        this.setState({themeName: 'light'});
        this.setState({vars: this.state.initialValue});
        window.less.modifyVars(this.state.initialValue).catch(error => {
            message.error(`Failed to reset theme`);
        });
    };

    onCollapse = collapsed => {
        this.setState({collapsed});
        console.log('onCollapse', collapsed);
    }

    render() {
        const {collapsed, size, disabled, themeApplied} = this.state;
        // const colorPickerOptions = ["@primary-color", "@secondary-color", "@text-color", "@text-color-secondary", "@heading-color", "@layout-header-background", "@btn-primary-bg"];
        // const colorPickers = Object.keys(this.state.vars).filter(name => colorPickerOptions.indexOf(name) > -1).map((varName, index) =>


        const themeLayout = {
            labelCol: {span: 24},
            wrapperCol: {span: 24}
        };

        if (!themeApplied) {
            return (
                <Spin size="large">
                    <Layout className="app"/>
                </Spin>
            )
        }
        return (
            <Layout className="app">
                <Navbar/>
                <Content className="content">
                    <Layout>
                        <Sider
                            breakpoint="lg"
                            collapsedWidth={40}
                            collapsed={collapsed}
                            width={300}
                            onBreakpoint={broken => {
                                console.log(broken);
                                this.onCollapse(broken);
                            }}
                            onCollapse={this.onCollapse}
                        >
                            <Row className="theme-heading">
                                {collapsed ? <MenuUnfoldOutlined onClick={() => this.onCollapse(!collapsed)}/> :
                                    <MenuFoldOutlined onClick={() => this.onCollapse(!collapsed)}/>}
                            </Row>
                            <Row className="theme-selector-dropdown">
                                {!collapsed && (
                                    <Col span={22} offset={1}><FormItem
                                        {...themeLayout}
                                        label="Choose Theme"
                                        className="ant-col ant-col-xs-22 ant-col-offset-1 choose-theme"
                                    >

                                        <Select
                                            placeholder="Please select theme"
                                            value={this.state.themeName}
                                            onSelect={value => {
                                                // let vars = value === 'light' ? lightVars : darkVars;
                                                let vars = value;
                                                if (vars === 'light') {
                                                    vars = lightVars
                                                } else if (vars === 'dark') {
                                                    vars = darkVars
                                                } else {
                                                    vars = anotherVars
                                                }
                                                vars = {...vars, '@white': '#fff', '@black': '#000'};
                                                this.setState({vars, themeName: value});
                                                this.setState({vars});
                                                localStorage.setItem("app-theme", JSON.stringify(vars));
                                                localStorage.setItem("theme-name", value);
                                                window.less.modifyVars(vars).catch(error => {

                                                });
                                            }}
                                        >
                                            <Option value="light">Light</Option>
                                            <Option value="dark">Dark</Option>
                                            <Option value="anotherVars">anotherVars</Option>
                                        </Select>
                                    </FormItem>
                                    </Col>
                                )}
                            </Row>

                            {/*{colorPickers}*/}
                            <Row type="flex" justify="center">
                                <Button type="primary" onClick={this.resetTheme} title="Reset Theme">
                                    {!collapsed ? "Reset Theme" : <CloseOutlined/>}
                                </Button>
                            </Row>

                        </Sider>
                    </Layout>
                </Content>

            </Layout>
        );
    }
}

export default App;
