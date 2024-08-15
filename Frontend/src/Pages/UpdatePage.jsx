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
import updateAtom from '../Atoms/updateAtom';
import { Navigate } from 'react-router-dom';

export default function UpdatePage() {
  const [user, setUsers] = useRecoilState(userAtom);
  const currentuser = useRecoilValue(userAtom); 
  const [inputs, setInputs] = useState({
      username: user.username,
      password: "",
      email: user.email,
      fname: user.fname || user.name,
      lname: user.lname,
      country: user.country,
      city: user.city,
      address: user.address,
      pincode: user.pincode,
      phone: user.phone,
  });
  const [updating, setUpdating] = useState(false);
  const [redirect, setRedirect] = useState(false); 
  const showToast = useShowToast();
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [updateUser, setUpdateUser] = useRecoilState(updateAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentuser) {
        showToast("Error", "Please login to update profile", "error");
        return;
    }
    if (updating) return;
    setUpdating(true);

    try {
      console.log(currentuser._id)
        const res = await fetch(`/api/user/${currentuser._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
            credentials: 'include'
        });

        if (!res.ok) {
            const errorText = await res.text();  
            console.error("Server Error: ", errorText);
            showToast("Error", "An error occurred while updating profile", "error");
            return;
        }

        let data;
        try {
            data = await res.json();
        } catch (jsonError) {
            console.error("JSON Parse Error: ", jsonError);
            showToast("Error", "Received an invalid JSON response", "error");
            return;
        }

        if (data.error) {
            showToast("Error", data.error, "error");
        } else {
            setUsers(data);
            console.log("worlong")
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("update", JSON.stringify(data));
            setUpdateUser(data);
            setRedirect(true);  
        }
      } catch (error) {
          console.log(error);
          showToast("Error", "An error occurred while updating profile", "error");
          localStorage.removeItem('update');
          setUpdateUser(null);
      } finally {
          setUpdating(false);
      }
  }

  if (redirect) {
    return <Navigate to="/add/product" />;
  }

  return (
      <form onSubmit={handleSubmit}>
          <Flex minH={'100vh'} align={'center'} justify={'center'}>
            {console.log(user)}
              <Stack
                  spacing={4}
                  w={'full'}
                  maxW={'md'}
                  bg={useColorModeValue('white', 'gray.800')}
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
                      <FormLabel>First Name</FormLabel>
                      <Input
                          value={inputs.fname || ''} required
                          onChange={(e) => setInputs({ ...inputs, fname: e.target.value })}
                          placeholder="First Name"
                          _placeholder={{ color: 'gray.500' }}
                          type="text"
                      />
                  </FormControl>
                  <FormControl>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                          value={inputs.lname || ''}
                          onChange={(e) => setInputs({ ...inputs, lname: e.target.value })}
                          placeholder="Last Name"
                          _placeholder={{ color: 'gray.500' }}
                          type="text"
                      />
                  </FormControl>
                  <FormControl>
                      <FormLabel>Username</FormLabel>
                      <Input
                          placeholder="Username"
                          value={inputs.username || ''} required
                          onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                          _placeholder={{ color: 'gray.500' }}
                          type="text"
                      />
                  </FormControl>
                  <FormControl>
                      <FormLabel>Email address</FormLabel>
                      <Input
                          value={inputs.email || ''} required
                          onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                          placeholder="your-email@example.com"
                          _placeholder={{ color: 'gray.500' }}
                          type="email"
                      />
                  </FormControl>
                  <FormControl>
                      <FormLabel>Password</FormLabel>
                      <Input
                          value={inputs.password || ''} required
                          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                          placeholder="Password"
                          _placeholder={{ color: 'gray.500' }}
                          type="password"
                      />
                  </FormControl>
                  <FormControl>
                      <FormLabel>Country</FormLabel>
                      <Input
                          value={inputs.country || ''} required
                          onChange={(e) => setInputs({ ...inputs, country: e.target.value })}
                          placeholder="Country"
                          _placeholder={{ color: 'gray.500' }}
                          type="text"
                      />
                  </FormControl>
                  <FormControl>
                      <FormLabel>City</FormLabel>
                      <Input
                          value={inputs.city || ''} required
                          onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
                          placeholder="City"
                          _placeholder={{ color: 'gray.500' }}
                          type="text"
                      />
                  </FormControl>
                  <FormControl>
                      <FormLabel>Address</FormLabel>
                      <Input
                          value={inputs.address || ''} required
                          onChange={(e) => setInputs({ ...inputs, address: e.target.value })}
                          placeholder="Address"
                          _placeholder={{ color: 'gray.500' }}
                          type="text"
                      />
                  </FormControl>
                  <FormControl>
                      <FormLabel>Pincode</FormLabel>
                      <Input
                          value={inputs.pincode || ''} required
                          onChange={(e) => setInputs({ ...inputs, pincode: e.target.value })}
                          placeholder="Pincode"
                          _placeholder={{ color: 'gray.500' }}
                          type="text"
                      />
                  </FormControl>
                  <FormControl>
                      <FormLabel>Phone</FormLabel>
                      <Input
                          value={inputs.phone || ''} required
                          onChange={(e) => setInputs({ ...inputs, phone: e.target.value })}
                          placeholder="Phone"
                          _placeholder={{ color: 'gray.500' }}
                          type="tel"
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
