import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Modal, Text, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { LABELS } from '../models/dummy-data'; // Import dummy data

const EditNoteScreen = ({ route, navigation }) => {
  const { note, updateNoteCallback } = route.params;
  const [text, setText] = useState(note.content);
  const [isBookmarked, setIsBookmarked] = useState(note.isBookmarked || false);
  const [modalVisible, setModalVisible] = useState(false);
  const [labels, setLabels] = useState(note.labels || []); // Assuming note.labels contains the labels of the note
  const [color, setColor] = useState(note.color || '');

  const colors = [
    'lightseagreen', 'skyblue', 'lightcoral',
    'lightpink', 'lightgreen', 'lightblue',
    'orange', 'palegreen'
   ];
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={handleSaveNote}
          title="Save"
        />
      ),
    });
  }, [text, isBookmarked, labels, color]);

  const handleSaveNote = () => {
    const updatedNote = { ...note, content: text, isBookmarked, labels, color, updateAt: new Date() };
    if (updateNoteCallback) {
      updateNoteCallback(updatedNote);
    }
    navigation.navigate('Home', { updatedNote });
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleDeleteNote = () => {
    if (route.params.deleteNoteCallback) {
      route.params.deleteNoteCallback(note.id);
    }
    navigation.navigate('Home');
  };

  const handleMoveToTrash = () => {
    if (route.params.moveToTrashCallback) {
      route.params.moveToTrashCallback(note.id);
    }
    navigation.navigate('Home');
  };

  const renderLabelItem = ({ item }) => (
    <View style={styles.labelContainer}>
      <Text style={styles.labelText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <View style={styles.bottomBorder}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleBookmarkToggle}
          >
            <Icon name={isBookmarked ? "bookmark" : "bookmark-outline"} size={30} color="white" type="material" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.moreVertButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="more-vert" size={30} color="white" type="material" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={colors}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.colorCircle, { backgroundColor: item }]}
                  onPress={() => setColor(item)}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              style={styles.colorList}
            />
            <View style={styles.manageLabelsContainer}>
              <FlatList
                data={labels.map(labelId => {
                  const label = LABELS.find(l => l.id === labelId);
                  return label ? label.label : '';
                })}
                renderItem={renderLabelItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                style={styles.labelsList}
              />
              <Button title="+ Manage Labels" onPress={() => { setModalVisible(false); navigation.navigate('ManageLabels', { note, updateNoteCallback }); }} />
            </View>
            <TouchableOpacity onPress={() => { /* handle copy to clipboard */ }}>
              <Text style={styles.modalText}>Copy to Clipboard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* handle share */ }}>
              <Text style={styles.modalText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteNote}>
              <Text style={styles.modalText}>Delete</Text> 
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* handle make a copy */ }}>
              <Text style={styles.modalText}>Make a Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* handle pin */ }}>
              <Text style={styles.modalText}>Pin</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* handle add a reminder */ }}>
              <Text style={styles.modalText}>Add a Reminder</Text>
            </TouchableOpacity>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 5,
  },
  input: {
    padding: 8,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  bottomBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    backgroundColor: 'gray',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  bookmarkButton: {
    marginRight: 10,
  },
  moreVertButton: {
    marginLeft: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    fontSize: 18,
    padding: 10,
  },
  colorList: {
    marginBottom: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  manageLabelsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelsList: {
    flexGrow: 0,
    marginRight: 10,
  },
  labelContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
  },
  labelText: {
    fontSize: 14,
  },
});

export default EditNoteScreen;