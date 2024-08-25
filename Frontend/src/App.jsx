import { Container } from "@chakra-ui/react"
import Nav from "./component/Header.jsx"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import HomePage from "./Pages/HomePage.jsx"
import SignupCard from "./component/Signup.jsx"
import { useRecoilValue } from "recoil"
import userAtom from "./Atoms/userAtom.js"
import AuthPage from "./Pages/AuthPage.jsx"
import ProductCard from "./component/ProductCard.jsx"
import UpdatePage from "./Pages/UpdatePage.jsx"
import updateAtom from "./Atoms/updateAtom.js"
import ProductPage from "./Pages/ProductPage.jsx"
import Cart from "./component/Cart.jsx"

function App() {

  const user = useRecoilValue(userAtom);
  const update = useRecoilValue(updateAtom)
  console.log(user,"user")
  return (
    <>
      <Nav/>
      <Container maxW="80%">
        <Routes>
        <Route path="/" element={user?(
          <>
            <Cart/>
            <HomePage/>
          </>
        ):
          <HomePage/>
        }/>
        <Route
            path="/add/product"
            element={
              !user ? (
                <Navigate to="/auth" />
              ) : update ? (
                <ProductCard />
              ) : ( 
                <UpdatePage />
              )
            }
          />
        <Route path="/auth" element={!user?<AuthPage/>:<Navigate to='/' />}/>
        <Route path="/product/:pid" element={<ProductPage/>}/>
        </Routes>
      </Container>
    </>
  )
}

export default App
