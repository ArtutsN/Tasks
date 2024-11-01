import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const [input, setInput] = useState("")
  const [list, setList] = useState([])

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const storedList = await AsyncStorage.getItem('taskList')
      if (storedList) {
        setList(JSON.parse(storedList))
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas", error)
    }
  }

  const Add = async () => {
    if (input.trim() === "") return

    const newList = [...list, input]
    setList(newList)
    setInput("")

    try {
      await AsyncStorage.setItem('taskList', JSON.stringify(newList))
    } catch (error) {
      console.error("Erro ao salvar tarefa", error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas</Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        style={styles.input}
        placeholder="Adicionar nova tarefa"
        placeholderTextColor={"gray"}
      />
      <Button onPress={Add} title="Adicionar tarefa" />

      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  card: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },

  text: {
    fontSize: 16,
  },
})
