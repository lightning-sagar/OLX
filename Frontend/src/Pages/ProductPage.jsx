import React, { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Image,
  Text,
  Badge,
  Button,
  Heading,
  Stack,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from '@chakra-ui/react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import productAtom from '../Atoms/productAtom'
import useShowToast from '../hooks/useshowtoast'
import cartAtom from '../Atoms/cartAtom'

function ProductPage() {
  const { pid } = useParams()
  const [product, setProduct] = useRecoilState(productAtom)
  const [cart, setCart] = useRecoilState(cartAtom)
  const [quantity, setQuantity] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)  
  const showToast = useShowToast()

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`/api/p/product/${pid}`)
        const data = await res.json()
        console.log(data, 'data')
        setProduct(data)
      } catch (error) {
        console.log(error)
      }
    }
    getProduct()
  }, [pid, setProduct])

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        showToast('Error', 'Please login to add product to cart', 'error')
        return
      }

      const res = await fetch(`/api/p/product/${product._id}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      })

      const data = await res.json()
      setCart(data)
      showToast('Success', 'Product added to the cart', 'success')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Box maxW="7xl" mx="auto" p={6}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={2}>
        <Flex position="sticky" top="20px" height="80vh" alignItems="flex-start">
          <Carousel width="100%" dynamicHeight showThumbs infiniteLoop showStatus={false}>
            {product.pimage && product.pimage.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Product image ${index + 1}`}
                objectFit="cover"
                rounded="md"
                height="100%" 
                maxH="500px"  
              />
            ))}
          </Carousel>
        </Flex>

        <Stack spacing={5}>
          <Heading as="h1" size="xl" fontWeight="bold">
            {product.pname}
          </Heading>
          <Text fontSize="2xl" fontWeight="semibold" color={useColorModeValue('gray.800', 'white')}>
            <Box as="span" color="gray.600" fontSize="lg">
              $
            </Box>
            {product.pprice && product.pprice.toFixed(2)}
          </Text>
          {product.pbio && (
            <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>
              {isExpanded ? product.pbio : `${product.pbio.slice(0, 100)}...`}
              <Button
                size="sm"
                variant="link"
                colorScheme="teal"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </Button>
            </Text>
          )}
          <Flex alignItems="center">
            <Badge px={2} py={1} bg={product.pstock > 0 ? 'green.500' : 'red.500'} color="white" rounded="md">
              {product.pstock > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
            <Text ml={3} fontWeight="medium">
              {product.pstock} {product.pstock > 0 ? 'units available' : 'units'}
            </Text>
          </Flex>

          <NumberInput
            defaultValue={1}
            min={1}
            max={product.pstock}
            value={quantity}
            onChange={(value) => setQuantity(Number(value))}
            size="md"
            maxW={24}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Button
            colorScheme="teal"
            size="lg"
            mt={5}
            isDisabled={product.pstock <= 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Stack>
      </SimpleGrid>
    </Box>
  )
}

export default ProductPage