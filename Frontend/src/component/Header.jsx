import { BiChat } from "react-icons/bi"; 
import { CgDarkMode } from "react-icons/cg"; 
import { AiFillHome } from "react-icons/ai"; 
import { IoMdLogOut } from "react-icons/io"; 
import { Flex, Image, Link, useColorMode, Input, Spacer } from '@chakra-ui/react'
import { Link as RouterLink } from "react-router-dom" 
import React from 'react'
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../Atoms/userAtom.js"
import authScreenAtom from "../Atoms/AuthAtom.js";
import uselogout from "../hooks/logout.jsx";

function Header() {
  const logout = uselogout();
  const user = useRecoilValue(userAtom);
  const SetAuthScreen = useSetRecoilState(authScreenAtom);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex 
      alignItems="center" 
      justifyContent="space-between" 
      ml={4} 
      mr={4} 
      mb={12} 
      mt={6}
    >
      <Flex alignItems="center">
        <Link as={RouterLink} to="/" mr={4}>
          <AiFillHome size={24} />
        </Link>
        <Link fontSize={"1.2rem"} as={RouterLink} to="/add/product">
          Add Product
        </Link>
        <Link as={RouterLink} to="/chat" ml={4}>
        <BiChat />
        </Link>
      </Flex>
      
      <Flex flex={1} ml={4} mr={4} justifyContent="center">
        <Input 
          placeholder="Search..." 
          maxWidth="500px" 
          variant="outline"
        />
      </Flex>
      
      <Flex alignItems="center">
        <CgDarkMode 
          onClick={toggleColorMode} 
          size={24} 
          cursor="pointer" 
          mr={4}
        />
        
        {user ? (
          <IoMdLogOut ml={4} size={24} cursor="pointer" onClick={logout}/>
        ) : (
          <Link ml={4} as={RouterLink} to={'/auth'} onClick={() => SetAuthScreen('login')} fontSize={"1.2rem"} >
            Sign-in
          </Link>
        )}
      </Flex>
    </Flex>
  )
}

export default Header;
