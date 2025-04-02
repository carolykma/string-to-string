import { Menu } from 'antd'
import { useNavigate } from 'react-router'

export const SideMenu = () => {
    const navigate = useNavigate();

    return <Menu
        id="side-menu"
        mode="inline"
        defaultOpenKeys={['similarity']}
        style={{ border: 'none' }}
        items={[
            {
                key: 'home',
                label: "Home",
                onClick: () => {
                    navigate('/')
                }
            },
            {
                key: 'similarity',
                label: 'String Similarity',
                children: [
                    {
                        key: 'levenshtein',
                        label: 'Levenshtein',
                        onClick: () => {
                            navigate('/levenshtein')
                        }
                    }
                ]
            }
        ]}
    />
}