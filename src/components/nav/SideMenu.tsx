import { Menu } from 'antd'

export const SideMenu = () => {
    return <Menu
        id="side-menu"
        mode="inline"
        defaultOpenKeys={['similarity']}
        style={{ border: 'none' }}
        items={[
            {
                key: 'home',
                label: "Home"
            },
            {
                key: 'similarity',
                label: 'String Similarity',
                children: [
                    {
                        key: 'levenshtein',
                        label: 'Levenshtein'
                    }
                ]
            }
        ]}
    />
}