import React from "react";
import { View, Text, Image, Button, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Details() {
  const { book } = useLocalSearchParams();
  const router = useRouter();
  const data = JSON.parse(book);

  const addToFavorites = async () => {
    try {
      let favorites = await AsyncStorage.getItem("favorites");
      favorites = favorites ? JSON.parse(favorites) : [];
      favorites.push(data);
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Libro agregado a Favoritos ✅");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        {data.volumeInfo.title}
      </Text>
      <Image
        source={{ uri: data.volumeInfo.imageLinks?.thumbnail }}
        style={{ width: 120, height: 180, marginBottom: 20 }}
      />
      <Text>📖 Autor: {data.volumeInfo.authors?.join(", ")}</Text>
      <Text>📅 Publicado: {data.volumeInfo.publishedDate}</Text>
      <Text style={{ marginTop: 10 }}>
        {data.volumeInfo.description || "Sin descripción disponible"}
      </Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Añadir a Favoritos" onPress={addToFavorites} />
        <Button
          title="Ver Favoritos"
          onPress={() => router.push("/favorites")}
        />
      </View>
    </ScrollView>
  );
}
