// // src/components/ConnectionTest.tsx
// import { Button, Text, View } from "react-native";
// import { useState } from "react";

// type ApiError = {
//   message: string;
//   status?: number;
// };

// export const ConnectionTest = () => {
//   const [status, setStatus] = useState("");

//   const testConnection = async () => {
//     try {
//       // 1. Тест доступности сервера
//       const response = await fetch("http://10.0.2.2:8080", {
//         method: "HEAD",
//       });
//       setStatus(`Server alive: ${response.status}`);

//       // 2. Тест регистрации
//       const registerResponse = await fetch("http://10.0.2.2:8080/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: "test@test.com",
//           password: "testpassword",
//         }),
//       });

//       if (!registerResponse.ok) {
//         const errorData: ApiError = await registerResponse.json().catch(() => ({
//           message: "Invalid server response",
//         }));
//         throw new Error(
//           errorData.message || `HTTP error ${registerResponse.status}`
//         );
//       }

//       const data = await registerResponse.json();
//       setStatus(`Register success: ${JSON.stringify(data)}`);
//     } catch (error) {
//       // Безопасное извлечение сообщения об ошибке
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : typeof error === "string"
//           ? error
//           : "Unknown connection error";

//       setStatus(`Error: ${errorMessage}`);
//       console.error("Full error details:", {
//         error,
//         type: typeof error,
//       });
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Button title="Test Server Connection" onPress={testConnection} />
//       <Text style={{ marginTop: 20 }}>{status}</Text>
//     </View>
//   );
// };
