// screens/SignUpScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase";
import { RootStackParamList } from "../App";

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, "SignUp">;

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    const { email, password } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await sendEmailVerification(user);
        Alert.alert("success","Verification email sent. Please check your inbox.");
      }
      navigation.navigate("Login");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Sign-Up Failed", "This email is already in use. Please use another email or log in.");
      } else {
        Alert.alert("Sign-Up Failed", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Email Field */}
      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: "Invalid email format",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="Enter your email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* Password Field */}
      <Text>Password</Text>
      <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.errorInput]}
            placeholder="Enter your password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      {/* Submit Button */}
            <View>
            { isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />
            )}
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginBottom: 10 },
});

export default SignUpScreen;
