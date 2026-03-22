

# import requests
# import pandas as pd
# import time
# from indic_transliteration import sanscript
# from indic_transliteration.sanscript import transliterate

# BASE_URL = "https://mahabhunakasha.mahabhumi.gov.in/rest/VillageMapService/ListsAfterLevelGeoref"
# GIS_URL = "https://mahabhunakasha.mahabhumi.gov.in/rest/VillageMapService/kidelistFromGisCodeMH"
# EXTENT_URL = "https://mahabhunakasha.mahabhumi.gov.in/rest/MapInfo/getVVVVExtentGeoref"

# headers = {
#     "User-Agent": "Mozilla/5.0",
#     "Content-Type": "application/x-www-form-urlencoded",
#     "Referer": "https://mahabhunakasha.mahabhumi.gov.in/27/index.html",
#     "Origin": "https://mahabhunakasha.mahabhumi.gov.in",
#     "X-Requested-With": "XMLHttpRequest"
# }

# session = requests.Session()
# session.get("https://mahabhunakasha.mahabhumi.gov.in/27/index.html")

# all_rows = []

# # -------------------------
# # 1 FETCH DISTRICTS
# # -------------------------

# district_payload = {
#     "state": "27",
#     "level": "1",
#     "codes": "U,",
#     "hasmap": "true"
# }

# districts = session.post(BASE_URL, headers=headers, data=district_payload).json()[0]
# print("Districts:", len(districts))

# for d in districts:

#     district_code = d["code"]
#     district_name = d["value"]

#     print("\nDistrict:", district_name)

#     # -------------------------
#     # 2 FETCH TALUKAS
#     # -------------------------

#     taluka_payload = {
#         "state": "27",
#         "level": "2",
#         "codes": f"U,{district_code},",
#         "hasmap": "true"
#     }

#     talukas = session.post(BASE_URL, headers=headers, data=taluka_payload).json()[0]
#     print(talukas)
#     for t in talukas:

#         taluka_code = t["code"]
#         taluka_name = t["value"]

#         print("Taluka:", taluka_name)

#         # -------------------------
#         # 3 FETCH VILLAGES
#         # -------------------------

#         village_payload = {
#             "state": "27",
#             "level": "3",
#             "codes": f"U,{district_code},{taluka_code},",
#             "hasmap": "true"
#         }

#         villages = session.post(BASE_URL, headers=headers, data=village_payload).json()[0]

#         for v in villages:

#             village_code = v["code"]
#             village_name_mr = v["value"]

#             village_name_en = transliterate(
#                 village_name_mr,
#                 sanscript.DEVANAGARI,
#                 sanscript.ITRANS
#             )

#             # -------------------------
#             # 4 FETCH GIS CODE
#             # -------------------------

#             gis_payload = {
#                 "state": "27",
#                 "logedLevels": f"UCM{district_code}{taluka_code}{village_code}"
#             }

#             try:
#                 gis_response = session.post(GIS_URL, headers=headers, data=gis_payload)
#                 gis_data = gis_response.json()

#                 gis_code = gis_data.get("gis_code", "")

#             except:
#                 gis_code = ""

#             # -------------------------
#             # 5 FETCH EXTENT
#             # -------------------------

#             xmin = ymin = xmax = ymax = ""

#             if gis_code:

#                 extent_payload = {
#                     "state": "27",
#                     "giscode": gis_code,
#                     "srs": "4326"
#                 }

#                 try:

#                     extent = session.post(
#                         EXTENT_URL,
#                         headers=headers,
#                         data=extent_payload
#                     ).json()

#                     xmin = extent.get("xmin")
#                     ymin = extent.get("ymin")
#                     xmax = extent.get("xmax")
#                     ymax = extent.get("ymax")

#                 except:
#                     pass

#             all_rows.append({
#                 "district_code": district_code,
#                 "district_name": district_name,
#                 "taluka_code": taluka_code,
#                 "taluka_name": taluka_name,
#                 "village_code": village_code,
#                 "village_name_marathi": village_name_mr,
#                 "village_name_english": village_name_en,
#                 "gis_code": gis_code,
#                 "xmin": xmin,
#                 "ymin": ymin,
#                 "xmax": xmax,
#                 "ymax": ymax
#             })

#             time.sleep(0.1)

# # -------------------------
# # SAVE DATA
# # -------------------------

# df = pd.DataFrame(all_rows)

# df.to_csv(
#     "maharashtra_land_dataset.csv",
#     index=False,
#     encoding="utf-8-sig"
# )

# print("Saved maharashtra_land_dataset.csv")


# import requests
# import pandas as pd

# base_url = "https://mahabhunakasha.mahabhumi.gov.in/"
# api_url = base_url + "rest/VillageMapService/ListsAfterLevelGeoref"

# payload = {
#     "state": "27",
#     "level": "3",
#     "codes": "R,18,07,",
#     "hasmap": "true"
# }

# headers = {
#     "User-Agent": "Mozilla/5.0",
#     "Accept": "application/json, text/plain, */*",
#     "Content-Type": "application/x-www-form-urlencoded",
#     "Origin": base_url,
#     "Referer": base_url
# }

