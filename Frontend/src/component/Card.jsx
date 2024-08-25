import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
} from '@chakra-ui/react'
import { FiShoppingCart } from 'react-icons/fi'
import { Link } from 'react-router-dom' 

const data = {
  isNew: true,
}



function Card({product}){
  return (
  <Link to={`/product/${product._id}`}>
    <Flex  w="full" >
      <Box
        bg={useColorModeValue('#3dc0f9', 'gray.800')}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative">
        {data.isNew && (
          <Circle size="10px" position="absolute" top={2} right={2} bg="red.200" />
        )}
        {product.pimage && product.pimage.length > 0 && (
          <Image src={product.pimage[0]} height={"200px"} width={"full"} alt={`Picture of ${product.pname}`} roundedTop="lg" />
        )}

        <Box p="6">
          <Box display="flex" alignItems="baseline">
            {data.isNew && (
              <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                New
              </Badge>
            )}
          </Box>
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated>
              {product.pname}
            </Box>
            
          </Flex>

          <Flex justifyContent="space-between" alignContent="center">
            <Box fontSize="xl" color={useColorModeValue('gray.800', 'white')}>
              <Box as="span" color={'gray.600'} fontSize="lg">
                $
              </Box>
              {product.pprice}
            </Box>
            <Tooltip
              label="Add to cart"
              bg="white"
              placement={'top'}
              color={'gray.800'}
              fontSize={'0.9em'}>
              <chakra.a href={'#'} display={'flex'}>
                <Icon as={FiShoppingCart} h={4} w={7} alignSelf={'center'} />
              </chakra.a>
            </Tooltip>
          </Flex>
        </Box>
      </Box>
    </Flex>
  </Link>
  )
}

export default Card
