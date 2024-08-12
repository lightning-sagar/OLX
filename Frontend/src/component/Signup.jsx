'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import authScreenAtom from '../Atoms/AuthAtom.js'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import userAtom from '../Atoms/userAtom'
import { useNavigate } from 'react-router-dom'

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setUser = useResetRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name:'',
    username:'',
    email:'',
    password:''
  })
  const setAuthScreenState = useSetRecoilState(authScreenAtom);
  const toast = useToast();
  const navigate = useNavigate();  
  const handleSignup = async() => {
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      })
      const data = await res.json();
      console.log(data);
      if(data.err){
        console.log(data.err)
        toast({
          title: "Error",
          description: data.err,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return;
      }
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      window.location.reload();
      // navigate("/");   
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="Name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" value={inputs.name} onChange={(e)=>setInputs({...inputs,name:e.target.value})} />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="username">
                  <FormLabel>Username</FormLabel>
                  <Input type="text" value={inputs.username} onChange={(e)=>setInputs({...inputs,username:e.target.value})} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={inputs.email} onChange={(e)=>setInputs({...inputs,email:e.target.value})} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'}  value={inputs.password} onChange={(e)=>setInputs({...inputs,password:e.target.value})}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSignup}
                >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link  onClick={() => setAuthScreenState("login")} color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
