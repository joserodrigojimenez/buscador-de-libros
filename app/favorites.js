import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      let data = await AsyncStorage.getItem("favorites");
      setFavorites(data ? JSON.parse(data) : []);
    };
    loadFavorites();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        ⭐ Mis Favoritos
      </Text>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              marginVertical: 10,
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: item.volumeInfo.imageLinks?.thumbnail }}
              style={{ width: 50, height: 70, marginRight: 10 }}
            />
            <View>
              <Text style={{ fontWeight: "bold" }}>
                {item.volumeInfo.title}
              </Text>
              <Text>{item.volumeInfo.authors?.join(", ")}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
