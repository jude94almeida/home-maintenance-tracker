import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { styles } from '../../styles';
import { loadJson, saveJson } from '../../services/storage';
import { TASK_STORE_KEY } from '../../utils/constants';
import { describeRecurrence } from '../../utils/recurrence';
import { isoToLocalDate, yyyy_mm_dd, fromYmd } from '../../utils/date';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [taskType, setTaskType] = React.useState('one-time');
  const [startDate, setStartDate] = React.useState(new Date());
  const [showCal, setShowCal] = React.useState(false);
  const [recurrence, setRecurrence] = React.useState('weekly');

  React.useEffect(() => { (async () => {
    const data = await loadJson(TASK_STORE_KEY, []);
    setTasks(data || []);
  })(); }, []);

  React.useEffect(() => { saveJson(TASK_STORE_KEY, tasks); }, [tasks]);

  const isRecurring = taskType !== 'one-time';
  const resetForm = () => {
    setTitle(''); setTaskType('one-time'); setStartDate(new Date());
    setRecurrence('weekly'); setShowCal(false);
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
    resetForm(); setShowModal(false);
  };

  const startStr = yyyy_mm_dd(startDate);
  const marked = React.useMemo(() => ({ [startStr]: { selected: true } }), [startStr]);

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
          <TouchableOpacity key={item.id} style={styles.card}
            onPress={() => navigation.navigate('EditTask', { id: item.id, tasks, setTasks })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.badge}>
                {item.type === 'one-time' ? 'One-time' : item.type === 'seasonal' ? 'Seasonal' : item.type === 'routine' ? 'Routine' : 'Follow-up'}
              </Text>
              <Text style={{ color: '#4b5563', marginTop: 4 }}>
                Start: {isoToLocalDate(item.startISO)}{item.recurrence !== 'once' ? `  •  ${describeRecurrence(item.recurrence)}` : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Task</Text>

            <TextInput style={styles.input} placeholder="Title (e.g., Change HVAC filter)" value={title} onChangeText={setTitle} />

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
    </ScrollView>
  );
}
