import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import './user-agent';
import io from 'socket.io-client';

import names from './names.json';
import lastNames from './last-names.json';
import serverAddress from './server-address.json';

const App = () => {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const socketRef = useRef();

  useEffect(() => {
    const socket = io(serverAddress);

    socketRef.current = socket;

    return () => socket.close();
  }, []);

  const handleSubmit = function handleSubmit(event) {
    const person = { name, age };
    setPeople((old) => [...old, person]);
    socketRef.current.emit('addPerson', person);
    event.preventDefault();
  }

  const handlePress = function handlePress() {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomAge = Math.floor(Math.random() * 100);
    const person = { name: `${randomName} ${randomLastName}`, age: randomAge };
    setPeople((old) => [...old, person]);
    socketRef.current.emit('addPerson', person);
  }

  return (
    <View>
      <Text style={{ marginTop: 60, padding: 20 }}>App One Cool</Text>
      <SafeAreaView>
        <Text>Name</Text>
        <TextInput value={name} onChangeText={setName} />
        <Text>Age</Text>
        <TextInput value={age} onChangeText={setAge} />
        <Text>Submit</Text>
        <Button title="submit" onPress={handleSubmit} />
      </SafeAreaView>
      <SafeAreaView>
        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, marginBottom: 10 }} onPress={handlePress}>
          <Text style={{ color: 'white' }}> Add a person </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <FlatList
        data={people}
        keyExtractor={({ name, age }, index) => `key:${name}${age}${index}`}
        renderItem={(person) => <Text>{`name: ${person.item.name} age: ${person.item.age}`}</Text>}
        ListHeaderComponent={<Text>App One Cool</Text>}
        ListFooterComponent={<Text>Take care and stay safe!</Text>}
      />
    </View>
  );
};



export default App;
