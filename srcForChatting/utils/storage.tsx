import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AsyncStorage } from 'react-native';

async function get(key: string, defaultValue = null) {
  try {
    let value = await AsyncStorage.getItem(key);

    if (value !== null) {
      value = JSON.parse(value);
    }
    // console.log('data ' + value);
    return value;
  } catch (error) {
    // Error retrieving data
    console.log('Could not save data: ' + key, error);
  }
}
async function set(key: string, value: any) {
  try {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Error saving data
    console.log('Could not save data: ' + key, error);
  }
  // return success;
}
async function remove(key: string) {}

async function clear() {
  try {
    return await AsyncStorage.clear(() => {
      console.log('cleared');
    });
  } catch (error) {
    // Error saving data
    console.log('Could not clear data ', error);
  }
}

export default {
  get,
  set,
  clear,
  remove,
};