import { BrowserRouter, Routes, Route } from "react-router";
import { Layout } from 'antd'
import { HomePage, LevenshteinPage } from "./pages";
import { SideMenu } from "./components/nav";

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout style={{ minHeight: "100vh" }}>
          <Layout.Sider theme="light">
            <h2 style={{ paddingLeft: "10px" }}>String to String</h2>
            <SideMenu />
          </Layout.Sider>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/levenshtein' element={<LevenshteinPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App
