
/*
 * ESP32 Comprehensive Test Program
 * Tests: WiFi, Bluetooth, and LED functionality
 * Compatible with Type-C port ESP32 boards
 */

#include <WiFi.h>
#include <BluetoothSerial.h>

// Check if Bluetooth is properly configured
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to enable it
#endif

// LED Pin (most ESP32 boards use GPIO2 for onboard LED)
#define LED_PIN 2

// WiFi credentials - Update these with your network details
const char* ssid = "Test1";
const char* password = "123456789";

// Bluetooth Serial object
BluetoothSerial SerialBT;

void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("ESP32 Comprehensive Test Program");
  Serial.println("========================================\n");
  
  // Test 1: LED Setup
  testLEDSetup();
  
  // Test 2: WiFi
  testWiFi();
  
  // Test 3: Bluetooth
  testBluetooth();
  
  Serial.println("\n========================================");
  Serial.println("All Tests Completed!");
  Serial.println("========================================\n");
}

void loop() {
  // Blink LED to show program is running
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
  
  // Check for Bluetooth messages
  if (SerialBT.available()) {
    String message = SerialBT.readString();
    Serial.print("Received via Bluetooth: ");
    Serial.println(message);
    SerialBT.println("Echo: " + message);
  }
  
  // Send periodic status via Bluetooth
  static unsigned long lastStatusTime = 0;
  if (millis() - lastStatusTime > 10000) {  // Every 10 seconds
    lastStatusTime = millis();
    SerialBT.println("ESP32 is running. Time: " + String(millis() / 1000) + "s");
    Serial.println("Status sent via Bluetooth");
  }
}

void testLEDSetup() {
  Serial.println("TEST 1: LED Functionality");
  Serial.println("-------------------------");
  
  pinMode(LED_PIN, OUTPUT);
  
  // Blink LED 5 times rapidly
  for (int i = 0; i < 5; i++) {
    digitalWrite(LED_PIN, HIGH);
    Serial.print("LED ON  - Blink ");
    Serial.println(i + 1);
    delay(200);
    
    digitalWrite(LED_PIN, LOW);
    Serial.println("LED OFF");
    delay(200);
  }
  
  Serial.println("✓ LED test completed successfully!\n");
}

void testWiFi() {
  Serial.println("TEST 2: WiFi Connectivity");
  Serial.println("-------------------------");
  
  // Display MAC Address
  Serial.print("ESP32 MAC Address: ");
  Serial.println(WiFi.macAddress());
  
  // Attempt to connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected successfully!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\n✗ WiFi connection failed!");
    Serial.println("Please check your SSID and password in the code.");
  }
  Serial.println();
}

void testBluetooth() {
  Serial.println("TEST 3: Bluetooth Functionality");
  Serial.println("-------------------------");
  
  // Start Bluetooth with device name
  if (SerialBT.begin("ESP32_Test_Device")) {
    Serial.println("✓ Bluetooth initialized successfully!");
    Serial.println("Device Name: ESP32_Test_Device");
    Serial.println("\nYou can now pair with this device using your phone.");
    Serial.println("Use a Bluetooth serial terminal app to connect and send messages.");
    
    // Send a test message
    SerialBT.println("Hello! ESP32 Bluetooth is working!");
  } else {
    Serial.println("✗ Bluetooth initialization failed!");
  }
  Serial.println();
}
