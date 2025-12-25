/**
 * Example Usage of F1: Local Data Storage
 * This file demonstrates how to use the database service
 *
 * NOTE: This is for demonstration only - not part of production code
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useDatabase } from '../hooks';
import {
  createCapsule,
  getCapsules,
  getUpcomingCapsules,
  getOpenedCapsules,
  updatePendingCapsules,
  deleteCapsule,
} from '../services';
import type { Capsule } from '../types/capsule';

export const DatabaseExample: React.FC = () => {
  const { isReady, isLoading, isError, error } = useDatabase();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [message, setMessage] = useState('');

  // Refresh capsule list
  const loadCapsules = async () => {
    try {
      const all = await getCapsules();
      setCapsules(all);
      setMessage(`Loaded ${all.length} capsules`);
    } catch (err) {
      setMessage(`Error: ${err}`);
    }
  };

  useEffect(() => {
    if (isReady) {
      loadCapsules();
    }
  }, [isReady]);

  // Create test capsule
  const handleCreateEmotion = async () => {
    try {
      const unlockDate = new Date();
      unlockDate.setMinutes(unlockDate.getMinutes() + 2); // 2 minutes from now

      const capsule = await createCapsule({
        type: 'emotion',
        content: 'Test emotion capsule - feeling great today!',
        reflectionQuestion: 'Did your mood improve?',
        unlockDate,
      });

      setMessage(`Created capsule: ${capsule.id}`);
      await loadCapsules();
    } catch (err) {
      setMessage(`Error: ${err}`);
    }
  };

  const handleCreateGoal = async () => {
    try {
      const unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + 7); // 1 week from now

      const capsule = await createCapsule({
        type: 'goal',
        content: 'Complete React Native project by end of month',
        reflectionQuestion: 'Did you achieve this goal?',
        unlockDate,
      });

      setMessage(`Created capsule: ${capsule.id}`);
      await loadCapsules();
    } catch (err) {
      setMessage(`Error: ${err}`);
    }
  };

  const handleCreateMemory = async () => {
    try {
      const unlockDate = new Date();
      unlockDate.setMonth(unlockDate.getMonth() + 1); // 1 month from now

      const capsule = await createCapsule({
        type: 'memory',
        content: 'Amazing day at the beach with friends!',
        reflectionQuestion: null, // No reflection for memory
        unlockDate,
      });

      setMessage(`Created capsule: ${capsule.id}`);
      await loadCapsules();
    } catch (err) {
      setMessage(`Error: ${err}`);
    }
  };

  const handleCreateDecision = async () => {
    try {
      const unlockDate = new Date();
      unlockDate.setMonth(unlockDate.getMonth() + 3); // 3 months from now

      const capsule = await createCapsule({
        type: 'decision',
        content: 'Decided to switch to a new framework for better performance',
        reflectionQuestion: 'How would you rate this decision?',
        unlockDate,
      });

      setMessage(`Created capsule: ${capsule.id}`);
      await loadCapsules();
    } catch (err) {
      setMessage(`Error: ${err}`);
    }
  };

  // Update status
  const handleUpdateStatus = async () => {
    try {
      const count = await updatePendingCapsules();
      setMessage(`Updated ${count} capsules to ready`);
      await loadCapsules();
    } catch (err) {
      setMessage(`Error: ${err}`);
    }
  };

  // Get upcoming
  const handleGetUpcoming = async () => {
    try {
      const upcoming = await getUpcomingCapsules();
      setMessage(`Found ${upcoming.length} upcoming capsules`);
    } catch (err) {
      setMessage(`Error: ${err}`);
    }
  };

  // Get archive
  const handleGetArchive = async () => {
    try {
      const archive = await getOpenedCapsules();
      setMessage(`Found ${archive.length} opened capsules`);
    } catch (err) {
      setMessage(`Error: ${err}`);
    }
  };

  // Render loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Initializing Database...</Text>
      </View>
    );
  }

  // Render error
  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Database Error</Text>
        <Text style={styles.error}>{error?.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database Example</Text>
      <Text style={styles.status}>Database Ready ✓</Text>

      {/* Message */}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {/* Create Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Capsules</Text>
        <Button title="Create Emotion Capsule" onPress={handleCreateEmotion} />
        <View style={styles.spacer} />
        <Button title="Create Goal Capsule" onPress={handleCreateGoal} />
        <View style={styles.spacer} />
        <Button title="Create Memory Capsule" onPress={handleCreateMemory} />
        <View style={styles.spacer} />
        <Button title="Create Decision Capsule" onPress={handleCreateDecision} />
      </View>

      {/* Query Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Queries</Text>
        <Button title="Refresh All" onPress={loadCapsules} />
        <View style={styles.spacer} />
        <Button title="Get Upcoming (6)" onPress={handleGetUpcoming} />
        <View style={styles.spacer} />
        <Button title="Get Archive" onPress={handleGetArchive} />
        <View style={styles.spacer} />
        <Button title="Update Pending Status" onPress={handleUpdateStatus} />
      </View>

      {/* Capsule List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Capsules ({capsules.length})
        </Text>
        {capsules.map((capsule) => (
          <View key={capsule.id} style={styles.capsule}>
            <Text style={styles.capsuleType}>{capsule.type.toUpperCase()}</Text>
            <Text style={styles.capsuleStatus}>Status: {capsule.status}</Text>
            <Text style={styles.capsuleContent} numberOfLines={2}>
              {capsule.content}
            </Text>
            <Text style={styles.capsuleDate}>
              Unlock: {new Date(capsule.unlockDate).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: 'green',
    marginBottom: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  spacer: {
    height: 10,
  },
  capsule: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  capsuleType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  capsuleStatus: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  capsuleContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  capsuleDate: {
    fontSize: 12,
    color: '#999',
  },
});
