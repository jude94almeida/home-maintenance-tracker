import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { styles } from '../../styles';
import { yyyy_mm_dd, fromYmd } from '../../utils/date';

export default function EditTaskScreen({ route, navigation }) {
  const { id, tasks, setTasks } = route.params;
  const task = tasks.find(t => t.id === id);
  const [title, setTitle] = React.useState(task?.title ?? '');
  const [taskType, setTaskType] = React.useState(task?.type ?? 'one-time');
  const [startDate, setStartDate] = React.useState(task ? new Date(task.startISO) : new Date());
  const [showCal, setShowCal] = React.useState(false);
  const [recurrence, setRecurrence] = React.useState(task?.recurrence ?? 'once');

  const startStr = yyyy_mm_dd(startDate);
  const marked = React.useMemo(() => ({ [startStr]: { selected: true } }), [startStr]);

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

      {taskType !== 'one-time' && (
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

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.ghostBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={save}>
          <Text style={styles.primaryBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ghostBtn, { backgroundColor: '#fee2e2' }]} onPress={remove}>
          <Text style={[styles.ghostBtnText, { color: '#b91c1c' }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
