import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { GOOGLE_BOOKS_API, GOOGLE_BOOKS_API_KEY } from "../utils/config";
import { LinearGradient } from "expo-linear-gradient";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const url = `${GOOGLE_BOOKS_API}${encodeURIComponent(
        query
      )}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=20`;
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    const { title, authors, imageLinks, publishedDate } = item.volumeInfo;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/details",
            params: { bookData: JSON.stringify(item) },
          })
        }
      >
        <Image
          source={{
            uri: imageLinks?.thumbnail || "https://via.placeholder.com/128x200.png?text=No+Image",
          }}
          style={styles.thumbnail}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          {authors && <Text style={styles.authors}>{authors.join(", ")}</Text>}
          {publishedDate && <Text style={styles.date}>{publishedDate}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <TextInput
        placeholder="Buscar libros..."
        placeholderTextColor="#ddd"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchBooks}
        returnKeyType="search"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      ) : books.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: "#fff" }}>Busca libros usando el cuadro de arriba.</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    margin: 10,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    marginVertical: 6,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  thumbnail: { width: 100, height: 150, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#fff" },
  authors: { fontSize: 14, color: "#ddd" },
  date: { fontSize: 12, color: "#ccc", marginTop: 4 },
});
