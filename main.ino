// =========================================================================
// ==      ESP32 WROOM 32E - Supabase Data Sender (FIXED VERSION)        ==
// =========================================================================
// Collects 10 unique readings (Analog + Digital Alerts) and sends to Supabase.
// WITH PROPER ERROR HANDLING
// =========================================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_BMP085.h>
#include "DHT.h"
#include <OneWire.h>
#include <DallasTemperature.h>

// --- WIFI CONFIGURATION ---
const char* ssid = "Test1";
const char* password = "123456789";

// --- SUPABASE CONFIGURATION ---
const char* supabase_url = "https://wpiamopnovthqpesfbuw.supabase.co";
const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWFtb3Bub3Z0aHFwZXNmYnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjI2ODYsImV4cCI6MjA3OTc5ODY4Nn0.cJzs_6F_W971tRs8TkvYHUF_CljQSZ2lqgwsMVLqNwE";

// --- PIN DEFINITIONS ---
#define I2C_SDA_PIN 21
#define I2C_SCL_PIN 22
#define DHT_PIN           14  
#define ONE_WIRE_BUS_PIN  27  
#define HALL_SWITCH_PIN   16  
#define RAIN_DIGITAL_PIN  17
#define GAS_DIGITAL_PIN   12
#define GAS_ANALOG_PIN    34
#define RAIN_ANALOG_PIN   39
#define SOUND_ANALOG_PIN  36

// --- SENSOR OBJECTS ---
Adafruit_BMP085 bmp;
DHT dht(DHT_PIN, DHT11); 
OneWire oneWire(ONE_WIRE_BUS_PIN);
DallasTemperature temp_sensor(&oneWire);

// --- SENSOR STATUS FLAGS ---
bool bmpReady = false;
bool dhtReady = false;
bool tempSensorReady = false;

// --- HELPER FUNCTION TO READ ALL SENSORS ---
void readAllSensors(float &h, float &t, float &p, int &gas_a, int &rain_a, int &sound_a, String &hall_s, String &rain_d, String &gas_d) {
  // Read DHT Sensor (with error handling)
  if (dhtReady) {
    h = dht.readHumidity();
    t = dht.readTemperature(); 
    if(isnan(h) || isnan(t)) { 
      h = 0; 
      t = 0; 
      Serial.println("DHT read failed!");
    }
  } else {
    h = 0;
    t = 0;
  }

  // Read BMP180 Sensor (with error handling)
  if (bmpReady) {
    p = bmp.readPressure() / 100.0F;
    // Sanity check for valid pressure reading
    if (p < 300 || p > 1100) {
      Serial.println("BMP180 pressure out of range!");
      p = 0;
    }
  } else {
    p = 0;
  }
  
  // Read Analog Sensors (0-4095 range)
  gas_a = analogRead(GAS_ANALOG_PIN);
  rain_a = analogRead(RAIN_ANALOG_PIN);
  sound_a = analogRead(SOUND_ANALOG_PIN);
  
  // Read Digital/Switch Sensors
  hall_s = (digitalRead(HALL_SWITCH_PIN) == LOW) ? "DETECTED" : "OK";
  
  // Rain alert derived from analog threshold (<2000 => WET)
  rain_d = (rain_a < 2000) ? "ALERT" : "OK";
  gas_d = (digitalRead(GAS_DIGITAL_PIN) == LOW) ? "ALERT" : "OK";
}

