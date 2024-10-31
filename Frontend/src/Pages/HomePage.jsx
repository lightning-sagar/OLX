import { CgSpinnerTwo } from "react-icons/cg"; 
import { AiFillRightCircle } from "react-icons/ai"; 
import { Box, Flex, Button, Stack, Grid, useBreakpointValue, Skeleton, SkeletonText, Text } from '@chakra-ui/react';
import Card from '../component/Card.jsx';
import { useEffect, useState } from 'react';
import productAtom from "../Atoms/productAtom.js";
import { useRecoilState } from "recoil";

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const allCategories = [
    'All', 'Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5',
    'Category 6', 'Category 7', 'Category 8', 'Category 9', 'Category 10',
    'Category 11', 'Category 12', 'Category 13', 'Category 14', 'Category 15'
  ];

  const [products, setProducts] = useRecoilState(productAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/p/product', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [setProducts]);

  const [isAllCat, setIsAllCat] = useState(true);
  const categories = allCategories.slice(0, 7);
  const moreCategories = allCategories.slice(7);
  const columns = useBreakpointValue({ base: 2, sm: 2, md: 3, lg: 4, xl: 5 });

  return (
    <Box p={{ base: 4, md: 6 }} maxW="1200px" mx="auto">
      <Flex
        mb={8}
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        wrap="wrap"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={{ base: 4, md: 0 }}>
          Categories
        </Text>

        <Flex
          flexWrap="wrap"
          justifyContent={{ base: 'center', md: 'flex-end' }}
          alignItems="center"
        >
          {isAllCat ? (
            <>
              {categories.map((category) => (
                <Button
                  key={category}
                  mx={1}
                  my={2}
                  onClick={() => setSelectedCategory(category)}
                  variant="solid"
                  colorScheme={selectedCategory === category ? 'teal' : 'gray'}
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'md' }}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
              <AiFillRightCircle
                style={{ fontSize: '24px', marginLeft: '16px', cursor: 'pointer' }}
                onClick={() => setIsAllCat(false)}
              />
            </>
          ) : (
            <>
              {moreCategories.map((category) => (
                <Button
                  key={category}
                  mx={1}
                  my={2}
                  onClick={() => setSelectedCategory(category)}
                  variant="solid"
                  colorScheme={selectedCategory === category ? 'teal' : 'gray'}
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'md' }}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
              <Button onClick={() => setIsAllCat(true)} colorScheme='teal' size="sm">
                Show Less
              </Button>
            </>
          )}
        </Flex>
      </Flex>

      <Stack spacing={6}>
        {loading ? (
          <Grid
            templateColumns={`repeat(${columns}, 1fr)`}
            gap={6}
            justifyContent="center"
          >
            {Array.from({ length: columns * 2 }).map((_, index) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
                <Skeleton height="200px" />
                <SkeletonText mt="4" noOfLines={4} spacing="4" />
              </Box>
            ))}
          </Grid>
        ) : (
          <Grid
            templateColumns={`repeat(${columns}, 1fr)`}
            gap={6}
            justifyContent="center"
          >
            {products && products
              .map((product) => (
                <Card key={product._id} product={product} />
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
}

export default HomePage;
