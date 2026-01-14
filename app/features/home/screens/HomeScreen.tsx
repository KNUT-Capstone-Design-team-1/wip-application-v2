import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(`/${path}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈 화면</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate('pillImageSearch')}
      >
        <Text style={styles.buttonText}>이미지 검색하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate('pillIdentificationSearch')}
      >
        <Text style={styles.buttonText}>식별 검색하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate('setting')}
      >
        <Text style={styles.buttonText}>설정</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b3b90',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
