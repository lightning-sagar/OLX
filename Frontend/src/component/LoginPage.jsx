import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react';
import { Link } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../Atoms/AuthAtom';
import userAtom from '../Atoms/userAtom';
import useShowToast from '../hooks/useshowtoast.jsx';

export default function LoginCard() {
  const [inputs, setInputs] = useState({
    username:"",
    password:""
  });
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const setAuthScreenState = useSetRecoilState(authScreenAtom);
  const [showPass,setshowpass]= useState(false);
  const handleLogin = async() => {
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      console.log(data,"data");
      if (data.err) {
        showToast("Error", data.err, "error");
        return;
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setAuthScreenState("home");
      }
    } catch (error) {
      console.log(error)
      showToast("Error", error, "error");
    }
  }
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.100', '#101010')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Text color={'blue.400'}>features</Text> ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="email" value={inputs.username} onChange={(e)=>setInputs({...inputs,username:e.target.value})} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                    type={showPass ? 'text' : 'password'}
                    value={inputs.password}
                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setshowpass(showPassword => !showPassword)}
                    >
                      {showPass ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>        
                <Text color={'blue.400'}>Forgot password?</Text>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleLogin}
                >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account? <Link  onClick={() => setAuthScreenState("signup")} color={'blue.400'}>Sign-up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}