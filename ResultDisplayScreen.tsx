import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ResultDisplayScreen = ({ route }) => {
  const { jsonData } = route.params;

  useEffect(() => {
    console.log(route.params.result);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.jsonText}>{JSON.stringify(route.params.result, null, 2)}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  jsonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Courier', // Makes JSON text more readable
  },
});

export default ResultDisplayScreen;
