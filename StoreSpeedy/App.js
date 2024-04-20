import { StatusBar } from 'expo-status-bar';
import {useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios, {Axios} from "axios";

export default function App() {

  useEffect(() => {
    testFunc();
    console.log("hello in app");
  }, []);
  const testFunc = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/test/testFunc',
      headers: { }
    };

    axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
