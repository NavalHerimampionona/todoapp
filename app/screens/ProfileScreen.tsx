import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { RootTabParamList } from '../App';
import { auth } from '../../firebase';
import { signOut } from '@firebase/auth';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type ProfileScreenProps = BottomTabScreenProps<RootTabParamList, "Profile">;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);

    const handleLogout = async () => {
      setIsLoading(true);
        try {
          await signOut(auth);
        } catch (error: any) {
          console.error("Logout Failed", error.message);
        } finally {
          setIsLoading(false);
      };
    }

  return (

          <View style={styles.container}>
          { isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Logout" onPress={handleLogout} />
          )}
          </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { marginBottom: 20 },
});

export default ProfileScreen;