import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../styles';

export default function EditEquipmentScreen({ route, navigation }) {
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
      const details = type === 'vehicle'
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
        <Picker selectedValue={type} onValueChange={setType}>
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
