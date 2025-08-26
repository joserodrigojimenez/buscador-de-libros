import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchAnimation] = useState(new Animated.Value(0));
  const [headerAnimation] = useState(new Animated.Value(1));

  const searchBooks = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Por favor ingresa un término de búsqueda');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.sequence([
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(headerAnimation, {
      toValue: 0.95,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
      );
      const data = await response.json();
      setBooks(data.items || []);

      Animated.timing(headerAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar los libros.');
      setBooks([]);
      Animated.timing(headerAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setBooks([]);
    setHasSearched(false);
  };

  const handleBookPress = (book) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({ pathname: '/book-details', params: { bookData: JSON.stringify(book) } });
  };

  const renderBookCard = ({ item }) => (
    <TouchableOpacity style={styles.bookCard} onPress={() => handleBookPress(item)}>
      {item.volumeInfo.imageLinks?.thumbnail && (
        <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={styles.bookImage} />
      )}
      <View style={{ flex: 1, paddingLeft: 12 }}>
        <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
        <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient} />

      <Animated.View style={[styles.header, { transform: [{ scale: headerAnimation }] }]}>
        <View style={styles.titleContainer}>
          <Sparkles size={32} color="#6366f1" />
          <View style={styles.headerText}>
            <Text style={styles.title}>Buscar Libros</Text>
            <View style={styles.subtitleContainer}>
              <TrendingUp size={16} color="#8b5cf6" />
              <Text style={styles.subtitle}>Descubre tu próxima lectura</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" style={{ marginRight: 12 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Título, autor o tema..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={searchBooks}
            returnKeyType="search"
            placeholderTextColor="#999"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <Animated.View
          style={{
            transform: [
              {
                scale: searchAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={searchBooks}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>{loading ? 'Buscando...' : 'Buscar'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={{ marginTop: 10, color: '#64748b' }}>Buscando libros...</Text>
        </View>
      )}

      {!loading && books.length > 0 && (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={renderBookCard}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        />
      )}

      {!loading && hasSearched && books.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No se encontraron libros</Text>
          <Text style={styles.emptySubtitle}>Intenta con otros términos</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  backgroundGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300, backgroundColor: '#667eea', opacity: 0.05 },
  header: { paddingHorizontal: 20, paddingVertical: 20 },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerText: { marginLeft: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
  subtitleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  subtitle: { marginLeft: 6, color: '#64748b', fontWeight: '500' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 16 },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#1e293b' },
  searchButton: { backgroundColor: '#6366f1', paddingVertical: 14, borderRadius: 16, alignItems: 'center', shadowColor: '#6366f1', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  searchButtonDisabled: { backgroundColor: '#94a3b8', shadowOpacity: 0.1 },
  searchButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  bookCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  bookImage: { width: 60, height: 90, borderRadius: 8 },
  bookTitle: { fontWeight: 'bold', fontSize: 16, color: '#1e293b' },
  bookAuthor: { color: '#64748b', fontSize: 14, marginTop: 2 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: '#64748b', textAlign: 'center' },
});
