import { BrowserRouter, Routes, Route } from "react-router";
import { Layout, Typography } from 'antd'
import { HomePage, LevenshteinPage } from "./pages";
import { SideMenu } from "./components/nav";

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout style={{ minHeight: "100vh" }}>
          <Layout.Sider theme="light">
            <Typography.Title level={4} className="pl-4 pt-3">
              String to String
            </Typography.Title>
            <SideMenu />
          </Layout.Sider>
          <Layout className="p-8">
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/levenshtein' element={<LevenshteinPage />} />
            </Routes>
          </Layout>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App
