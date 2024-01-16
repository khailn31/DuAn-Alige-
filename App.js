import { useEffect } from "react";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetail from "./ProductDetail";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Bill from "./Bill";
import Mypage from "./Mypage";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function MainTabNavigator(){
  const route = useRoute();
  const email = route.params.email;
  return(
  <Tab.Navigator>
      <Tab.Screen name="Home"
        component={() => <Home email={email}/>}
        options={{
          headerShown: false,
          tabBarLabel: 'Trang chủ',

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
       <Tab.Screen name="Bill"
        component={() => <Bill email={email} />}
        options={{
          headerShown: false,
          tabBarLabel: 'Hóa đơn',

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" color={color} size={size} />
           
          ),
        }}
      />
       <Tab.Screen name="Mypage "
        component={() => <Mypage email={email} />}
        options={{
          headerShown: false,
          tabBarLabel: 'Tài khoản',

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
       </Tab.Navigator>)
}
function App() {
  useEffect(() => {

  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator >
      
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={MainTabNavigator}
       options={{ headerShown: false }}  />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;
