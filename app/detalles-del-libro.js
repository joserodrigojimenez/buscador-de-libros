import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

export default function BookDetails() {
  const router = useRouter();
  const params = useSearchParams();

  // Recibe los datos del libro como JSON
  const book = params.bookData ? JSON.parse(params.bookData) : null;

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontraron detalles del libro.</Text>
      </View>
    );
  }

  const { title, authors, publishedDate, description, imageLinks } = book.volumeInfo;

  const goBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Ionicons name="arrow-back" size={24} color="#6366f1" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      {imageLinks?.thumbnail && (
        <Image source={{ uri: imageLinks.thumbnail }} style={styles.bookImage} />
      )}

      <Text style={styles.title}>{title}</Text>
      {authors && <Text style={styles.authors}>Por: {authors.join(', ')}</Text>}
      {publishedDate && <Text style={styles.publishedDate}>Publicado: {publishedDate}</Text>}

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : (
        <Text style={styles.description}>No hay descripción disponible.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { marginLeft: 6, color: '#6366f1', fontWeight: '600', fontSize: 16 },
  bookImage: { width: 150, height: 220, alignSelf: 'center', marginBottom: 20, borderRadius: 8 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 10, color: '#1e293b' },
  authors: { fontSize: 16, textAlign: 'center', color: '#64748b', marginBottom: 4 },
  publishedDate: { fontSize: 14, textAlign: 'center', color: '#94a3b8', marginBottom: 20 },
  description: { fontSize: 16, lineHeight: 22, color: '#1e293b' },
  errorText: { flex: 1, textAlign: 'center', marginTop: 50, fontSize: 18, color: 'red' },
});
