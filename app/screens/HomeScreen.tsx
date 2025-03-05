import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../App';
import { Controller, useForm } from 'react-hook-form';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

type HomeScreenProps = BottomTabScreenProps<RootTabParamList, "Home">;

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const { control, handleSubmit, reset } = useForm<{ title: string }>();
  const [todos, setTodos] = useState<Todo[]>([]);
  const userId = auth.currentUser ? auth.currentUser.uid : ''; // Replace with actual user ID

  // Reference to the user's todos collection
  const todosRef = collection(db, 'users', userId, 'todos');

  // Fetch todos in real-time
  useEffect(() => {
    const q = query(todosRef, orderBy('createdAt', 'desc')); // Query todos ordered by creation time
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTodos: Todo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];
      setTodos(fetchedTodos);
    });

    return () => unsubscribe();
  }, []);

  // Add a new todo
  const addTodo = async (data: { title: string }) => {
    if (data.title.trim()) {
      await addDoc(todosRef, {
        title: data.title,
        completed: false,
        createdAt: serverTimestamp(),
      });
      reset(); // Reset the input field
    }
  };

  // Update todo's completion status
  const updateTodo = async (id: string, completed: boolean) => {
    const todoDocRef = doc(db, 'users', userId, 'todos', id);
    await updateDoc(todoDocRef, { completed: !completed });
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    const todoDocRef = doc(db, 'users', userId, 'todos', id);
    await deleteDoc(todoDocRef);
  };

  return (
    <View style={styles.container}>
      {/* Add Todo */}
      <View style={styles.addTodoContainer}>
        <Controller
          control={control}
          name="title"
          rules={{ required: 'Todo title is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Add a todo"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Button title="Add" onPress={handleSubmit(addTodo)} />
      </View>

      {/* Display Todos */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text
              style={[
                styles.todoText,
                item.completed && styles.completedTodo,
              ]}
            >
              {item.title}
            </Text>
            <View style={styles.actions}>
              <Button
                title={item.completed ? 'Undo' : 'Done'}
                onPress={() => updateTodo(item.id, item.completed)}
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => deleteTodo(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 20,
    backgroundColor: '#fff',
  },
  addTodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  todoText: {
    fontSize: 16,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
export default HomeScreen