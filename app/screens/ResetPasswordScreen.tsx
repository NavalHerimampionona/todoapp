// screens/ResetPasswordScreen.tsx
import React from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { RootStackParamList } from "../App";

type ResetPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ResetPassword"
>;

interface ResetPasswordFormData {
  email: string;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    const { email } = data;
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent!");
      navigation.navigate("Login");
    } catch (error: any) {
            if (error.code === "auth/user-not-found") {
              Alert.alert("Reset Password Failed", "Please enter a valid email.");
            } else {
              Alert.alert("Reset Password Failed", error.message);
            }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

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

      {/* Submit Button */}
      <Button title="Send Reset Email" onPress={handleSubmit(onSubmit)} />
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

export default ResetPasswordScreen;
