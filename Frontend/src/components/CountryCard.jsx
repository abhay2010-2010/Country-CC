import React from 'react';
import { Box, Text, Image, Flex, Button } from '@chakra-ui/react';

function CountryCard({ country, onClick, onFavoriteClick }) {
  return (
    <Box
      as="button"
      onClick={() => onClick(country.currency)}
      bg="white"
      boxShadow="md"
      borderRadius="md"
      p={4}
      cursor="pointer"
      transition="transform 0.2s ease"
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Flex alignItems="center">
        <Image
          src={country.flag}
          alt={`${country.name} flag`}
          borderRadius="md"
          height="60px"
          mr={4}
        />
        <Box>
          <Text fontWeight="bold">{country.name}</Text>
          <Text fontSize="sm">Currency: {country.currency}</Text>
        </Box>
      </Flex>
      <Button
        onClick={() => onFavoriteClick(country._id, country.isFavorite)}
        colorScheme={country.isFavorite ? 'pink' : 'blue'}
        mt={2}
      >
        {country.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </Button>
    </Box>
  );
}

export  {CountryCard};