import React, { useState } from 'react';
import { Button, TextInput, View, Text, StyleSheet, Alert } from 'react-native';

const Register = ({ navigation }) => {
  const [rePassword, setRePassword] = useState('');
  const [user, setUser] = useState({ email: '', password: '' });

  const checkNetworkConnectivity = async () => {
    // Sử dụng thư viện để kiểm tra kết nối mạng thực tế
    const isConnected = true;
    return isConnected;
  };

  const handleRegister = async () => {
    if (user.email.trim() === '' || user.password.trim() === '' || rePassword.trim() === '') {
      Alert.alert('Lỗi', 'Email và mật khẩu không được để trống');
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng');
      return;
    }

    if (user.password !== rePassword) {
      Alert.alert('Lỗi', 'Nhập lại mật khẩu không khớp');
      return;
    }
else{
  await addNewUser();
}

  };

  const addNewUser = async () => {
    try {
      const response = await fetch('http://192.168.56.1:3000/register/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.status === 200) {
        console.log('Đăng ký thành công');
        navigation.navigate('Login');
      } else {
        const errorData = await response.json();
        console.error('Lỗi khi đăng ký:', errorData.message);
        Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đăng ký');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontStyle: 'italic', marginBottom: 40 }}>Đăng Ký</Text>

      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setUser({ ...user, email: text })}
        value={user.email}
        placeholder="Nhập email"
      />

      <Text>Mật khẩu:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setUser({ ...user, password: text })}
        value={user.password}
        secureTextEntry={true}
        placeholder="Nhập mật khẩu"
      />

      <Text>Nhập lại mật khẩu:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setRePassword(text)}
        value={rePassword}
        secureTextEntry={true}
        placeholder="Nhập lại mật khẩu"
      />

      <Button title="Đăng ký" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 'auto',
    backgroundColor: '#6EA7EB',
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Register;
