# import requests

# url = "https://mahabhunakasha.mahabhumi.gov.in/rest/MapInfo/getVVVVExtentGeoref"

# # 🔹 Step 1: Create session
# session = requests.Session()

# # 🔹 Step 2: Hit homepage to generate cookies
# session.get("https://mahabhunakasha.mahabhumi.gov.in/27/index.html")

# # 🔹 Step 3: Prepare payload (FORM DATA, not JSON)
# payload = {
#     "state": "27",
#     "giscode": "RVM1203271200030136120000",
#     "srs": "4326"
# }

# # 🔹 Step 4: Headers (CRITICAL)
# headers = {
#     "User-Agent": "Mozilla/5.0",
#     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
#     "X-Requested-With": "XMLHttpRequest",
#     "Origin": "https://mahabhunakasha.mahabhumi.gov.in",
#     "Referer": "https://mahabhunakasha.mahabhumi.gov.in/27/index.html"
# }

# # 🔹 Step 5: POST request
# response = session.post(url, data=payload, headers=headers)

# print("STATUS:", response.status_code)
# print(response.text)
import requests
import pandas as pd
import time
import random

# 🔹 CONFIG
INPUT_FILE = r"D:\Beastate\Data_pipelines\maharashtra_land_dataset.csv"   # <-- change this
BASE_URL = "https://mahabhunakasha.mahabhumi.gov.in"
API_URL = f"{BASE_URL}/rest/MapInfo/getVVVVExtentGeoref"

# 🔹 STEP 1: GISCODE GENERATOR (your logic)
def generate_giscode(district, taluka, village):
    district = str(district).zfill(2)
    taluka = str(taluka).zfill(2)
    village = str(village).zfill(6)

    return f"RVM{district}{taluka}{village}"


# 🔹 STEP 2: SAFE REQUEST (retry + timeout)
def safe_request(session, payload, headers, retries=3):
    for attempt in range(retries):
        try:
            response = session.post(
                API_URL,
                data=payload,
                headers=headers,
                timeout=10
            )
            print('response',response)

            if response.status_code == 200:
                return response

            print(f"⚠️ Status {response.status_code}, retrying...")

        except requests.exceptions.RequestException as e:
            print(f"⚠️ Error: {e}, retry {attempt+1}")

        time.sleep(2)

    return None


# 🔹 STEP 3: LOAD DATA
df = pd.read_csv(INPUT_FILE)
df = df.tail(10)
print(df['village_code'])
# 🔹 STEP 4: CREATE SESSION
session = requests.Session()

# 🔹 IMPORTANT: Get cookies first
session.get(f"{BASE_URL}/27/index.html")

# 🔹 HEADERS (DO NOT CHANGE)
headers = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    "Origin": BASE_URL,
    "Referer": f"{BASE_URL}/27/index.html"
}

# 🔹 STEP 5: LOOP THROUGH DATA
results = []

for idx, row in df.iterrows():
    district = row["district_code"]
    taluka = row["taluka_code"]
    village = row["village_code"]

    giscode = generate_giscode(district, taluka, village)

    payload = {
        "state": "27",
        "giscode": giscode,
        "srs": "4326"
    }

    print(f"\n🔍 Fetching: {giscode}")

    response = safe_request(session, payload, headers)

    if response:
        try:
            data = response.json()

            if "xmin" in data:
                print("✅ SUCCESS")

                results.append({
                    "district": district,
                    "taluka": taluka,
                    "village": village,
                    "giscode": giscode,
                    "xmin": data["xmin"],
                    "ymin": data["ymin"],
                    "xmax": data["xmax"],
                    "ymax": data["ymax"]
                })
            else:
                print("❌ Invalid response")
        except:
            print("❌ JSON parse error")

    else:
        print("❌ FAILED completely")

    # 🔥 CRITICAL: Avoid blocking
    time.sleep(random.uniform(0.8, 1.5))


# 🔹 STEP 6: SAVE OUTPUT
output_df = pd.DataFrame(results)
output_df.to_csv("bhunaksha_output.csv", index=False)

print("\n🎯 DONE! Data saved to bhunaksha_output.csv")