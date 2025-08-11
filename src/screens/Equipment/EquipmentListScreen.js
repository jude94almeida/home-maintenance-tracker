import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../styles';
import { loadJson, saveJson } from '../../services/storage';
import { EQUIP_STORE_KEY } from '../../utils/constants';

export default function EquipmentListScreen({ navigation }) {
  const [items, setItems] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);

  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('house'); // 'house'|'yard'|'vehicle'
  const [vin, setVin] = React.useState('');
  const [make, setMake] = React.useState('');
  const [modelName, setModelName] = React.useState('');
  const [year, setYear] = React.useState('');
  const [engine, setEngine] = React.useState('');
  const [serial, setSerial] = React.useState('');
  const [manufacturer, setManufacturer] = React.useState('');

  React.useEffect(() => { (async () => {
    const data = await loadJson(EQUIP_STORE_KEY, []);
    setItems(data || []);
  })(); }, []);

  React.useEffect(() => { saveJson(EQUIP_STORE_KEY, items); }, [items]);

  const resetForm = () => {
    setName(''); setType('house'); setVin(''); setMake(''); setModelName('');
    setYear(''); setEngine(''); setSerial(''); setManufacturer('');
  };

  const addEquipment = () => {
    const n = name.trim();
    if (!n) return;
    const details = type === 'vehicle'
      ? { vin: vin.trim(), make: make.trim(), model: modelName.trim(), year: year.trim(), engine: engine.trim() }
      : { serial: serial.trim(), manufacturer: manufacturer.trim(), model: modelName.trim(), year: year.trim() };
    setItems(prev => [{ id: Date.now().toString(), name: n, type, details }, ...prev]);
    resetForm();
    setShowModal(false);
  };

  const typeLabel = (t) => (t === 'house' ? 'House' : t === 'yard' ? 'Yard' : 'Vehicle');
  const preview = (item) => {
    const d = item.details || {};
    if (item.type === 'vehicle') {
      const line = [d.year, d.make, d.model].filter(Boolean).join(' ');
      return `${line}${d.vin ? ' • VIN: '+d.vin : ''}${d.engine ? ' • '+d.engine : ''}` || 'Vehicle';
    } else {
      const line = [d.manufacturer, d.model, d.year].filter(Boolean).join(' ');
      return `${line}${d.serial ? ' • SN: '+d.serial : ''}` || (item.type === 'house' ? 'House equipment' : 'Yard equipment');
    }
  };

return (
  <>
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Tasks</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.primaryBtnText}>+ New Task</Text>
          </TouchableOpacity>
        </>
      }
      ListEmptyComponent={
        <Text style={styles.placeholder}>No tasks yet. Create your first one!</Text>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('EditTask', { id: item.id, tasks, setTasks })}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.badge}>
              {item.type === 'one-time'
                ? 'One-time'
                : item.type === 'seasonal'
                ? 'Seasonal'
                : item.type === 'routine'
                ? 'Routine'
                : 'Follow-up'}
            </Text>
            <Text style={{ color: '#4b5563', marginTop: 4 }}>
              Start: {isoToLocalDate(item.startISO)}
              {item.recurrence !== 'once' ? `  •  ${describeRecurrence(item.recurrence)}` : ''}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />

    {/* Keep your existing New Task modal below */}
    <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Task</Text>

          <TextInput
            style={styles.input}
            placeholder="Title (e.g., Change HVAC filter)"
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.pickerWrap}>
            <Text style={{ marginBottom: 6, fontWeight: '600' }}>Task Type</Text>
            <Picker selectedValue={taskType} onValueChange={setTaskType}>
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
                  markedDates={marked}
                  onDayPress={(day) => { setStartDate(fromYmd(day.dateString)); setShowCal(false); }}
                />
                <View style={{ padding: 12, alignItems: 'flex-end' }}>
                  <TouchableOpacity style={styles.ghostBtn} onPress={() => setShowCal(false)}>
                    <Text style={styles.ghostBtnText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {isRecurring && (
            <View style={styles.pickerWrap}>
              <Text style={{ marginBottom: 6, fontWeight: '600' }}>Repeat</Text>
              <Picker selectedValue={recurrence} onValueChange={setRecurrence}>
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
  </>
);
}
