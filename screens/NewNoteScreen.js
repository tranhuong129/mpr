import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { TRASH_NOTES } from '../models/dummy-data'; // Import dummy data

const TrashScreen = ({ navigation }) => {
  const [trashNotes, setTrashNotes] = useState(TRASH_NOTES);

  const handleRestoreNote = (noteId) => {
    // Filter out the note with the given ID
    const updatedNotes = trashNotes.filter(note => note.id !== noteId);
    setTrashNotes(updatedNotes);
    // You can add logic here to restore the note to the main list
  };

  const handleDeletePermanently = (noteId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this note permanently?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Filter out the note with the given ID
            const updatedNotes = trashNotes.filter(note => note.id !== noteId);
            setTrashNotes(updatedNotes);
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleRestoreAll = () => {
    // Logic to restore all notes (if needed)
    setTrashNotes([]);
  };

  const handleEmptyTrash = () => {
    Alert.alert(
      'Confirm Empty Trash',
      'Are you sure you want to empty the trash bin?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Empty Trash',
          onPress: () => setTrashNotes([]),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity style={styles.noteItem}>
      <View>
        <Text style={styles.noteContent}>{item.content}</Text>
        <View style={styles.actionButtons}>
          <Button title="Restore" onPress={() => handleRestoreNote(item.id)} />
          <Button title="Delete Permanently" onPress={() => handleDeletePermanently(item.id)} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trashNotes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.bottomButtons}>
        <Button title="Restore All" onPress={handleRestoreAll} />
        <Button title="Empty Trash" onPress={handleEmptyTrash} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noteItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noteContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});

export default TrashScreen;