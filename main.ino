// =========================================================================
// PROJECT:      IoT Weather Station to Supabase (Avg Temp & Pressure)
// -------------------------------------------------------------------------
// AUTHOR/USER:  Nilambar Elangbam      
// GitHub:       https://github.com/neslang-05
// DATE:         2025-12-20
// BOARD:        ESP32 WROOM 32E
// =========================================================================
// DESCRIPTION:
// Collects environmental data from multiple sensors:
//  - Temperature: Average of DHT11 + BMP180 + DS18B20
//  - Pressure:    BMP180
//  - Humidity:    DHT11
//  - Analog:      Gas, Rain, Sound
//  - Digital:     Hall Effect, Gas Alert, Rain Alert
// Sends data securely to Supabase via HTTPS REST API.
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
  
  float tempSum = 0;
  int tempCount = 0;

  // 1. Read DHT Sensor (Humidity + Temp)
  if (dhtReady) {
    h = dht.readHumidity();
    float dhtTemp = dht.readTemperature();
    
    if(isnan(h)) h = 0;
    
    // Add DHT Temp to average if valid
    if(!isnan(dhtTemp)) {
      tempSum += dhtTemp;
      tempCount++;
    }
  } else {
    h = 0;
  }

  // 2. Read BMP180 Sensor (Pressure + Temp)
  if (bmpReady) {
    p = bmp.readPressure() / 100.0F; // Convert Pa to hPa
    float bmpTemp = bmp.readTemperature();

    // Add BMP Temp to average
    tempSum += bmpTemp;
    tempCount++;
    
    // Sanity check for pressure
    if (p < 300 || p > 1100) p = 0;
  } else {
    p = 0;
  }

  // 3. Read DS18B20 (External Temp)
  if (tempSensorReady) {
    temp_sensor.requestTemperatures(); 
    float dsTemp = temp_sensor.getTempCByIndex(0);
    
    // Check if reading is valid (DS18B20 returns -127 on error)
    if(dsTemp > -100 && dsTemp < 100) {
      tempSum += dsTemp;
      tempCount++;
    }
  }

  // 4. Calculate Average Temperature
  if (tempCount > 0) {
    t = tempSum / tempCount;
  } else {
    t = 0.0; // Default if all sensors fail
  }
  
  // 5. Read Analog Sensors
  gas_a = analogRead(GAS_ANALOG_PIN);
  rain_a = analogRead(RAIN_ANALOG_PIN);
  sound_a = analogRead(SOUND_ANALOG_PIN);
  
  // 6. Read Digital/Switch Sensors
  hall_s = (digitalRead(HALL_SWITCH_PIN) == LOW) ? "DETECTED" : "OK";
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

  // Prepare JSON Payload
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
  delay(2000); 
  Serial.println("\n================================");
  Serial.println("ESP32 Supabase IoT Sender");
  Serial.println("================================\n");

  pinMode(HALL_SWITCH_PIN, INPUT_PULLUP);
  pinMode(RAIN_DIGITAL_PIN, INPUT_PULLUP);
  pinMode(GAS_DIGITAL_PIN, INPUT_PULLUP);
  Serial.println("✓ Digital pins configured");

  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN); 
  Serial.println("✓ I2C initialized");
  
  // Initialize BMP180
  Serial.print("Initializing BMP180... ");
  if (bmp.begin()) {
    bmpReady = true;
    Serial.println("OK");
  } else {
    bmpReady = false;
    Serial.println("FAILED - Will use default values");
  }

  // Initialize DHT11
  Serial.print("Initializing DHT11... ");
  dht.begin();
  delay(2000); 
  float testH = dht.readHumidity();
  if (!isnan(testH)) {
    dhtReady = true;
    Serial.println("OK");
  } else {
    dhtReady = false;
    Serial.println("FAILED - Will use default values");
  }

  // Initialize DS18B20
  Serial.print("Initializing DS18B20... ");
  temp_sensor.begin();
  if (temp_sensor.getDeviceCount() > 0) {
    tempSensorReady = true;
    Serial.println("OK");
  } else {
    tempSensorReady = false;
    Serial.println("FAILED - No devices found");
  }

  // Connect to WiFi
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
  float hum, temp, pres;
  int gas_a, rain_a, sound_a;
  String hall_s, rain_d, gas_d;

  readAllSensors(hum, temp, pres, gas_a, rain_a, sound_a, hall_s, rain_d, gas_d);

  Serial.printf("T(Avg):%.1f°C, H:%.1f%%, P:%.1fhPa | Rain:%s/%d, Gas:%s/%d, Sound:%d, Hall:%s\n",
    temp, hum, pres, rain_d.c_str(), rain_a, gas_d.c_str(), gas_a, sound_a, hall_s.c_str());

  sendToSupabase(temp, hum, pres, gas_a, rain_a, sound_a, hall_s, rain_d, gas_d);

  delay(8000); 
}