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
  NativeModules
} from "react-native";
import React, { useEffect, useState } from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
} from "firebase/firestore"
import { db, auth, storage } from "./Config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  connectStorageEmulator,
  listAll,
} from "firebase/storage";
import { FontAwesome ,SimpleLineIcons,MaterialCommunityIcons} from "react-native-vector-icons";

const HomeScreen = ({ route, navigation }) => {
  const [user, setUser] = useState(null);
  const [resSearch, setResSearch] = useState("");
  const [fetchedData, setFetchedData] = useState([]);

  const [cat, setCat] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const category = ["All", "Free Delivery", "Top Selling"];
  const logout =  async () => {
    console.log('In Logout')
    const userCollection = collection(db, "user")
  
    const unsubscribe1 = onSnapshot(userCollection, async (snapshot) => {
      const userData = snapshot.docs.map((doc) => doc.data())
  
      for (const x of userData) {
        const userRef = doc(collection(db, 'user'), `${x.name}`);
        await setDoc(
          userRef,
          { name: x.name, signedin: false },
          { merge: true }
        )
      }

      await auth.signOut();
      NativeModules.DevSettings.reload();

    }) 
  }


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
  }

  // Limit to 2 rows
  const limitedData = chunkArray(filteredData, 2);
  useEffect(() => {

    const collectionRef = collection(db, "project")

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => doc.data());
      setFetchedData(newData);

    });

    return () => {
      unsubscribe();
    };
  }, [])
  useEffect(() => {
    const userCollection = collection(db, "user")

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
          marginTop: wp(4),
          marginBottom: wp(1),
        }}
      >
        <View>
          <Text style={styles.welcomeText}>Welcome {user} 👋</Text>
        </View>

      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="search" color={"#e28743"} size={wp(5)} />
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
                  borderRadius: wp(2.5),
                  marginLeft:wp(5),
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
                marginBottom: wp(3),
                marginTop: wp(3)
              }}
            >
              {row.map((data, colIndex) => (
                <Card
                  key={colIndex}
                  containerStyle={{
                    borderRadius: wp(3),
                    overflow: "hidden",
                    width: wp(40),
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
                      style={{ width: wp(33), height: wp(25) }}
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
                    <View style={{ padding: wp(1.5) }} key={data.name}>
                      <Text
                        key={data.name}
                        style={{
                          fontSize: wp(4.2),
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
    width: wp(55),
    margin: wp(3),
    marginLeft:wp(5),
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(2.5),
    borderBottomColor: "lightgray",
    borderBottomWidth: wp(0.2),
  },
  input: {
    fontSize: wp(3.5),
    color: "#333",
    marginLeft: wp(8),
  },
  welcomeText: {
    fontSize: wp(5),
    fontWeight: "bold",
    color: "#333", // Set the text color as needed
  
  },
});