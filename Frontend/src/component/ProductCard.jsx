import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
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
  Text,
  VStack,
  HStack,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import { AddIcon, ArrowUpIcon, ArrowDownIcon, CloseIcon } from '@chakra-ui/icons';
import { useRecoilValue } from 'recoil';
import updateAtom from '../Atoms/updateAtom';
import usePreviewImg from '../hooks/usePrevImg';
import UpdatePage from '../Pages/UpdatePage';

function ProductCard() {
  const [showUpdatePage, setShowUpdatePage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
  });
  const [imgUrls, setImgUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const fileInputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const updateData = useRecoilValue(updateAtom);
  const { handleImageChange, imgUrl } = usePreviewImg('');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000); 
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Product details:', productDetails, 'Images:', imgUrls);
    try {
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
      Navigate('/');
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    onClose();
  };

  const handleRemoveImage = (index) => {
    setImgUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const moveImageUp = (index) => {
    if (index === 0) return;
    const newUrls = [...imgUrls];
    [newUrls[index], newUrls[index - 1]] = [newUrls[index - 1], newUrls[index]];
    setImgUrls(newUrls);
  };

  const moveImageDown = (index) => {
    if (index === imgUrls.length - 1) return;
    const newUrls = [...imgUrls];
    [newUrls[index], newUrls[index + 1]] = [newUrls[index + 1], newUrls[index]];
    setImgUrls(newUrls);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Required</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Please update your profile to proceed.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setShowUpdatePage(true)}>
              Update Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box as="form" onSubmit={handleSubmit} p={8} borderWidth="1px" borderRadius="lg" boxShadow="md">
        <VStack spacing={4} align="stretch">
          <Heading as="h3" size="lg" mb={4} textAlign="center">
            Add New Product
          </Heading>

          <FormControl id="name" isRequired>
            <FormLabel>Product Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={productDetails.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              size="lg"
            />
          </FormControl>

          <FormControl id="images" isRequired>
            <FormLabel>Product Images (up to 5)</FormLabel>
            <HStack>
              <IconButton
                aria-label="Add Image"
                icon={<AddIcon />}
                onClick={() => fileInputRef.current.click()}
                disabled={imgUrls.length >= 5}
                size="lg"
                colorScheme="teal"
              />
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                display="none"
              />
            </HStack>

            {isLoading ? (
              <Grid templateColumns="repeat(5, 1fr)" gap={4} mt={4}>
                {Array(5)
                  .fill('')
                  .map((_, index) => (
                    <Skeleton key={index} height="100px" borderRadius="md" />
                  ))}
              </Grid>
            ) : (
              imgUrls.length > 0 && (
                <Grid templateColumns="repeat(5, 1fr)" gap={4} mt={4}>
                  {imgUrls.map((url, index) => (
                    <GridItem key={url} position="relative">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        boxSize="120px"
                        objectFit="cover"
                        borderRadius="md"
                        boxShadow="sm"
                        transition="transform 0.2s"
                        _hover={{ transform: 'scale(1.05)' }}
                      />
                      <Box position="absolute" top={1} right={1}>
                        <IconButton
                          icon={<CloseIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleRemoveImage(index)}
                        />
                      </Box>
                      <HStack position="absolute" bottom={1} left={1} spacing={1}>
                        <IconButton
                          aria-label="Move Up"
                          icon={<ArrowUpIcon />}
                          size="sm"
                          onClick={() => moveImageUp(index)}
                          isDisabled={index === 0}
                          bg="rgba(0, 0, 0, 0.6)"
                          color="white"
                          _hover={{ bg: 'rgba(0, 0, 0, 0.8)' }}
                        />
                        <IconButton
                          aria-label="Move Down"
                          icon={<ArrowDownIcon />}
                          size="sm"
                          onClick={() => moveImageDown(index)}
                          isDisabled={index === imgUrls.length - 1}
                          bg="rgba(0, 0, 0, 0.6)"
                          color="white"
                          _hover={{ bg: 'rgba(0, 0, 0, 0.8)' }}
                        />
                      </HStack>
                    </GridItem>
                  ))}
                </Grid>
              )
            )}
          </FormControl>

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl id="price" isRequired>
              <FormLabel>Price $</FormLabel>
              <Input
                type="number"
                name="price"
                value={productDetails.price}
                onChange={handleInputChange}
                placeholder="Enter product price"
                size="lg"
              />
            </FormControl>

            <FormControl id="stock" isRequired>
              <FormLabel>Stock</FormLabel>
              <Input
                type="number"
                name="stock"
                value={productDetails.stock}
                onChange={handleInputChange}
                placeholder="Enter available stock"
                size="lg"
              />
            </FormControl>
          </Grid>

          <FormControl id="description" isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={productDetails.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              size="lg"
            />
          </FormControl>

          <Button colorScheme="blue" type="submit" mt={4} isLoading={loading} size="lg">
            Submit
          </Button>
        </VStack>
      </Box>
    </>
  );
}

export default ProductCard;
