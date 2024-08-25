import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Grid,
  GridItem,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useRecoilValue } from 'recoil';
import updateAtom from '../Atoms/updateAtom';
import usePreviewImg from '../hooks/usePrevImg';
import UpdatePage from '../Pages/UpdatePage';
import { Navigate } from 'react-router-dom';

function ProductCard() {
  const [showUpdatePage, setShowUpdatePage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
  });

  const [imgUrls, setImgUrls] = useState([]);  
  const fileInputRef = useRef(null);  
  const [loading ,setloading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const updateData = useRecoilValue(updateAtom);

  const { handleImageChange, imgUrl } = usePreviewImg('');

  useEffect(() => {
    const update = localStorage.getItem('update');
    if (!update) {
      onOpen();
      setShowUpdatePage(true);
    }
  }, []);

  useEffect(() => {
    if (imgUrl) {
      if (imgUrls.length < 5) {  
        setImgUrls((prevUrls) => [...prevUrls, imgUrl]);  
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
      }
    }
  }, [imgUrl]);

  if (showUpdatePage) {
    return <UpdatePage />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setloading(true)
    console.log('Product details:', productDetails, 'Images:', imgUrls);
    try{
      const res = await fetch('/api/p/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...productDetails, pimage: imgUrls }),
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data);

      Navigate("/")
    }
    catch(e){
      console.log(e);
    } finally{
      setloading(false)
    }
  };

  const handleModalClose = () => {
    onClose();
  };

  const handleRemoveImage = (index) => {
    setImgUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };
  console.log(imgUrls,"imgUrls")
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Required</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>Please update your profile to proceed.</Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setShowUpdatePage(true)}>
              Update Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box as="form" onSubmit={handleSubmit} p={4} borderWidth="1px" borderRadius="lg">
        <FormControl id="name" mb={4} isRequired>
          <FormLabel>Product Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={productDetails.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </FormControl>

        <FormControl id="images" mb={4} isRequired>
          <FormLabel>Product Images (up to 5)</FormLabel>
          <Box display="flex" alignItems="center">
            <IconButton
              aria-label="Add Image"
              icon={<AddIcon />}
              onClick={() => fileInputRef.current.click()}
              disabled={imgUrls.length >= 5}  
            />
            <Input
              ref={fileInputRef} 
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}  
              display="none" 
            />
          </Box>

          {imgUrls.length > 0 && (
            <Grid templateColumns="repeat(5, 1fr)"  gap={2} mt={4}>
              {imgUrls.map((url, index) => (
                <GridItem key={index}>
                  <Image
                    w={"10px"}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    boxSize="100px"
                    objectFit="cover"
                  />
                  <Text
                    color="red.500"
                    fontSize="sm"
                    cursor="pointer"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </Text>
                </GridItem>
              ))}
            </Grid>
          )}
        </FormControl>

        <FormControl id="price" mb={4} isRequired>
          <FormLabel>Price $</FormLabel>
          <Input
            type="number"
            name="price"
            value={productDetails.price}
            onChange={handleInputChange}
            placeholder="Enter product price"
          />
        </FormControl>

        <FormControl id="description" mb={4} isRequired>
          <FormLabel>Description</FormLabel>
          <Input
            type="text"
            name="description"
            value={productDetails.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
          />
        </FormControl>

        <FormControl id="stock" mb={4} isRequired>
          <FormLabel>Stock</FormLabel>
          <Input
            type="number"
            name="stock"
            value={productDetails.stock}
            onChange={handleInputChange}
            placeholder="Enter available stock"
          />
        </FormControl>

        <Button colorScheme="blue" type="submit" mt={4} isLoading={loading} onClick={handleSubmit}>
          Submit
        </Button>

      </Box>
    </>
  );
}

export default ProductCard;
