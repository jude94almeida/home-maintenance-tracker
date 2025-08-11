import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View, Text, StyleSheet, ScrollView, Dimensions,
  Modal, TextInput, TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ScreenWrapper({ title, children }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={{ gap: 12, width: '100%' }}>
        {children || <Text style={styles.placeholder}>Coming soon…</Text>}
      </View>
    </ScrollView>
  );
}

function DashboardScreen() { return <ScreenWrapper title="Dashboard" />; }

/* -------------------- Equipment Stack -------------------- */
const EquipStack = createNativeStackNavigator();
const EQUIP_STORE_KEY = 'hmt.equipment.v1';

function EquipmentListScreen({ navigation }) {
  const [items, setItems] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);

  // Common form state
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('house'); // 'house' | 'yard' | 'vehicle'

  // Vehicle fields
  const [vin, setVin] = React.useState('');
  const [make, setMake] = React.useState('');
  const [modelName, setModelName] = React.useState('');
  const [year, setYear] = React.useState('');
  const [engine, setEngine] = React.useState('');

  // House/Yard fields
  const [serial, setSerial] = React.useState('');
  const [manufacturer, setManufacturer] = React.useState('');

  // Load/save
  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(EQUIP_STORE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
    })();
  }, []);
  React.useEffect(() => {
    AsyncStorage.setItem(EQUIP_STORE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  const resetForm = () => {
    setName(''); setType('house'); setVin(''); setMake(''); setModelName('');
    setYear(''); setEngine(''); setSerial(''); setManufacturer('');
  };

  const addEquipment = () => {
    const n = name.trim();
    if (!n) return;

    const details =
      type === 'vehicle'
        ? { vin: vin.trim(), make: make.trim(), model: modelName.trim(), year: year.trim(), engine: engine.trim() }
        : { serial: serial.trim(), manufacturer: manufacturer.trim(), model: modelName.trim(), year: year.trim() };

    setItems(prev => [{ id: Date.now().toString(), name: n, type, details }, ...prev]);
    resetForm();
    setShowModal(false);
  };

  const typeLabel = (t) => (t === 'house' ? 'House' : t === 'yard' ? 'Yard' : 'Vehicle');

  const renderDetailsPreview = (item) => {
    const d = item.details || {};
    if (item.type === 'vehicle') {
      const line = [d.year, d.make, d.model].filter(Boolean).join(' ');
      const vinTxt = d.vin ? ` • VIN: ${d.vin}` : '';
      const engTxt = d.engine ? ` • ${d.engine}` : '';
      return `${line}${vinTxt}${engTxt}` || 'Vehicle';
    } else {
      const line = [d.manufacturer, d.model, d.year].filter(Boolean).join(' ');
      const sn = d.serial ? ` • SN: ${d.serial}` : '';
      return `${line}${sn}` || (item.type === 'house' ? 'House equipment' : 'Yard equipment');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Equipment</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowModal(true)}>
        <Text style={styles.primaryBtnText}>+ Add Equipment</Text>
      </TouchableOpacity>

      {items.length === 0 ? (
        <Text style={styles.placeholder}>No equipment yet. Add your first one!</Text>
      ) : (
        items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('EditEquipment', { id: item.id, items, setItems })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.badge}>{typeLabel(item.type)}</Text>
              <Text style={{ color: '#4b5563', marginTop: 4 }}>
                {renderDetailsPreview(item)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* Add Equipment Modal */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Equipment</Text>

            <TextInput style={styles.input} placeholder="Name (e.g., HVAC, Lawn Mower, F-150)" value={name} onChangeText={setName} />

            <View style={styles.pickerWrap}>
              <Text style={{ marginBottom: 6, fontWeight: '600' }}>Category</Text>
              <Picker selectedValue={type} onValueChange={v => setType(v)}>
                <Picker.Item label="House" value="house" />
                <Picker.Item label="Yard" value="yard" />
                <Picker.Item label="Vehicle" value="vehicle" />
              </Picker>
            </View>

            {type === 'vehicle' ? (
              <>
                <TextInput style={styles.input} placeholder="VIN" value={vin} autoCapitalize="characters" onChangeText={setVin} />
                <TextInput style={styles.input} placeholder="Make (e.g., Ford)" value={make} onChangeText={setMake} />
                <TextInput style={styles.input} placeholder="Model (e.g., F-150)" value={modelName} onChangeText={setModelName} />
                <TextInput style={styles.input} placeholder="Year (e.g., 2018)" keyboardType="number-pad" value={year} onChangeText={setYear} />
                <TextInput style={styles.input} placeholder="Engine (e.g., 5.0L V8)" value={engine} onChangeText={setEngine} />
              </>
            ) : (
              <>
                <TextInput style={styles.input} placeholder="Serial Number" value={serial} onChangeText={setSerial} />
                <TextInput style={styles.input} placeholder="Manufacturer" value={manufacturer} onChangeText={setManufacturer} />
                <TextInput style={styles.input} placeholder="Model" value={modelName} onChangeText={setModelName} />
                <TextInput style={styles.input} placeholder="Year (e.g., 2020)" keyboardType="number-pad" value={year} onChangeText={setYear} />
              </>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
              <TouchableOpacity style={styles.ghostBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={addEquipment}>
                <Text style={styles.primaryBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function EditEquipmentScreen({ route, navigation }) {
  const { id, items, setItems } = route.params;
  const item = items.find(i => i.id === id);

  const [name, setName] = React.useState(item?.name ?? '');
  const [type, setType] = React.useState(item?.type ?? 'house');

  const [vin, setVin] = React.useState(item?.details?.vin ?? '');
  const [make, setMake] = React.useState(item?.details?.make ?? '');
  const [modelName, setModelName] = React.useState(item?.details?.model ?? '');
  const [year, setYear] = React.useState(item?.details?.year ?? '');
  const [engine, setEngine] = React.useState(item?.details?.engine ?? '');

  const [serial, setSerial] = React.useState(item?.details?.serial ?? '');
  const [manufacturer, setManufacturer] = React.useState(item?.details?.manufacturer ?? '');

  const save = () => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const details =
        type === 'vehicle'
          ? { vin: vin.trim(), make: make.trim(), model: modelName.trim(), year: year.trim(), engine: engine.trim() }
          : { serial: serial.trim(), manufacturer: manufacturer.trim(), model: modelName.trim(), year: year.trim() };
      return { ...i, name: name.trim() || i.name, type, details };
    }));
    navigation.goBack();
  };

  const remove = () => {
    setItems(prev => prev.filter(i => i.id !== id));
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Equipment</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />

      <View style={styles.pickerWrap}>
        <Text style={{ marginBottom: 6, fontWeight: '600' }}>Category</Text>
        <Picker selectedValue={type} onValueChange={v => setType(v)}>
          <Picker.Item label="House" value="house" />
          <Picker.Item label="Yard" value="yard" />
          <Picker.Item label="Vehicle" value="vehicle" />
        </Picker>
      </View>

      {type === 'vehicle' ? (
        <>
          <TextInput style={styles.input} placeholder="VIN" value={vin} autoCapitalize="characters" onChangeText={setVin} />
          <TextInput style={styles.input} placeholder="Make" value={make} onChangeText={setMake} />
          <TextInput style={styles.input} placeholder="Model" value={modelName} onChangeText={setModelName} />
          <TextInput style={styles.input} placeholder="Year" keyboardType="number-pad" value={year} onChangeText={setYear} />
          <TextInput style={styles.input} placeholder="Engine" value={engine} onChangeText={setEngine} />
        </>
      ) : (
        <>
          <TextInput style={styles.input} placeholder="Serial Number" value={serial} onChangeText={setSerial} />
          <TextInput style={styles.input} placeholder="Manufacturer" value={manufacturer} onChangeText={setManufacturer} />
          <TextInput style={styles.input} placeholder="Model" value={modelName} onChangeText={setModelName} />
          <TextInput style={styles.input} placeholder="Year" keyboardType="number-pad" value={year} onChangeText={setYear} />
        </>
      )}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.ghostBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={save}>
          <Text style={styles.primaryBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ghostBtn, { backgroundColor: '#fee2e2' }]} onPress={remove}>
          <Text style={[styles.ghostBtnText, { color: '#b91c1c' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function EquipmentStack() {
  return (
    <EquipStack.Navigator>
      <EquipStack.Screen name="EquipmentList" component={EquipmentListScreen} options={{ title: 'Equipment' }} />
      <EquipStack.Screen name="EditEquipment" component={EditEquipmentScreen} options={{ title: 'Edit Equipment' }} />
    </EquipStack.Navigator>
  );
}

/* -------------------- Tasks Stack -------------------- */
const TaskStack = createNativeStackNavigator();
const TASK_STORE_KEY = 'hmt.tasks.v1';

function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);

  // Form state
  const [title, setTitle] = React.useState('');
  const [taskType, setTaskType] = React.useState('one-time'); // 'one-time'|'seasonal'|'routine'|'follow-up'
  const [startDate, setStartDate] = React.useState(new Date());
  const [showCal, setShowCal] = React.useState(false);
  const [recurrence, setRecurrence] = React.useState('weekly');

  // Load/save
  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(TASK_STORE_KEY);
        if (raw) setTasks(JSON.parse(raw));
      } catch {}
    })();
  }, []);
  React.useEffect(() => {
    AsyncStorage.setItem(TASK_STORE_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks]);

  const isRecurring = taskType !== 'one-time';
  const resetForm = () => {
    setTitle('');
    setTaskType('one-time');
    setStartDate(new Date());
    setRecurrence('weekly');
    setShowCal(false);
  };

  const addTask = () => {
    const t = title.trim();
    if (!t) return;
    const task = {
      id: Date.now().toString(),
      title: t,
      type: taskType,
      startISO: startDate.toISOString(),
      recurrence: isRecurring ? recurrence : 'once',
      createdAt: Date.now(),
    };
    setTasks(prev => [task, ...prev]);
    resetForm();
    setShowModal(false);
  };

  const formatDate = iso => new Date(iso).toLocaleDateString();
  const startStr = startDate.toISOString().slice(0,10);
  const onCalendarSelect = (day) => {
    const parts = day.dateString.split('-');
    const picked = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    setStartDate(picked);
    setShowCal(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowModal(true)}>
        <Text style={styles.primaryBtnText}>+ New Task</Text>
      </TouchableOpacity>

      {tasks.length === 0 ? (
        <Text style={styles.placeholder}>No tasks yet. Create your first one!</Text>
      ) : (
        tasks.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('EditTask', { id: item.id, tasks, setTasks })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.badge}>
                {item.type === 'one-time' ? 'One-time'
                  : item.type === 'seasonal' ? 'Seasonal'
                  : item.type === 'routine' ? 'Routine' : 'Follow-up'}
              </Text>
              <Text style={{ color: '#4b5563', marginTop: 4 }}>
                Start: {formatDate(item.startISO)}
                {item.recurrence !== 'once' ? `  •  ${{
                  weekly:'Weekly', biweekly:'Biweekly', monthly:'Monthly',
                  quarterly:'Quarterly', every_6_months:'Every 6 months',
                  annually:'Annually', every_other_year:'Every other year'
                }[item.recurrence]}` : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* New Task Modal */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent]}>
            <Text style={styles.modalTitle}>New Task</Text>

            <TextInput style={styles.input} placeholder="Title (e.g., Change HVAC filter)" value={title} onChangeText={setTitle} />

            <View style={styles.pickerWrap}>
              <Text style={{ marginBottom: 6, fontWeight: '600' }}>Task Type</Text>
              <Picker selectedValue={taskType} onValueChange={v => setTaskType(v)}>
                <Picker.Item label="One-time" value="one-time" />
                <Picker.Item label="Seasonal" value="seasonal" />
                <Picker.Item label="Routine maintenance" value="routine" />
                <Picker.Item label="Follow-up" value="follow-up" />
              </Picker>
            </View>

            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowCal(true)}>
              <Text style={styles.dateBtnText}>Start date: {startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <Modal visible={showCal} transparent animationType="fade" onRequestClose={() => setShowCal(false)}>
              <View style={styles.modalBackdrop}>
                <View style={[styles.modalContent, { padding: 0 }]}>
                  <Calendar
                    initialDate={startStr}
                    markedDates={{ [startStr]: { selected: true } }}
                    onDayPress={onCalendarSelect}
                  />
                  <View style={{ padding: 12, alignItems: 'flex-end' }}>
                    <TouchableOpacity style={styles.ghostBtn} onPress={() => setShowCal(false)}>
                      <Text style={styles.ghostBtnText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {taskType !== 'one-time' && (
              <View style={styles.pickerWrap}>
                <Text style={{ marginBottom: 6, fontWeight: '600' }}>Repeat</Text>
                <Picker selectedValue={recurrence} onValueChange={v => setRecurrence(v)}>
                  <Picker.Item label="Weekly" value="weekly" />
                  <Picker.Item label="Biweekly" value="biweekly" />
                  <Picker.Item label="Monthly" value="monthly" />
                  <Picker.Item label="Quarterly" value="quarterly" />
                  <Picker.Item label="Every 6 months" value="every_6_months" />
                  <Picker.Item label="Annually" value="annually" />
                  <Picker.Item label="Every other year" value="every_other_year" />
                </Picker>
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity style={styles.ghostBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={addTask}>
                <Text style={styles.primaryBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function EditTaskScreen({ route, navigation }) {
  const { id, tasks, setTasks } = route.params;
  const task = tasks.find(t => t.id === id);

  const [title, setTitle] = React.useState(task?.title ?? '');
  const [taskType, setTaskType] = React.useState(task?.type ?? 'one-time');
  const [startDate, setStartDate] = React.useState(task ? new Date(task.startISO) : new Date());
  const [showCal, setShowCal] = React.useState(false);
  const [recurrence, setRecurrence] = React.useState(task?.recurrence ?? 'once');

  const startStr = startDate.toISOString().slice(0,10);
  const onCalendarSelect = (day) => {
    const parts = day.dateString.split('-');
    const picked = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    setStartDate(picked);
    setShowCal(false);
  };

  const save = () => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        title: title.trim() || t.title,
        type: taskType,
        startISO: startDate.toISOString(),
        recurrence: taskType === 'one-time' ? 'once' : recurrence,
      };
    }));
    navigation.goBack();
  };

  const remove = () => {
    setTasks(prev => prev.filter(t => t.id !== id));
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Task</Text>

      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />

      <View style={styles.pickerWrap}>
        <Text style={{ marginBottom: 6, fontWeight: '600' }}>Task Type</Text>
        <Picker selectedValue={taskType} onValueChange={v => setTaskType(v)}>
          <Picker.Item label="One-time" value="one-time" />
          <Picker.Item label="Seasonal" value="seasonal" />
          <Picker.Item label="Routine maintenance" value="routine" />
          <Picker.Item label="Follow-up" value="follow-up" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.dateBtn} onPress={() => setShowCal(true)}>
        <Text style={styles.dateBtnText}>Start date: {startDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      <Modal visible={showCal} transparent animationType="fade" onRequestClose={() => setShowCal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { padding: 0 }]}>
            <Calendar
              initialDate={startStr}
              markedDates={{ [startStr]: { selected: true } }}
              onDayPress={onCalendarSelect}
            />
            <View style={{ padding: 12, alignItems: 'flex-end' }}>
              <TouchableOpacity style={styles.ghostBtn} onPress={() => setShowCal(false)}>
                <Text style={styles.ghostBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {taskType !== 'one-time' && (
        <View style={styles.pickerWrap}>
          <Text style={{ marginBottom: 6, fontWeight: '600' }}>Repeat</Text>
          <Picker selectedValue={recurrence} onValueChange={v => setRecurrence(v)}>
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Biweekly" value="biweekly" />
            <Picker.Item label="Monthly" value="monthly" />
            <Picker.Item label="Quarterly" value="quarterly" />
            <Picker.Item label="Every 6 months" value="every_6_months" />
            <Picker.Item label="Annually" value="annually" />
            <Picker.Item label="Every other year" value="every_other_year" />
          </Picker>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.ghostBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={save}>
          <Text style={styles.primaryBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ghostBtn, { backgroundColor: '#fee2e2' }]} onPress={remove}>
          <Text style={[styles.ghostBtnText, { color: '#b91c1c' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function TasksStack() {
  return (
    <TaskStack.Navigator>
      <TaskStack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
      <TaskStack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Edit Task' }} />
    </TaskStack.Navigator>
  );
}

/* -------------------- Tabs -------------------- */
const Tab = createMaterialTopTabNavigator();
const initialLayout = { width: Dimensions.get('window').width };

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialLayout={initialLayout}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 120 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Equipment" component={EquipmentStack} />
        <Tab.Screen name="Tasks" component={TasksStack} />
        <Tab.Screen name="Parts" component={() => <ScreenWrapper title="Parts" />} />
        <Tab.Screen name="Inventory" component={() => <ScreenWrapper title="Inventory" />} />
        <Tab.Screen name="Schedule" component={() => <ScreenWrapper title="Schedule" />} />
        <Tab.Screen name="Report" component={() => <ScreenWrapper title="Report" />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  // Date button
  dateBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  dateBtnText: { fontSize: 14 },

  // Base
  container: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholder: { color: '#666', textAlign: 'center' },

  // Buttons
  primaryBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  primaryBtnText: { color: '#fff', fontWeight: '600' },
  ghostBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  ghostBtnText: { color: '#374151', fontWeight: '600' },

  // Card
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  badge: { fontSize: 12, color: '#6b7280' },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 8,
  },
});
