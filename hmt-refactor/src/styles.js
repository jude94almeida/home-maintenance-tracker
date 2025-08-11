import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Layout
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
  screenBody: { gap: 12, width: '100%' },
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

  // Cards
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
});
