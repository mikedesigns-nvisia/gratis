import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useTheme } from '../theme/provider';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Background, Typography } from '../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const handleSendMagicLink = async () => {
    if (!email.trim() || !isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signIn(email);
      
      if (error) {
        console.error('Error sending magic link:', error);
        Alert.alert('Error', error.message || 'Failed to send login link');
      } else {
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Error in magic link flow:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  return (
    <Background showWaves={true}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Typography variant="h1" align="center" gutterBottom>
              {emailSent ? 'Check Your Email' : 'Welcome to Gratis'}
            </Typography>
            
            {emailSent ? (
              <View style={styles.successContainer}>
                <Typography variant="body1" align="center" gutterBottom>
                  We've sent a magic link to <Text style={{ fontWeight: 'bold' }}>{email}</Text>
                </Typography>
                <Typography variant="body2" align="center" gutterBottom>
                  Click the link in your email to sign in to your account.
                </Typography>
                
                <Button 
                  label="Back to Login" 
                  variant="outline"
                  onPress={() => setEmailSent(false)}
                  style={styles.button}
                />
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Typography variant="body1" align="center" gutterBottom>
                  Sign in with a magic link sent to your email
                </Typography>
                
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  containerStyle={styles.inputContainer}
                />
                
                <Button 
                  label="Send Magic Link" 
                  onPress={handleSendMagicLink}
                  loading={loading}
                  disabled={loading || !email.trim()}
                  style={styles.button}
                />
                
                <Button 
                  label="Continue as Guest" 
                  variant="outline"
                  onPress={() => navigation.navigate('Home')}
                  style={[styles.button, styles.secondaryButton]}
                />
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  contentContainer: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  formContainer: {
    marginTop: 24,
  },
  successContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
  },
  secondaryButton: {
    marginTop: 8,
  },
});

export default AuthScreen;
