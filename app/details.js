import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Details() {
  const { bookData } = useLocalSearchParams();
  const data = JSON.parse(bookData || "{}");

  if (!data?.volumeInfo) {
    return (
      <View style={styles.center}>
        <Text>No se encontraron detalles.</Text>
      </View>
    );
  }

  const { title, authors, description, imageLinks, publishedDate } = data.volumeInfo;

  return (
    <LinearGradient colors={["#2575fc", "#6a11cb"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{
            uri: imageLinks?.thumbnail || "https://via.placeholder.com/200x300.png?text=No+Image",
          }}
          style={styles.image}
        />
        <Text style={styles.title}>{title}</Text>
        {authors && <Text style={styles.authors}>Por: {authors.join(", ")}</Text>}
        {publishedDate && <Text style={styles.date}>Publicado: {publishedDate}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: {
    width: 200,
    height: 300,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" },
  authors: { fontSize: 16, color: "#ddd", marginTop: 4, textAlign: "center" },
  date: { fontSize: 14, color: "#ccc", marginBottom: 12 },
  description: { fontSize: 14, color: "#fff", textAlign: "justify" },
});
