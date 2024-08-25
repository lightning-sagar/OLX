import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Progress,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import useShowToast from '../hooks/useshowtoast';
import userAtom from '../Atoms/userAtom';
import usePreviewImg from '../hooks/usePrevImg';
import updateAtom from '../Atoms/updateAtom';
import { Navigate } from 'react-router-dom';

export default function UpdatePage() {
  const [user, setUsers] = useRecoilState(userAtom);
  const currentUser = useRecoilValue(userAtom);
  const [inputs, setInputs] = useState({
    username: user.username,
    password: '',
    email: user.email,
    fname: user.fname || user.name,
    lname: user.lname,
    country: user.country,
    city: user.city,
    address: user.address,
    pincode: user.pincode,
    phone: user.phone,
    profilePic: user.profilePic || '',   
  });
  
  const [updating, setUpdating] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const showToast = useShowToast();
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(inputs.profilePic);
  const [updateUser, setUpdateUser] = useRecoilState(updateAtom);
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);

  useEffect(() => {
    // Synchronize the imgUrl with the inputs state whenever imgUrl changes
    if (imgUrl) {
      setInputs(prevInputs => ({ ...prevInputs, profilePic: imgUrl }));
    }
  }, [imgUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Error', 'Please login to update profile', 'error');
      return;
    }

    if (updating) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server Error: ', errorText);
        showToast('Error', 'An error occurred while updating profile', 'error');
        return;
      }

      const data = await res.json();

      if (data.error) {
        showToast('Error', data.error, 'error');
      } else {
        setUsers(data);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('update', JSON.stringify(data));
        setUpdateUser(data);
        setRedirect(true);
      }
    } catch (error) {
      console.error(error);
      showToast('Error', 'An error occurred while updating profile', 'error');
      localStorage.removeItem('update');
      setUpdateUser(null);
    } finally {
      setUpdating(false);
    }
  };

  if (redirect) {
    return <Navigate to="/add/product" />;
  }

  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      shadow="1px 1px 3px rgba(0,0,0,0.3)"
      maxWidth={800}
      p={6}
      m="10px auto"
      as="form"
      onSubmit={handleSubmit}
    >
      <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated />
      {step === 1 && <Form1 inputs={inputs} setInputs={setInputs} imgUrl={imgUrl} />}
      {step === 2 && <Form2 inputs={inputs} setInputs={setInputs} />}
      {step === 3 && <Form3 inputs={inputs} setInputs={setInputs} />}

      <ButtonGroup mt="5%" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <Flex>
            <Button
              onClick={() => {
                setStep(step - 1);
                setProgress(progress - 33.33);
              }}
              isDisabled={step === 1}
              variant="solid"
              w="7rem"
              mr="5%"
            >
              Back
            </Button>
            <Button
              w="7rem"
              isDisabled={step === 3}
              onClick={() => {
                setStep(step + 1);
                setProgress(step === 3 ? 100 : progress + 33.33);
              }}
              variant="outline"
            >
              Next
            </Button>
          </Flex>
          {step === 3 && (
            <Button w="7rem" variant="solid" type="submit">
              Submit
            </Button>
          )}
        </Flex>
      </ButtonGroup>
    </Box>
  );
}

const Form1 = ({ inputs, setInputs, imgUrl }) => {
  const { handleImageChange } = usePreviewImg(inputs.profilePic);
  const [hovered, setHovered] = useState(false);
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setInputs((prev) => ({ ...prev, profilePic: imageUrl }));
      handleImageChange(e);
    }
  };
  

  return (
    <Flex alignItems="center">
      <FormControl w="150px" mr={6}>
        <FormLabel >Profile Picture</FormLabel>
        <Box
          position="relative"
          width="150px"
          height="150px"
          borderRadius="full"
          overflow="hidden"
          borderWidth="2px"
          borderColor={borderColor}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onChange={handleImgChange}
        >
          <img
            src={inputs.profilePic || 'https://via.placeholder.com/150'}
            alt="Profile Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {hovered && (
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg="rgba(0, 0, 0, 0.6)"
            >
              <Button
                colorScheme="teal"
                onClick={() => document.getElementById('profilePicInput').click()}
              >
                Change Picture
              </Button>
            </Box>
          )}
        </Box>
        <Input
          type="file"
          id="profilePicInput"
          accept="image/*"
          onChange={handleImgChange}
          display="none"
        />
      </FormControl>

      <Box flex="1">
        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            value={inputs.fname || ''}
            required
            onChange={(e) => setInputs({ ...inputs, fname: e.target.value })}
            placeholder="First Name"
          />
        </FormControl>

        <FormControl mt={4} isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            value={inputs.lname || ''}
            onChange={(e) => setInputs({ ...inputs, lname: e.target.value })}
            placeholder="Last Name"
          />
        </FormControl>
      </Box>
    </Flex>
  );
};

const Form2 = ({ inputs, setInputs }) => (
  <>
    <FormControl isRequired>
      <FormLabel>Email address</FormLabel>
      <Input
        value={inputs.email || ''}
        required
        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
        placeholder="your-email@example.com"
      />
    </FormControl>

    <FormControl isRequired>
      <FormLabel>Password</FormLabel>
      <Input
        value={inputs.password || ''}
        required
        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
        placeholder="Password"
        type="password"
      />
    </FormControl>

    <FormControl isRequired>
      <FormLabel>Phone</FormLabel>
      <Input
        value={inputs.phone || ''}
        required
        onChange={(e) => setInputs({ ...inputs, phone: e.target.value })}
        placeholder="Phone"
        type="tel"
      />
    </FormControl>
  </>
);

const Form3 = ({ inputs, setInputs }) => (
  <>
    <FormControl isRequired>
      <FormLabel>Country</FormLabel>
      <Input
        value={inputs.country || ''}
        required
        onChange={(e) => setInputs({ ...inputs, country: e.target.value })}
        placeholder="Country"
      />
    </FormControl>

    <FormControl isRequired>
      <FormLabel>City</FormLabel>
      <Input
        value={inputs.city || ''}
        required
        onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
        placeholder="City"
      />
    </FormControl>

    <FormControl isRequired>
      <FormLabel>Pincode</FormLabel>
      <Input
        value={inputs.pincode || ''}
        required
        onChange={(e) => setInputs({ ...inputs, pincode: e.target.value })}
        placeholder="Pincode"
      />
    </FormControl>
  </>
);
