import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars, faDollarSign, faHandHoldingUsd,
    faTree, faRoute, faCog, faDatabase,
} from '@fortawesome/free-solid-svg-icons';

const { Sider } = Layout;

const routes = [
    {
        path: '/admin/providers',
        name: ' Providers',
        icon: faTree,
        disabled: false
    },
    {
        path: '/admin/offers',
        name: ' Offers',
        icon: faDollarSign,
        disabled: true
    },
    {
        path: '/admin/local_offers',
        name: ' Local Offers',
        icon: faHandHoldingUsd,
        disabled: true
    },
    {
        path: '/admin/pathways',
        name: ' Pathways',
        icon: faRoute,
        disabled: true
    },
    {
        path: '/admin/settings',
        name: ' Settings',
        icon: faCog,
        disabled: false
    },
    {
        path: '/admin/database',
        name: ' Database',
        icon: faDatabase,
        disabled: true
    }
];

function Sidebar(props) {
    const [collapsed, setCollapse] = useState(true);

    const toggleSider = () => {
        setCollapse(!collapsed);
    }

    return (
        <Sider
            className="min-h-full bg-green-500"
            trigger={null}
            collapsible
            collapsed={collapsed}
            >
            <div className="flex justify-center bg-green-600">
                <Button
                    className="mx-auto h-12 w-full"
                    type="link"
                    onClick={() => toggleSider()}
                >   
                    <FontAwesomeIcon
                        className="text-white"
                        icon={faBars}
                    />
                </Button>
            </div>
            <Menu
                className="bg-green-500"
                theme="dark"
                defaultSelectedKeys={['1']}
            >
                {
                    routes.map(({ path, name, icon, disabled }, index) => (
                        <Menu.Item
                            className="bg-green-500 text-center text-white bg-green-800-selected"
                            style={{ marginTop: 0, marginBottom: 0 }}
                            key={index + 1}
                            disabled={disabled}
                        >
                            <Link to={path}>
                                <FontAwesomeIcon
                                    className="text-white"
                                    icon={icon}
                                />
                                {
                                    collapsed ? null : name
                                }
                            </Link>
                        </Menu.Item> 
                    ))
                }
            </Menu>
        </Sider>
    );
}

export default Sidebar;