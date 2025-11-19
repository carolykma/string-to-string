import { Menu } from 'antd'
import { useNavigate } from 'react-router'

export const SideMenu = () => {
    const navigate = useNavigate();

    return <Menu
        id="side-menu"
        mode="inline"
        defaultOpenKeys={['editingDistance']}
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
                key: 'editingDistance',
                label: 'Editing Distance',
                children: [
                    {
                        key: 'levenshtein',
                        label: 'Levenshtein',
                        onClick: () => {
                            navigate('/levenshtein')
                        }
                    },
                    {
                        key: 'damerau-levenshtein',
                        label: 'Damerau-Levenshtein',
                        onClick: () => {
                            navigate('/damerau-levenshtein')
                        }
                    }
                ]
            }
        ]}
    />
}