// --- CORE FUNCTION TO SEND DATA TO SUPABASE ---
void sendToSupabase(float temp, float hum, float pres, int gas_a, int rain_a, int sound_a, String hall_s, String rain_d, String gas_d) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected. Skipping upload.");
    return;
  }
  
  WiFiClientSecure client;
  client.setInsecure(); 
  HTTPClient http;

  // 1. Prepare JSON Payload
  StaticJsonDocument<512> doc;
  doc["temperature"] = temp;
  doc["humidity"] = hum;
  doc["pressure"] = pres;
  doc["gas_level"] = gas_a;
  doc["rain_level"] = rain_a;
  doc["sound_level"] = sound_a;
  doc["hall_status"] = hall_s;
  doc["rain_alert"] = rain_d;
  doc["gas_alert"] = gas_d;

  String jsonString;
  serializeJson(doc, jsonString);

  // 2. HTTP POST Request
  // IMPORTANT: Replace "sensor_data" with your actual Supabase table name
  String endpoint = String(supabase_url) + "/rest/v1/new_sensor_data";
  
  Serial.print("Endpoint: ");
  Serial.println(endpoint);
  
  http.begin(client, endpoint);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabase_key);
  http.addHeader("Authorization", String("Bearer ") + supabase_key);
  http.addHeader("Prefer", "return=minimal"); 

  Serial.print("Sending Data... ");
  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0) {
    Serial.print("Success! Response: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("Error sending data. Response: ");
    Serial.print(httpResponseCode);
    Serial.print(" - ");
    Serial.println(http.errorToString(httpResponseCode));
  }
  
  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(2000); // Increased delay for Serial Monitor
  Serial.println("\n================================");
  Serial.println("ESP32 Supabase IoT Sender");
  Serial.println("================================\n");

  // --- Initialize Digital Pins ---
  pinMode(HALL_SWITCH_PIN, INPUT_PULLUP);
  pinMode(RAIN_DIGITAL_PIN, INPUT_PULLUP);
  pinMode(GAS_DIGITAL_PIN, INPUT_PULLUP);
  Serial.println("✓ Digital pins configured");

  // --- Initialize I2C ---
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN); 
  Serial.println("✓ I2C initialized");
  
  // --- Initialize BMP180 with error checking ---
  Serial.print("Initializing BMP180... ");
  if (bmp.begin()) {
    bmpReady = true;
    Serial.println("OK");
  } else {
    bmpReady = false;
    Serial.println("FAILED - Will use default values");
  }

  // --- Initialize DHT11 ---
  Serial.print("Initializing DHT11... ");
  dht.begin();
  // Test read to verify DHT is working
  delay(2000); // DHT needs time to stabilize
  float testH = dht.readHumidity();
  if (!isnan(testH)) {
    dhtReady = true;
    Serial.println("OK");
  } else {
    dhtReady = false;
    Serial.println("FAILED - Will use default values");
  }

  // --- Initialize DS18B20 ---
  Serial.print("Initializing DS18B20... ");
  temp_sensor.begin();
  if (temp_sensor.getDeviceCount() > 0) {
    tempSensorReady = true;
    Serial.println("OK");
  } else {
    tempSensorReady = false;
    Serial.println("FAILED - No devices found");
  }

  // --- Connect to WiFi ---
  Serial.print("\nConnecting to WiFi");
  WiFi.begin(ssid, password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n✗ WiFi connection failed!");
  }
  
  Serial.println("\n--- Setup Complete ---\n");
}

void loop() {
  // Variables to store the readings
  float hum, temp, pres;
  int gas_a, rain_a, sound_a;
  String hall_s, rain_d, gas_d;

  // 1. Read all sensor data
  readAllSensors(hum, temp, pres, gas_a, rain_a, sound_a, hall_s, rain_d, gas_d);

  // 2. Print status (for debugging)
  Serial.printf("T:%.1f°C, H:%.1f%%, P:%.1fhPa | Rain:%s/%d, Gas:%s/%d, Sound:%d, Hall:%s\n",
    temp, hum, pres, rain_d.c_str(), rain_a, gas_d.c_str(), gas_a, sound_a, hall_s.c_str());

  // 3. Send data to Supabase
  sendToSupabase(temp, hum, pres, gas_a, rain_a, sound_a, hall_s, rain_d, gas_d);

  // Wait 10 seconds before next reading
  delay(8000); 
}