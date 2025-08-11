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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Equipment</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowModal(true)}>
        <Text style={styles.primaryBtnText}>+ Add Equipment</Text>
      </TouchableOpacity>

      {items.length === 0 ? (
        <Text style={styles.placeholder}>No equipment yet. Add your first one!</Text>
      ) : (
        items.map(item => (
          <TouchableOpacity key={item.id} style={styles.card}
            onPress={() => navigation.navigate('EditEquipment', { id: item.id, items, setItems })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.badge}>{typeLabel(item.type)}</Text>
              <Text style={{ color: '#4b5563', marginTop: 4 }}>{preview(item)}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Equipment</Text>

            <TextInput style={styles.input} placeholder="Name (e.g., HVAC, Lawn Mower, F-150)"
              value={name} onChangeText={setName} />

            <View style={styles.pickerWrap}>
              <Text style={{ marginBottom: 6, fontWeight: '600' }}>Category</Text>
              <Picker selectedValue={type} onValueChange={setType}>
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
