import React from 'react';
import { HomeScreen } from '../components/HomeScreen';
import { router } from 'expo-router';

export default function Index() {
  const handleNavigateToMap = () => {
    router.push('/map');
  };

  return <HomeScreen onNavigateToMap={handleNavigateToMap} />;
}
