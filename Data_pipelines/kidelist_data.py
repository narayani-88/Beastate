# import requests
# import pandas as pd
# import time
# import random

# # 🔹 CONFIG
# INPUT_FILE = r"D:\Beastate\Data_pipelines\maharashtra_land_dataset.csv"
# BASE_URL = "https://mahabhunakasha.mahabhumi.gov.in"
# API_URL = f"{BASE_URL}/rest/VillageMapService/kidelistFromGisCodeMH"

# # 🔹 STEP 1: GISCODE GENERATOR (same as your current logic)
# def generate_giscode(district, taluka, village):
#     district = str(district).zfill(2)
#     taluka = str(taluka).zfill(2)
#     village = str(village).zfill(6)

#     return f"RVM{district}{taluka}{village}"


# # 🔹 STEP 2: SAFE REQUEST (same)
# def safe_request(session, payload, headers, retries=3):
#     for attempt in range(retries):
#         try:
#             response = session.post(
#                 API_URL,
#                 data=payload,
#                 headers=headers,
#                 timeout=10
#             )

#             print('response', response)

#             if response.status_code == 200:
#                 return response

#             print(f"⚠️ Status {response.status_code}, retrying...")

#         except requests.exceptions.RequestException as e:
#             print(f"⚠️ Error: {e}, retry {attempt+1}")

#         time.sleep(2)

#     return None


# # 🔹 STEP 3: LOAD DATA
# df = pd.read_csv(INPUT_FILE)
# print(df)
# df = df.tail(10)

# # 🔹 STEP 4: CREATE SESSION
# session = requests.Session()

# # 🔹 IMPORTANT: Get cookies first
# session.get(f"{BASE_URL}/27/index.html")

# # 🔹 HEADERS (same)
# headers = {
#     "User-Agent": "Mozilla/5.0",
#     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
#     "X-Requested-With": "XMLHttpRequest",
#     "Origin": BASE_URL,
#     "Referer": f"{BASE_URL}/27/index.html"
# }

# # 🔹 STEP 5: LOOP THROUGH DATA
# results = []

# for idx, row in df.iterrows():
#     district = row["district_code"]
#     taluka = row["taluka_code"]
#     village = row["village_code"]

#     giscode = generate_giscode(district, taluka, village)

#     payload = {
#         "state": "27",
#         "logedLevels": giscode   # 🔥 ONLY CHANGE
#     }

#     print(f"\n🔍 Fetching KIDE: {giscode}")

#     response = safe_request(session, payload, headers)

#     if response:
#         try:
#             data = response.json()

#             print("✅ SUCCESS")

#             for kide in data:
#                 results.append({
#                     "district": district,
#                     "taluka": taluka,
#                     "village": village,
#                     "giscode": giscode,
#                     "cts_number": kide
#                 })

#         except:
#             print("❌ JSON parse error")

#     else:
#         print("❌ FAILED completely")

#     # 🔥 CRITICAL
#     time.sleep(random.uniform(0.8, 1.5))


# # 🔹 STEP 6: SAVE OUTPUT
# output_df = pd.DataFrame(results)
# output_df.to_csv("kide_output.csv", index=False)

# print("\n🎯 DONE! Data saved to kide_output.csv")


import requests
import pandas as pd
import time
import random
import urllib3

# =============================
# CONFIG
# =============================
INPUT_FILE = r"D:\Beastate\Data_pipelines\maharashtra_land_dataset.csv"

DOMAIN = "https://mahabhunakasha.mahabhumi.gov.in"
IP = "https://115.124.105.253"

API_PATH = "/rest/VillageMapService/kidelistFromGisCodeMH"
INDEX_PATH = "/27/index.html"

# Disable SSL warning (needed for IP usage)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# =============================
# GISCODE GENERATOR
# =============================
def generate_giscode(district, taluka, village):
    return f"RVM{str(district).zfill(2)}{str(taluka).zfill(2)}{str(village).zfill(6)}"


# =============================
# SESSION CREATOR (SMART)
# =============================
def create_session():
    session = requests.Session()

    # Try DOMAIN first
    try:
        print("🌐 Trying DOMAIN...")
        session.get(DOMAIN + INDEX_PATH, timeout=5)
        base_url = DOMAIN
        print("✅ Using DOMAIN")
    except:
        print("⚠️ DOMAIN failed, switching to IP...")
        base_url = IP

        # Hit IP with proper Host header
        session.get(
            base_url + INDEX_PATH,
            headers={
                "Host": "mahabhunakasha.mahabhumi.gov.in",
                "User-Agent": "Mozilla/5.0"
            },
            verify=False
        )
        print("✅ Using IP")

    return session, base_url


# =============================
# SAFE REQUEST
# =============================
def safe_request(session, base_url, payload, retries=3):
    url = base_url + API_PATH

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Origin": DOMAIN,
        "Referer": DOMAIN + INDEX_PATH,
        "Host": "mahabhunakasha.mahabhumi.gov.in"
    }

    for attempt in range(retries):
        try:
            response = session.post(
                url,
                data=payload,
                headers=headers,
                timeout=10,
                verify=False
            )

            if response.status_code == 200:
                return response.json()

            print(f"⚠️ Status {response.status_code}, retry {attempt+1}")

        except Exception as e:
            print(f"⚠️ Error: {e}, retry {attempt+1}")

        time.sleep(2)

    return None


# =============================
# LOAD DATA
# =============================
df = pd.read_csv(INPUT_FILE)

# test subset (remove later)
df = df.tail(10)


# =============================
# CREATE SESSION
# =============================
session, base_url = create_session()


# =============================
# MAIN LOOP
# =============================
results = []

for idx, row in df.iterrows():
    district = row["district_code"]
    taluka = row["taluka_code"]
    village = row["village_code"]

    giscode = generate_giscode(district, taluka, village)

    payload = {
        "state": "27",
        "logedLevels": giscode
    }

    print(f"\n🔍 Fetching: {giscode}")

    data = safe_request(session, base_url, payload)

    if data:
        print(f"✅ Found {len(data)} CTS numbers")

        # 🔥 FAST METHOD (vectorized)
        temp_df = pd.DataFrame({
            "district": district,
            "taluka": taluka,
            "village": village,
            "giscode": giscode,
            "cts_number": data
        })

        results.append(temp_df)

    else:
        print("❌ FAILED")


    # rate limit
    time.sleep(random.uniform(0.8, 1.5))


# =============================
# SAVE OUTPUT
# =============================
if results:
    final_df = pd.concat(results, ignore_index=True)
    final_df.to_csv("kide_output.csv", index=False)
    print("\n🎯 DONE! Data saved to kide_output.csv")
else:
    print("⚠️ No data collected")