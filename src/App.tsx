import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage, LevenshteinPage } from "./pages";

function App() {
  return (
    <>
      <BrowserRouter>
        <div>[NAV_BAR]</div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/levenshtein' element={<LevenshteinPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
