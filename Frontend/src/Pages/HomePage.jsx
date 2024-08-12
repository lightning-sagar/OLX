import { AiFillRightCircle } from "react-icons/ai"; 
import { Box, Flex, Button, Stack, Grid, useBreakpointValue } from '@chakra-ui/react';
import Card from '../component/Card.jsx';
import { useState } from 'react';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const allCategories = [
    'All', 'Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 
    'Category 6', 'Category 7', 'Category 8', 'Category 9', 'Category 10', 
    'Category 11', 'Category 12', 'Category 13', 'Category 14', 'Category 15',
    'Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'
  ];

  const [isAllCat, setIsAllCat] = useState(true);
  const categories = allCategories.slice(0, 7);  
  const moreCategories = allCategories.slice(7);
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, xl: 5 });

  return (
    <Box p={6}>
      {/* Category selection section */}
      <Flex 
        mb={6} 
        flexDirection={{ base: 'column', md: 'row' }} 
        alignItems="center" 
        justifyContent="center" 
        wrap="wrap" 
      >
        {isAllCat ? (
          <>
            {categories.map((category) => (
              <Button
                key={category}
                mx={2}
                mb={2}  
                onClick={() => setSelectedCategory(category)}
                colorScheme={selectedCategory === category ? 'teal' : 'gray'}
              >
                {category}
              </Button>
            ))}
            <AiFillRightCircle 
              style={{ fontSize: '24px', marginLeft: '16px' }} 
              onClick={() => setIsAllCat(false)} 
            />
          </>
        ) : (
          <>
            {moreCategories.map((category) => (
              <Button
                key={category}
                mx={2}
                mb={2}  
                onClick={() => setSelectedCategory(category)}
                colorScheme={selectedCategory === category ? 'teal' : 'gray'}
              >
                {category}
              </Button>
            ))}
            <Button onClick={() => setIsAllCat(true)} colorScheme='teal'>
              Show Less
            </Button>
          </>
        )}
      </Flex>

      {/* Card grid section */}
      <Stack spacing={4}>
        <Grid
          templateColumns={`repeat(${columns}, 1fr)`}  
          gap={5}
          justifyContent="center"
        >
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </Grid>
      </Stack>
    </Box>
  );
}

export default HomePage;
