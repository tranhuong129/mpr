import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { NOTES, LABELS } from '../models/dummy-data'; // Import dummy data

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState(NOTES);
  const [searchQuery, setSearchQuery] = useState('');

  const addNote = (newNote) => {
    const noteWithContent = { ...newNote, content: newNote.content || '' };
    setNotes([...notes, noteWithContent]);
  };

  const updateNote = (updatedNote) => {
    setNotes(notes.map(note => (note.id === updatedNote.id ? updatedNote : note)));
  };

  const renderNoteItem = ({ item }) => {
    const noteLabels = item.labelIds.map(labelId => {
      const label = LABELS.find(l => l.id === labelId);
      return label ? label.label : '';
    });

    const formattedDate = new Date(item.updateAt).toLocaleString(); // Format date

    return (
      <TouchableOpacity onPress={() => navigation.navigate('EditNote', { note: item, updateNoteCallback: updateNote })}>
        <View style={[styles.note, { backgroundColor: item.color || '#fff' }]}>
          <View style={styles.labelsContainer}>
            {noteLabels.map((label, index) => (
              <View key={index} style={styles.label}>
                <Text>{label}</Text>
              </View>
            ))}
          </View>
          <Text>{item.content}</Text>
          <View style={styles.bottomContainer}>
            <Text style={styles.infoText}>{formattedDate}</Text>
            <Text style={styles.infoText}>{item.isBookmarked ? 'Bookmark' : 'Not bookmarked'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredNotes = notes.filter((note) =>
    note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{filteredNotes.length} Notes</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search notes"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        <Icon name="search" size={24} color="black" />
      </View>
      <FlatList
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NewNote', { addNoteCallback: addNote })}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
  },
  note: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderRadius: 8,
  },
  labelsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  label: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoText: {
    color: 'gray',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;