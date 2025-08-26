import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Button, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);

  const removeFavorite = async (id) => {
    const updated = favorites.filter(book => book.id !== id);
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    Alert.alert("🗑️ Eliminado de favoritos");
  };

  const openBook = (book) => {
    router.push({ pathname: "/details", params: { bookData: JSON.stringify(book) } });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={() => openBook(item)}>
        {item.volumeInfo.imageLinks?.thumbnail ? (
          <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={styles.image} />
        ) : (
          <View style={[styles.image, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text>📚</Text>
          </View>
        )}
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={styles.title}>{item.volumeInfo.title}</Text>
          <Text style={styles.author}>{item.volumeInfo.authors?.join(", ") || "Desconocido"}</Text>
        </View>
      </TouchableOpacity>
      <View style={{ marginTop: 5 }}>
        <Button title="Eliminar" color="#ef4444" onPress={() => removeFavorite(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>⭐ Mis Favoritos</Text>
      {favorites.length === 0 ? (
        <Text style={styles.empty}>No tienes libros guardados 📚</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  empty: { fontSize: 16, textAlign: 'center', marginTop: 50 },
  cardContainer: { marginBottom: 15 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 12, elevation: 3 },
  image: { width: 60, height: 90, borderRadius: 8 },
  title: { fontWeight: 'bold', fontSize: 16, color: '#1e293b' },
  author: { color: '#64748b', fontSize: 14, marginTop: 2 },
});
