import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Button } from "@rneui/themed";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  addDoc,
  docRef,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db, auth, storage } from "./Config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  connectStorageEmulator,
  listAll,
} from "firebase/storage";
import { FontAwesome } from "react-native-vector-icons";

const HomeScreen = ({ route, navigation }) => {
  const [user, setUser] = useState(null);
  const [resSearch, setResSearch] = useState("");
  const [fetchedData, setFetchedData] = useState([]);

  const [cat, setCat] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const category = ["All", "Free Delivery", "Top Selling"];

  useEffect(() => {
    const updatedFilteredData = fetchedData
      .filter((data) => cat === "All" || data[cat] === true)
      .filter((data) =>
        data.name.toLowerCase().includes(resSearch.toLowerCase())
      );

    setFilteredData(updatedFilteredData);
  }, [resSearch, cat, fetchedData]);

  const chunkArray = (array, size) => {
    return array.reduce((acc, _, index) => {
      if (index % size === 0) {
        acc.push(array.slice(index, index + size));
      }

      return acc;
    }, []);
  };

  // Limit to 2 rows
  const limitedData = chunkArray(filteredData, 2);
  useEffect(() => {
    // navigation.setOptions(
    //     {headerBackTitleVisible: false,s
    //         headerLeft: () => <AntDesign name='logout'
    //             size={20} onPress={() => navigation.replace("Login")}
    //             />
    //     })

    const collectionRef = collection(db, "project");

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => doc.data());
      // console.log('From DB\t', newData);
      setFetchedData(newData);

    });

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    const userCollection = collection(db, "user");

    const unsubscribe1 = onSnapshot(userCollection, (snapshot) => {
      const userData = snapshot.docs.map((doc) => doc.data());
      console.log("USERDATA: ", userData);
      if (userData[0].signedin == true) {
        setUser(userData[0].name)
      }

      userData.forEach((x) => {
        if (x.signedin == true) {
          setUser(x.name);
        }

        const reloadRef = doc(collection(db, "reload"), `reload`);
        setDoc(reloadRef, { reload: false }, { merge: true });

      })
    })
  }, [])
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 15,
          marginBottom: 15,
        }}
      >
        <View>
          <Text style={styles.welcomeText}>Welcome {user} 👋</Text>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}>
        <View>
          <Text>User pfp here </Text>
        </View>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="search" color={"#e28743"} size={15} />
        <TextInput
          style={styles.input}
          placeholder="Search Restaurants"
          value={resSearch}
          onChangeText={(text) => setResSearch(text)}
          placeholderTextColor="#e28743"
          autoCorrect={false}
        />
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.st}
        >
          {category.map((data, index) => (
            <View key={index}>
              <Card
                containerStyle={{
                  borderRadius: 10,
                  overflow: "hidden",
                  backgroundColor: data != cat ? "#ffe5bf" : "#e28743",
                }}
              >
                <TouchableOpacity onPress={() => setCat(data)}>
                  <View style={{ padding: 5 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: data == cat ? "white" : "#e28743",
                      }}
                    >
                      {data}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Card>
            </View>
          ))}
        </ScrollView>

        <ScrollView>
          {limitedData.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              {row.map((data, colIndex) => (
                <Card
                  key={colIndex}
                  containerStyle={{
                    borderRadius: 10,
                    overflow: "hidden",
                    width: "40%",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("MenuScreen", {
                        menus: data.menu,
                        freeDelivery: data["Free Delivery"],
                        resName: data.name,
                      })
                    }
                  >
                    <Image
                      key={rowIndex + colIndex}
                      source={{ uri: data.image }}
                      style={{ width: 120, height: 100 }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("MenuScreen", {
                        menus: data.menu,
                        freeDelivery: data["Free Delivery"],
                        resName: data.name,
                      })
                    }
                  >
                    <View style={{ padding: 10 }} key={data.name}>
                      <Text
                        key={data.name}
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {data.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",

    width: "70%",
    margin: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
  },
  input: {
    fontSize: 16,
    color: "#333",
    marginLeft: 40,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Set the text color as needed
  },
});