# session = requests.Session()

# try:
#     # 🔥 Step 1: Hit homepage (VERY IMPORTANT)
#     session.get(base_url, headers=headers)

#     # 🔥 Step 2: Call API
#     response = session.post(api_url, data=payload, headers=headers)

#     if response.status_code == 200:
#         data = response.json()
#         print("✅ Success")

#         villages = data[0]

#         df = pd.DataFrame([{
#             "village_name": v.get("value"),
#             "village_code": v.get("code"),
#             "has_data": v.get("extraParms", {}).get("hasData")
#         } for v in villages])

#         print(df.head())

#         df.to_csv("villages.csv", index=False, encoding="utf-8-sig")
#         print("✅ Saved villages.csv")

#     else:
#         print("❌ Error:", response.status_code)
#         print(response.text)

# except Exception as e:
#     print("❌ Exception:", e)



import requests
import pandas as pd
import time
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

# =============================
# CONFIG
# =============================

BASE_URL = "https://mahabhunakasha.mahabhumi.gov.in/rest/VillageMapService/ListsAfterLevelGeoref"

headers = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/x-www-form-urlencoded",
    "Referer": "https://mahabhunakasha.mahabhumi.gov.in/27/index.html",
    "Origin": "https://mahabhunakasha.mahabhumi.gov.in",
    "X-Requested-With": "XMLHttpRequest"
}

session = requests.Session()
session.get("https://mahabhunakasha.mahabhumi.gov.in/27/index.html", headers=headers)

all_rows = []

# =============================
# SAFE REQUEST FUNCTION
# =============================

def safe_post(url, payload, retries=5):
    for attempt in range(retries):
        try:
            response = session.post(
                url,
                headers=headers,
                data=payload,
                timeout=10
            )

            if response.status_code == 200:
                return response.json()

        except requests.exceptions.RequestException as e:
            print(f"⚠️ Retry {attempt+1}: {e}")

        time.sleep(2 + attempt)

    return None

# =============================
# FETCH DISTRICTS
# =============================

district_payload = {
    "state": "27",
    "level": "1",
    "codes": "U,",
    "hasmap": "true"
}

district_response = safe_post(BASE_URL, district_payload)

if not district_response:
    print("❌ Failed to fetch districts")
    exit()

districts = district_response[0]
print("✅ Districts:", len(districts))

# =============================
# MAIN LOOP
# =============================

for d in districts:

    district_code = d["code"]
    district_name = d["value"]

    print(f"\n📍 District: {district_name}")

    # -------------------------
    # FETCH TALUKAS (U + R)
    # -------------------------

    talukas = []

    for prefix in ["U", "R"]:
        taluka_payload = {
            "state": "27",
            "level": "2",
            "codes": f"{prefix},{district_code},",
            "hasmap": "true"
        }

        taluka_response = safe_post(BASE_URL, taluka_payload)

        if taluka_response:
            talukas.extend(taluka_response[0])

        time.sleep(0.2)

    # Remove duplicate talukas
    talukas = {t["code"]: t for t in talukas}.values()

    for t in talukas:

        taluka_code = t["code"]
        taluka_name = t["value"]

        print(f"   ➤ Taluka: {taluka_name}")

        # -------------------------
        # FETCH VILLAGES (U + R)
        # -------------------------

        villages = []

        for prefix in ["U", "R"]:
            village_payload = {
                "state": "27",
                "level": "3",
                "codes": f"{prefix},{district_code},{taluka_code},",
                "hasmap": "true"
            }

            village_response = safe_post(BASE_URL, village_payload)

            if village_response:
                villages.extend(village_response[0])

            time.sleep(0.2)

        # Remove duplicate villages
        villages = {v["code"]: v for v in villages}.values()

        for v in villages:

            try:
                village_code = v["code"]
                village_name_mr = v["value"]

                village_name_en = transliterate(
                    village_name_mr,
                    sanscript.DEVANAGARI,
                    sanscript.ITRANS
                )

                has_data = v.get("extraParms", {}).get("hasData", None)

                all_rows.append({
                    "district_code": district_code,
                    "district_name": district_name,
                    "taluka_code": taluka_code,
                    "taluka_name": taluka_name,
                    "village_code": village_code,
                    "village_name_marathi": village_name_mr,
                    "village_name_english": village_name_en,
                    "has_data": has_data
                })

            except Exception as e:
                print("⚠️ Village error:", e)

        # -------------------------
        # BACKUP SAVE
        # -------------------------

        if len(all_rows) % 500 == 0:
            pd.DataFrame(all_rows).to_csv("backup.csv", index=False, encoding="utf-8-sig")
            print(f"💾 Backup saved: {len(all_rows)} rows")

        # Prevent blocking
        time.sleep(0.3)

# =============================
# FINAL SAVE
# =============================

df = pd.DataFrame(all_rows)

# Remove duplicates again (safety)
df.drop_duplicates(subset=["village_code"], inplace=True)

df.to_csv(
    "maharashtra_land_dataset.csv",
    index=False,
    encoding="utf-8-sig"
)

print("\n✅ FINAL FILE SAVED")
print("📊 Total villages:", len(df))