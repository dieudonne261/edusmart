import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EduSmart Mobile</Text>
      <Text style={styles.subtitle}>App parents et eleves</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  subtitle: {
    color: '#52635C',
    fontSize: 16,
    marginTop: 8,
  },
  title: {
    color: '#1A4D3A',
    fontSize: 28,
    fontWeight: '700',
  },
})
