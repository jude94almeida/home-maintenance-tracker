import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/Tasks/TaskListScreen';
import EditTaskScreen from '../screens/Tasks/EditTaskScreen';

const Stack = createNativeStackNavigator();

export default function TasksStack() {
  return (
    <Stack.Navigator screenOptions={{ detachInactiveScreens: true }}>
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Edit Task' }} />
    </Stack.Navigator>
  );
}
