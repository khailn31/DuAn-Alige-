import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, Button, Modal, TextInput, TouchableOpacity } from 'react-native';

const ProductDetail = ({ route }) => {
  const { id, email, refreshData } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [userBalance, setUserBalance] = useState(0);
  const [product, setProduct] = useState(null);
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchData = async (url, setterFunction) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setterFunction(data);
      } else {
        console.error(`Failed to fetch data from ${url}`);
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    fetchData(`http://192.168.56.1:3000/getUser?email=${email}`, (userData) => {
      setUserBalance(parseFloat(userData.money) || 0);
    });

    fetchData(`http://192.168.56.1:3000/products/${id}`, setProduct);
  }, [id, email]);

  const handleOrder = async () => {
    try {
      if (quantity > product.soLuong) {
        alert('Số lượng đặt mua vượt quá số lượng có sẵn');
        return;
      }
      if (userBalance < quantity * product.giaSP) {
        alert('Số dư của bạn không đủ, vui lòng nạp thêm tiền');
        return;
      }

      const orderResponse = await fetch('http://192.168.56.1:3000/bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          tenSP: product.tenSP,
          soLuong: quantity,
          ngay: new Date().toLocaleDateString(),
          tongTien: quantity * product.giaSP,
        }),
      });

      const orderData = await orderResponse.json();

      if (orderData.success) {
        const updatedBalance = userBalance - quantity * product.giaSP;
        await fetch('http://192.168.56.1:3000/login/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            money: updatedBalance,
          }),
        });

        const updatedProductCount = product.soLuong - quantity;
        await fetch(`http://192.168.56.1:3000/products/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            soLuong: updatedProductCount,
          }),
        });

        alert('Đặt hàng thành công');
        fetchData(`http://192.168.56.1:3000/products/${id}`, setProduct);
        refreshData(),
        toggleModal();
      } else {
        alert(orderData.error || 'Có lỗi xảy ra khi đặt hàng');
      }
    } catch (error) {
      console.error('Lỗi xử lý đặt hàng:', error);
      alert('Đã có lỗi xảy ra');
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderProductDetails = () => {
    return (
      <>
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: `http://192.168.56.1:3000/${product.anhSP[0]}` }} style={styles.image} />
          <Image source={{ uri: `http://192.168.56.1:3000/${product.anhSP[1]}` }} style={styles.image} />
        </View>
        <Text style={styles.title}>Tên SP: {product.tenSP}</Text>
        <Text>Giá:$ {product.giaSP} </Text>
        <Text>Số lượng: {product.soLuong}</Text>
        <Text>Mô tả: {product.moTa}</Text>

        <TouchableOpacity onPress={toggleModal} style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Đặt mua</Text>
        </TouchableOpacity>

        <Modal visible={isModalVisible} >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Đơn hàng</Text>
            <Text style={{fontSize:20}}>Tên sản phẩm: {product.tenSP}</Text>
            <View style={styles.quantityContainer}>
              <Text style={{fontSize:20,marginTop:10}}>Số lượng:</Text>
              <TouchableOpacity onPress={handleDecreaseQuantity}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={(text) => setQuantity(text)}
              />
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={{fontSize:20,marginTop:10}}>Giá: {product.giaSP}</Text>
            <Text style={{fontSize:20,marginTop:10}}>Ngày mua: {new Date().toLocaleDateString()}</Text>
            <Text style={{fontSize:20,marginTop:10}}>Tổng tiền: ${quantity * product.giaSP}</Text>
            <View style={{ flexDirection: 'row', marginTop: 20}}>
              <Button title="Đặt mua" onPress={handleOrder} />
              <Button title="Hủy" onPress={toggleModal} />
            </View>
          </View>
        </Modal>
      </>
    );
  };

  return <View style={styles.container}>{product ? renderProductDetails() : null}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '50%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  orderButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  orderButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
    modalContainer: {
      alignItems: 'center',
      flex: 0.5,
      justifyContent: 'center',
      margin: 20, // Increase padding for better spacing
      borderRadius: 10,
     borderWidth: 2, // Add border width
     borderColor: '#000', // Add border color// Add border radius for rounded corners
    },
  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center'
  },
  quantityButton: {
    marginTop:10,
    fontSize: 20,
    marginHorizontal: 8,
  },
  input: {
    textAlign:'center',
    marginTop:10,
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default ProductDetail;
