import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';

import DashboardScreen from '../screens/Dashboard';
import EquipmentStack from './EquipmentStack';
import TasksStack from './TasksStack';
import PartsScreen from '../screens/Parts';
import InventoryScreen from '../screens/Inventory';
import ScheduleScreen from '../screens/Schedule';
import ReportScreen from '../screens/Report';

const Tab = createMaterialTopTabNavigator();
const initialLayout = { width: Dimensions.get('window').width };

export default function Tabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialLayout={initialLayout}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 120 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
          lazy: true,
          lazyPreloadDistance: 0,
          unmountOnBlur: true,
          detachInactiveScreens: true,
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Equipment" component={EquipmentStack} />
        <Tab.Screen name="Tasks" component={TasksStack} />
        <Tab.Screen name="Parts" component={PartsScreen} />
        <Tab.Screen name="Inventory" component={InventoryScreen} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
        <Tab.Screen name="Report" component={ReportScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
