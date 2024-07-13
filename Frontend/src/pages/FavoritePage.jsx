import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContextProvider';
import { CountryCard } from '../components/CountryCard';
import { BASE_URL } from '../../config';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { user, authTokens } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetch(`${BASE_URL}/api/users/${user.id}/favorites`, {
        headers: {
          Authorization: `Bearer ${authTokens}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed to fetch favorites');
          }
        })
        .then((data) => setFavorites(data))
        .catch((err) => {
          console.error('Error fetching favorites:', err);
          toast({
            title: 'Error',
            description: 'Failed to retrieve favorites. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [authTokens, user, toast]);

  const handleCountryClick = (countryId) => {
    navigate(`/countries/${countryId}`);
  };

  const handleFavoriteClick = async (countryId, isFavorite) => {
    try {
      await fetch(`${BASE_URL}/api/users/${user.id}/favorites`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${authTokens}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryId }),
      });

      setFavorites((prevFavorites) =>
        prevFavorites.map((favCountry) =>
          favCountry._id === countryId ? { ...favCountry, isFavorite: !favCountry.isFavorite } : favCountry
        )
      );
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

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Your Favorites
      </Heading>
      {favorites.length === 0 ? (
        <Text>You have no favorite countries yet.</Text>
      ) : (
        <Flex flexWrap="wrap" gap={4}>
          {favorites.map((country) => (
            <CountryCard
              key={country._id}
              country={country}
              onClick={handleCountryClick}
              onFavoriteClick={() => handleFavoriteClick(country._id, country.isFavorite)}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
}

export { FavoritesPage };
