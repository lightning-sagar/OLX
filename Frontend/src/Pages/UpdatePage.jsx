import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import useShowToast from '../hooks/useshowtoast';
import userAtom from '../Atoms/userAtom';
import usePreviewImg from '../hooks/usePrevImg';
  
  export default function UpdatePage() {
    const [user, setUsers] = useRecoilState(userAtom);
    const [inputs, setInputs] = useState({
      username: user.username,
      password: "",
      name: user.name,
      email: user.email,
      bio: user.bio,
    });
    const [updating, setUpdating] = useState(false);
    const showToast = useShowToast();
    const fileRef = useRef(null);
    const currentuser = useRecoilValue(userAtom);
    const { handleImageChange, imgUrl } = usePreviewImg();
  
    const handleSubmit = async (e) => {
      if (!currentuser) {
        showToast("Error", "Please login to update profile", "error");
        return;
      }
      if (updating) return;
      setUpdating(true);
      console.log(imgUrl, user.profilePic, "log");
      e.preventDefault();
  
      try {
        const res = await fetch(`/api/user/${user._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
        });
        const data = await res.json();
        console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
        } else {
          setUsers(data);
          localStorage.setItem("user-threads", JSON.stringify(data));
          localStorage.setItem("data-user", JSON.stringify(data));
          showToast("Success", "Profile updated successfully", "success");
        }
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setUpdating(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <Flex minH={'100vh'} align={'center'} justify={'center'}>
          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.dark')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
          >
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
              User Profile Edit
            </Heading>
            <FormControl id="userName">
              <Stack direction={['column', 'row']} spacing={6}>
                <Center>
                  <Avatar size="xl" boxShadow={'md'} src={imgUrl || user.profilePic} />
                </Center>
                <Center w="full">
                  <Button w="full" onClick={() => fileRef.current.click()}>
                    Change Avatar
                  </Button>
                  <Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
                </Center>
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                value={inputs.name}
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                placeholder="Full Name"
                _placeholder={{ color: 'gray.500' }}
                type="text"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Username"
                value={inputs.username}
                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                _placeholder={{ color: 'gray.500' }}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input
                value={inputs.email}
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                placeholder="your-email@example.com"
                _placeholder={{ color: 'gray.500' }}
                type="email"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Input
                value={inputs.bio}
                onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                placeholder="Bio"
                _placeholder={{ color: 'gray.500' }}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                placeholder="password"
                _placeholder={{ color: 'gray.500' }}
                type="password"
              />
            </FormControl>
            <Stack spacing={6} direction={['column', 'row']}>
              <Button
                bg={'red.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'red.500',
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bg={'green.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'green.500',
                }}
                isLoading={updating}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </form>
    );
  }
  