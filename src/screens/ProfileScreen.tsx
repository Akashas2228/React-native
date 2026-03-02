import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>

        <Text style={styles.name}>test</Text>
        <Text style={styles.email}>test@example.com</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>User Information</Text>

        <Text style={styles.infoText}>Username: test</Text>
        <Text style={styles.infoText}>Phone: +91 2732873489328</Text>
        <Text style={styles.infoText}>Location: Tamil Nadu</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Actions</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutBtn]}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>

        <Text style={styles.settingItem}>🔔 Notifications</Text>
        <Text style={styles.settingItem}>🌙 Dark Mode</Text>
        <Text style={styles.settingItem}>🔐 Privacy</Text>
        <Text style={styles.settingItem}>📄 Terms & Conditions</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  email: {
    color: 'gray',
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

  infoText: {
    marginBottom: 5,
  },

  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  logoutBtn: {
    backgroundColor: '#dc3545',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  settingItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});