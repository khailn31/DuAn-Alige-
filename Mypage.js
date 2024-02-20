import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const App = ({ email }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(''); // Default balance, replace with actual initial balance
  const navigation = useNavigation()
  useEffect(() => {
    // Fetch user data including balance when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://192.168.56.1:3000/getUser?email=${email}`);
        if (response.ok) {
          const userData = await response.json();
          setBalance(parseFloat(userData.money) || 0); // Parse the money field as a float
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [email]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDeposit = async () => {
    try {
      const depositAmount = parseFloat(amount)+parseFloat(balance);

      if (!isNaN(depositAmount) && depositAmount > 0) {
        // Make a PUT request to update the balance on the server
        const response = await fetch('http://192.168.56.1:3000/login/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email, money: depositAmount.toString() }),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData); // Log the response from the server

          // Update the balance in the state after successful deposit
          toggleModal();
          setBalance( depositAmount);
        } else {
          console.error('Failed to update balance on the server');
        }
      } else {
        console.log('Invalid deposit amount');
      }
    } catch (error) {
      console.error('Error handling deposit:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.accountName}>{email.split('@')[0]}</Text>
        <Text style={styles.balance}>Số dư: ${balance} </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>Nạp tiền</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={()=>{
           navigation.navigate('Login');
        }}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Nạp tiền</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Nhập số tiền"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
          <View style={{ flexDirection: 'row' }}>
            <Button title="Nạp tiền" onPress={handleDeposit} />
            <Button title="Hủy" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  accountName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 16,
  },
  buttonsContainer: {
    marginTop: 60,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});


export default App;
