import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  Flex,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthContextProvider';

function CountryDetailsPage() {
  const { currencyCode } = useParams();
  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { user, authTokens } = useContext(AuthContext);

  useEffect(() => {
    fetch(`/api/countries/${currencyCode}`, {
      headers: {
        Authorization: `Bearer ${authTokens.token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Failed to fetch country details');
        }
      })
      .then((data) => setCountry(data))
      .catch((err) => {
        console.error('Error fetching country details:', err);
        toast({
          title: 'Error',
          description: 'Failed to retrieve country details. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [currencyCode, authTokens]);

  const handleFavoriteClick = async (countryId, isFavorite) => {
    try {
      await fetch(`/api/users/favorites/${countryId}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${authTokens.token}`,
          'Content-Type': 'application/json',
        },
      });

    
      setCountry((prevCountry) => ({
        ...prevCountry,
        isFavorite: !prevCountry.isFavorite,
      }));
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (!country) {
    return (
      <Box p={4}>
        <Heading as="h2" size="lg">Country not found</Heading>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        {country.name}
      </Heading>
      <Flex mb={4} alignItems="center">
        <Image
          src={country.flag}
          alt={`${country.name} flag`}
          borderRadius="md"
          height="80px"
          mr={4}
        />
        <Button
          onClick={() => handleFavoriteClick(country._id, country.isFavorite)}
          colorScheme={country.isFavorite ? 'pink' : 'blue'}
        >
          {country.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </Flex>
      <Text mb={2}>Capital: {country.capital || 'N/A'}</Text>
      <Text mb={2}>Currency: {country.currency}</Text>
      <Text mb={2}>Languages: {country.languages.join(', ')}</Text>
      <Button onClick={() => navigate(-1)} variant="outline" colorScheme="blue">
        Back to Search
      </Button>
    </Box>
  );
}

export  {CountryDetailsPage};