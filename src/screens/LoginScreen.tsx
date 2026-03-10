import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {login} from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({}: Props) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secureText, setSecureText] = useState<boolean>(true);
  const dispatch  = useDispatch()
 const handleLogin = () => {
  if (!username.trim() || !password.trim()) {
    Alert.alert('Error', 'Enter username and password');
    return;
  }
  // navigation.navigate('MainApp')

  dispatch(login(username)); // save to redux
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      {/* Username */}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
          style={styles.passwordInput}
        />

        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Text style={styles.showText}>
            {secureText ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Dummy hint */}
      <Text style={styles.hint}>
        (Enter any username & password to login)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 15,
  },

  showText: {
    color: '#007bff',
    fontWeight: '600',
  },

  loginBtn: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  hint: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
});