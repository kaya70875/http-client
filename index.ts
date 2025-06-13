import { CustomClient } from "./client/CustomClient";

// Example usage:
const client = new CustomClient();
client
  .get("https://jsonplaceholder.typicode.com/posts/1", {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    console.log("Status Code :", res.statusCode);
    console.log("Data :", res.data);
  });
