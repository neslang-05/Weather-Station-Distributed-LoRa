# Grafana Setup Guide for IoT Sensor Dashboard

## Overview
This guide will help you set up Grafana to visualize your ESP32-C3 sensor data stored in Supabase (PostgreSQL).

## What You're Visualizing
- **Temperature** (°C)
- **Humidity** (%)
- **Pressure** (hPa)
- **Gas Level** (analog)
- **Rain Level** (analog)
- **Sound Level** (analog)
- **Hall Status** (DETECTED/OK)
- **Rain Alert** (ALERT/OK)
- **Gas Alert** (ALERT/OK)

---

## Step 1: Install Grafana

### Option A: Docker (Recommended - Easiest)
```bash
docker run -d -p 3000:3000 --name=grafana grafana/grafana
```

### Option B: Windows Installation
1. Download from: https://grafana.com/grafana/download
2. Choose Windows installer
3. Install and run as a service
4. Access at: http://localhost:3000

### Option C: Grafana Cloud (Free tier available)
Sign up at: https://grafana.com/products/cloud/

---

## Step 2: Access Grafana
1. Open browser: **http://localhost:3000**
2. Default credentials:
   - **Username:** admin
   - **Password:** admin
3. Change password when prompted

---

## Step 3: Add Supabase as Data Source

