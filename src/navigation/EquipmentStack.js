import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EquipmentListScreen from '../screens/Equipment/EquipmentListScreen';
import EditEquipmentScreen from '../screens/Equipment/EditEquipmentScreen';

const Stack = createNativeStackNavigator();

export default function EquipmentStack() {
  return (
    <Stack.Navigator screenOptions={{ detachInactiveScreens: true }}>
      <Stack.Screen name="EquipmentList" component={EquipmentListScreen} options={{ title: 'Equipment' }} />
      <Stack.Screen name="EditEquipment" component={EditEquipmentScreen} options={{ title: 'Edit Equipment' }} />
    </Stack.Navigator>
  );
}
