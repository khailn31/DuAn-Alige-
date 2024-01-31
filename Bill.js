import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const Bill = ({ email }) => {
  const [orderHistoryData, setOrderHistoryData] = useState([]);

  useEffect(() => {
    // Hàm fetchBillByEmail để lấy lịch sử đơn hàng theo email từ máy chủ
    const fetchBillByEmail = async () => {
      try {
        const response = await fetch(`http://192.168.56.1:3000/bills/${email}`);
        const data = await response.json();
        setOrderHistoryData(data.reverse());
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    // Gọi hàm fetchBillByEmail khi component được mount
    fetchBillByEmail();
  }, [email]);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItemContainer}>
      <Text style={styles.productName}>{item.tenSP}</Text>
      <Text style={styles.quantity}>số lượng: {item.soLuong}</Text>
      <Text style={styles.date}>Ngày mua: {item.ngay}</Text>
      <Text style={styles.totalAmount}>Tổng tiền: ${item.tongTien}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hóa Đơn</Text>
      <FlatList
        data={orderHistoryData}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default Bill;
