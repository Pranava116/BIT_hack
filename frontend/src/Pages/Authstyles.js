import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
  },
  input: {
    width: "90%",
    height: 48,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  button: {
    width: "90%",
    height: 48,
    borderRadius: 10,
    backgroundColor: "#0077ff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 15,
    fontSize: 15,
    color: "#0077ff",
  },
});
