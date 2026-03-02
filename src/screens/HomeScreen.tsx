import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function HomeScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Dummy API call
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
      );

      const data: User[] = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError('Something went wrong: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Home Dashboard</Text>

      {/* Action Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>API Actions</Text>

        <TouchableOpacity style={styles.button} onPress={fetchUsers}>
          <Text style={styles.buttonText}>Fetch Users API</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && <ActivityIndicator size="large"  />}

      {/* Error */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Result */}
      {users.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Users List:</Text>

          {users.map(user => (
            <View key={user.id} style={styles.userCard}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text>{user.email}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  error: {
    color: 'red',
    marginTop: 20,
  },

  resultContainer: {
    marginTop: 20,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  userCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },

  userName: {
    fontWeight: 'bold',
  },
});