import React, { useEffect, useState } from 'react'
import { Button, TextInput, View, Text, StyleSheet, Image,TouchableOpacity, Alert } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'; 


function Login({ navigation }) {
   
 
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
 
    useEffect(() => {
  
      
      }, []);

      const handleLogin = () => {
        fetch('http://192.168.56.1:3000/login/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }), // Thêm dữ liệu người dùng vào body
        })
          .then((response) => {
            if (response.status===200) {
              alert("Đăng nhập thành công");
                navigation.navigate('Main',{email:email});
            }
            else{
                alert("Đăng nhập thất bại");
            }
          })
          
          .catch((error) => {
            // Xử lý lỗi mạng ở đây
            console.error('Lỗi mạng:', error);
          });
      };
      
    
      
   
   
     
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, fontStyle: 'italic', marginBottom: 40 }}>Welcome</Text>
            <Text >Email:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => {setEmail(text)} }
                value={email}
                placeholder="Nhập email"
            />
            <Text>Mật khẩu:</Text>
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                onChangeText={(password) => { setPassword(password) }}
                value={password}
                placeholder="Nhập mật khẩu"

            />
            <Button title="Đăng nhập" onPress={handleLogin} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                <Text>Bạn đã có tài khoản chưa?</Text>
                <Text onPress={() => {
                    navigation.navigate("Register")
                }}>Đăng ký</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 'auto',
        backgroundColor: '#6EA7EB',
        padding: 20
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

})

export default Login
