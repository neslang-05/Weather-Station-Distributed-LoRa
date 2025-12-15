// =========================================================================
// ==      ESP32-C3 - Supabase Data Sender (FIXED & STABLE)              ==
// =========================================================================
// Fixed: Removed usage of Pins 8 & 9 (USB/JTAG conflict).
// New I2C Pins: SDA=4, SCL=5
// =========================================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_BMP085.h>
#include "DHT.h"

// --- WIFI CONFIGURATION ---
const char* ssid = "Test1";
const char* password = "123456789";

// --- SUPABASE CONFIGURATION ---
const char* supabase_url = "https://wpiamopnovthqpesfbuw.supabase.co";
const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWFtb3Bub3Z0aHFwZXNmYnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjI2ODYsImV4cCI6MjA3OTc5ODY4Nn0.cJzs_6F_W971tRs8TkvYHUF_CljQSZ2lqgwsMVLqNwE";

// --- ESP32-C3 PIN DEFINITIONS (SAFE MAPPING) ---
// Do NOT use Pins 8 or 9 (Causes Crash/Restart loop)
#define I2C_SDA_PIN 4      // Standard C3 SDA
#define I2C_SCL_PIN 5      // Standard C3 SCL
#define DHT_PIN 6          // Safe
#define HALL_SWITCH_PIN 7  // Safe (Moved from 4)
#define RAIN_DIGITAL_PIN 3 // Safe (Moved from 5)
#define GAS_DIGITAL_PIN 10 // Safe (Moved from 8/10)

// Analog Inputs (ADC1)
#define GAS_ANALOG_PIN 0
#define RAIN_ANALOG_PIN 1
#define SOUND_ANALOG_PIN 2

// --- SENSOR OBJECTS ---
Adafruit_BMP085 bmp;
DHT dht(DHT_PIN, DHT11); 

// --- SENSOR STATUS ---
bool bmpOK = false;
bool dhtOK = false;

// --- READ SENSORS ---
void readSensors(float &h, float &t, float &p, int &gas_a, int &rain_a, int &sound_a, String &hall_s, String &rain_d, String &gas_d) {
  // DHT
  if (dhtOK) {
    h = dht.readHumidity();
    t = dht.readTemperature(); 
    if(isnan(h) || isnan(t)) { h = 0; t = 0; }
  } else {
    h = 0; t = 0;
  }

  // BMP180
  if (bmpOK) {
    p = bmp.readPressure() / 100.0F;
    if (p < 300 || p > 1100) p = 0;
  } else {
    p = 0;
  }
  
  // Analog
  gas_a = analogRead(GAS_ANALOG_PIN);
  rain_a = analogRead(RAIN_ANALOG_PIN);
  sound_a = analogRead(SOUND_ANALOG_PIN);
  
  // Digital
  hall_s = (digitalRead(HALL_SWITCH_PIN) == LOW) ? "DETECTED" : "OK";
  rain_d = (digitalRead(RAIN_DIGITAL_PIN) == LOW) ? "ALERT" : "OK";
  gas_d = (digitalRead(GAS_DIGITAL_PIN) == LOW) ? "ALERT" : "OK";
}

// --- SEND TO SUPABASE ---
void sendToSupabase(float temp, float hum, float pres, int gas_a, int rain_a, int sound_a, String hall_s, String rain_d, String gas_d) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("No WiFi");
    return;
  }
  
  HTTPClient http;
  http.begin(String(supabase_url) + "/rest/v1/new_sensor_data");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabase_key);
  http.addHeader("Authorization", String("Bearer ") + supabase_key);
  http.addHeader("Prefer", "return=minimal");
  http.setTimeout(5000);

  // Build JSON
  String json = "{\"temperature\":" + String(temp, 1) + 
                ",\"humidity\":" + String(hum, 1) + 
                ",\"pressure\":" + String(pres, 1) + 
                ",\"gas_level\":" + String(gas_a) + 
                ",\"rain_level\":" + String(rain_a) + 
                ",\"sound_level\":" + String(sound_a) + 
                ",\"hall_status\":\"" + hall_s + "\"" +
                ",\"rain_alert\":\"" + rain_d + "\"" +
                ",\"gas_alert\":\"" + gas_d + "\"}";

  int code = http.POST(json);
  
  if (code > 0) {
    Serial.printf("✓ Sent (%d)\n", code);
  } else {
    Serial.printf("✗ Error %d\n", code);
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000); // Give serial monitor time to catch up
  
  Serial.println("\nESP32-C3 Sensor (FIXED)");
  Serial.println("=======================");
  Serial.flush(); // Force print before continuing

  // 1. GPIO SETUP
  pinMode(HALL_SWITCH_PIN, INPUT_PULLUP);
  pinMode(RAIN_DIGITAL_PIN, INPUT_PULLUP);
  pinMode(GAS_DIGITAL_PIN, INPUT_PULLUP);
  Serial.println("✓ GPIO Init");
  Serial.flush();

  // 2. ADC SETUP
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
  Serial.println("✓ ADC Init");
  Serial.flush();

  // 3. I2C SETUP (CRITICAL FIX: Pins 4 & 5)
  // We manually specify pins 4,5 to ensure 8,9 are NOT used
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);
  Serial.println("✓ I2C Wire Begin");
  Serial.flush();
  
  // 4. BMP180 SETUP
  bmpOK = bmp.begin();
  if (bmpOK) {
    Serial.println("✓ BMP180 Found");
  } else {
    Serial.println("✗ BMP180 Not Found (Check Wiring)");
  }
  Serial.flush();

  // 5. DHT SETUP
  dht.begin();
  delay(100); 
  dhtOK = true; // Assume true for now, values checked in loop
  Serial.println("✓ DHT11 Init");
  Serial.flush();

  // 6. WIFI SETUP
  Serial.print("Connecting WiFi... ");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 20) {
    delay(500);
    Serial.print(".");
    tries++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(" OK");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println(" FAILED");
  }
  
  Serial.println("=======================\n");
}

void loop() {
  static unsigned long lastTime = 0;
  
  // Send every 10 seconds
  if (millis() - lastTime >= 10000) {
    lastTime = millis();
    
    float h, t, p;
    int gas_a, rain_a, sound_a;
    String hall_s, rain_d, gas_d;

    readSensors(h, t, p, gas_a, rain_a, sound_a, hall_s, rain_d, gas_d);

    Serial.printf("[READ] T:%.1f H:%.1f P:%.1f | Gas:%d Rain:%d Snd:%d\n",
      t, h, p, gas_a, rain_a, sound_a);

    sendToSupabase(t, h, p, gas_a, rain_a, sound_a, hall_s, rain_d, gas_d);
  }

  // Small delay to prevent CPU hogging
  delay(100);
}