### Get Supabase Connection Details
From your Supabase dashboard (https://supabase.com/dashboard):
1. Go to **Settings** → **Database**
2. Find **Connection Info**
3. Note down:
   - **Host:** `db.wpiamopnovthqpesfbuw.supabase.co`
   - **Port:** `5432`
   - **Database:** `postgres`
   - **User:** `postgres`
   - **Password:** Your Supabase database password (NOT the API key)

### Configure in Grafana
1. Click **⚙️ Configuration** → **Data Sources**
2. Click **Add data source**
3. Select **PostgreSQL**
4. Fill in:
   ```
   Name: Supabase IoT Database
   Host: db.wpiamopnovthqpesfbuw.supabase.co:5432
   Database: postgres
   User: postgres
   Password: [Your DB Password]
   SSL Mode: require
   Version: 12+
   ```
5. Click **Save & Test**

> ⚠️ **Important:** You need the database password, not the `supabase_key` from your Arduino code. Find it in Supabase Settings → Database.

---

## Step 4: Verify Table Structure

Your table `new_sensor_data` should have these columns:
- `id` (auto-generated)
- `created_at` (timestamp)
- `temperature` (numeric)
- `humidity` (numeric)
- `pressure` (numeric)
- `gas_level` (integer)
- `rain_level` (integer)
- `sound_level` (integer)
- `hall_status` (text)
- `rain_alert` (text)
- `gas_alert` (text)

If needed, create it with:
```sql
CREATE TABLE new_sensor_data (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  temperature NUMERIC,
  humidity NUMERIC,
  pressure NUMERIC,
  gas_level INTEGER,
  rain_level INTEGER,
  sound_level INTEGER,
  hall_status TEXT,
  rain_alert TEXT,
  gas_alert TEXT
);

-- Add index for better query performance
CREATE INDEX idx_created_at ON new_sensor_data(created_at DESC);
```

---

## Step 5: Create Your First Dashboard

### Create Dashboard
1. Click **+** → **Dashboard**
2. Click **Add new panel**

### Panel 1: Temperature Over Time
- **Query:**
  ```sql
  SELECT
    created_at as time,
    temperature as value
  FROM new_sensor_data
  WHERE $__timeFilter(created_at)
  ORDER BY created_at
  ```
- **Panel Type:** Time series
- **Title:** Temperature (°C)
- **Unit:** Celsius (°C)

### Panel 2: Humidity Over Time
- **Query:**
  ```sql
  SELECT
    created_at as time,
    humidity as value
  FROM new_sensor_data
  WHERE $__timeFilter(created_at)
  ORDER BY created_at
  ```
- **Panel Type:** Time series
- **Title:** Humidity (%)
- **Unit:** Percent (0-100)

### Panel 3: Pressure Over Time
- **Query:**
  ```sql
  SELECT
    created_at as time,
    pressure as value
  FROM new_sensor_data
  WHERE $__timeFilter(created_at)
  ORDER BY created_at
  ```
- **Panel Type:** Time series
- **Title:** Atmospheric Pressure (hPa)
- **Unit:** Pressure → hPa

### Panel 4: Current Temperature Gauge
- **Query:**
  ```sql
  SELECT temperature as value
  FROM new_sensor_data
  ORDER BY created_at DESC
  LIMIT 1
  ```
- **Panel Type:** Gauge
- **Title:** Current Temperature
- **Min:** 0, **Max:** 50
- **Thresholds:** 
  - Green: 0-25
  - Yellow: 25-35
  - Red: 35+

### Panel 5: Gas & Rain Levels
- **Query:**
  ```sql
  SELECT
    created_at as time,
    gas_level as "Gas Level",
    rain_level as "Rain Level"
  FROM new_sensor_data
  WHERE $__timeFilter(created_at)
  ORDER BY created_at
  ```
- **Panel Type:** Time series
- **Title:** Gas & Rain Levels

### Panel 6: Sound Level
- **Query:**
  ```sql
  SELECT
    created_at as time,
    sound_level as value
  FROM new_sensor_data
  WHERE $__timeFilter(created_at)
  ORDER BY created_at
  ```
- **Panel Type:** Time series
- **Title:** Sound Level

### Panel 7: Alert Status (Stat Panel)
- **Query:**
  ```sql
  SELECT
    gas_alert as "Gas Alert",
    rain_alert as "Rain Alert",
    hall_status as "Hall Sensor"
  FROM new_sensor_data
  ORDER BY created_at DESC
  LIMIT 1
  ```
- **Panel Type:** Stat
- **Title:** Current Alerts
- **Conditional formatting:** Add thresholds to turn red on "ALERT"

### Panel 8: Latest Readings Table
- **Query:**
  ```sql
  SELECT
    created_at as "Time",
    temperature as "Temp (°C)",
    humidity as "Humidity (%)",
    pressure as "Pressure (hPa)",
    gas_level as "Gas",
    rain_level as "Rain",
    sound_level as "Sound",
    gas_alert as "Gas Alert",
    rain_alert as "Rain Alert",
    hall_status as "Hall"
  FROM new_sensor_data
  ORDER BY created_at DESC
  LIMIT 20
  ```
- **Panel Type:** Table
- **Title:** Latest 20 Readings

---

## Step 6: Dashboard Layout Suggestions

Arrange panels like this (use drag & drop):

```
┌──────────────┬──────────────┬──────────────┐
│  Temp Gauge  │  Hum Gauge   │ Press Gauge  │
├──────────────┴──────────────┴──────────────┤
│          Temperature Over Time             │
├────────────────────────────────────────────┤
│           Humidity Over Time               │
├────────────────────────────────────────────┤
│           Pressure Over Time               │
├──────────────┬─────────────────────────────┤
│ Gas & Rain   │      Sound Level            │
├──────────────┴─────────────────────────────┤
│            Alert Status Panel              │
├────────────────────────────────────────────┤
│          Latest Readings Table             │
└────────────────────────────────────────────┘
```

---

## Step 7: Configure Auto-Refresh

1. Click the **🕐 Time range** dropdown (top right)
2. Set **Refresh:** to 5s, 10s, or 30s (matches your ESP32 send interval)
3. Set **Time range:** Last 1 hour, Last 6 hours, or custom

---

## Step 8: Save Dashboard

1. Click **💾 Save dashboard** (top right)
2. Name: "IoT Sensor Monitoring"
3. Click **Save**

---

## Advanced Features

### Add Alerts
1. Edit any panel
2. Go to **Alert** tab
3. Create alert rules (e.g., if temperature > 40°C, send notification)

### Variables
Create dashboard variables for dynamic filtering:
1. Dashboard settings → Variables
2. Add variable for time ranges, sensor types, etc.

### Annotations
Mark important events on your graphs:
1. Dashboard settings → Annotations
2. Query for alert events

---

## Troubleshooting

### "Connection refused" error
- Check if Supabase allows connections from your IP
- In Supabase: Settings → Database → Connection pooling
- Make sure you're using the correct host/port

### "SSL required" error
- Set SSL Mode to "require" in data source settings

### No data showing
- Verify data exists: Run query in Supabase SQL editor:
  ```sql
  SELECT * FROM new_sensor_data ORDER BY created_at DESC LIMIT 10;
  ```
- Check time range in Grafana (top right)
- Ensure ESP32 is actually sending data (check Serial monitor)

### Slow queries
- Add index on `created_at` column (see Step 4)
- Limit time range
- Reduce refresh rate

---

## Next Steps

1. **Export Dashboard:** Settings → JSON Model → Save to file
2. **Share Dashboard:** Get shareable link or embed
3. **Add more panels:** Statistics, heatmaps, bar charts
4. **Set up alerts:** Get notifications via email, Slack, Discord, etc.
5. **Mobile view:** Grafana mobile app available

---

## Useful SQL Queries

### Average values per hour
```sql
SELECT
  DATE_TRUNC('hour', created_at) as time,
  AVG(temperature) as avg_temp,
  AVG(humidity) as avg_hum,
  AVG(pressure) as avg_press
FROM new_sensor_data
WHERE $__timeFilter(created_at)
GROUP BY time
ORDER BY time
```

### Count alerts per day
```sql
SELECT
  DATE_TRUNC('day', created_at) as time,
  COUNT(*) FILTER (WHERE gas_alert = 'ALERT') as gas_alerts,
  COUNT(*) FILTER (WHERE rain_alert = 'ALERT') as rain_alerts
FROM new_sensor_data
WHERE $__timeFilter(created_at)
GROUP BY time
ORDER BY time
```

### Min/Max/Avg for today
```sql
SELECT
  MIN(temperature) as min_temp,
  MAX(temperature) as max_temp,
  AVG(temperature) as avg_temp
FROM new_sensor_data
WHERE created_at >= CURRENT_DATE
```

---

## Resources

- Grafana Docs: https://grafana.com/docs/
- PostgreSQL Data Source: https://grafana.com/docs/grafana/latest/datasources/postgres/
- Dashboard Best Practices: https://grafana.com/docs/grafana/latest/dashboards/

---

**Happy Monitoring! 📊🌡️💧**
