import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const HomeScreen = ({ email }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  navigator=  useNavigation();
  useEffect(() => {
    fetchData();
    
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.56.1:3000/products');
      const data = await response.json();
      console.log();
      setProducts(data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
    }
  };

  const handleSearch = () => {
    // You can perform additional search-related actions here if needed
    // For now, we are using the filter logic in the renderItem function
  };

  const filteredProducts = products.filter((item) =>
    item.tenSP.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigator.navigate('ProductDetail', {id:item._id,email:email,refreshData :fetchData})}
      >
      <Image source={{ uri: `http://192.168.56.1:3000/${item.anhSP[0]}` }} style={styles.image} />
      
      <Text style={styles.title}>{item.tenSP}</Text>
      <View style={{flexDirection:'row',justifyContent:"space-around"}}>
      <Text>Giá: ${item.giaSP} </Text>
      <Text> {item.soLuong !== 0 ? "Sl :" +item.soLuong : "Hết hàng"}</Text>
      </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh Sách Sản Phẩm</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <Button title="Tìm kiếm" onPress={handleSearch} />
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    paddingLeft: 8,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 5,
    marginVertical: 8,
    borderRadius: 10,
    margin: 8,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 2,
  },
  title: {
    textAlign:'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
