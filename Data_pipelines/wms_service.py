import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# =============================
# DRIVER SETUP (AUTO INSTALL)
# =============================
chrome_options = Options()
chrome_options.add_argument("--start-maximized")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)

# =============================
# OPEN WEBSITE (GET SESSION)
# =============================
main_url = "https://mahabhunakasha.mahabhumi.gov.in/27/index.html"
driver.get(main_url)

time.sleep(5)  # let site fully load

# =============================
# EXTRACT COOKIES
# =============================
session = requests.Session()

for cookie in driver.get_cookies():
    session.cookies.set(cookie['name'], cookie['value'])

# =============================
# WMS API CALL
# =============================
url = "https://mahabhunakasha.mahabhumi.gov.in/WMS"

params = {
    "SERVICE": "WMS",
    "VERSION": "1.3.0",
    "REQUEST": "GetMap",
    "FORMAT": "image/png",
    "TRANSPARENT": "true",
    "LAYERS": "VILLAGE_MAP",
    "transparent": "true",
    "state": "27",
    "gis_code": "UCM1601000000000000001602",
    "srs": "EPSG:4326",
    "overlay_codes": "",
    "CRS": "EPSG:3857",
    "STYLES": "VILLAGE_MAP",
    "WIDTH": "661",
    "HEIGHT": "737",
    "BBOX": "77.09461750948842,19.667338008441874,77.19084027000977,19.774713861660018"
}

headers = {
    "User-Agent": driver.execute_script("return navigator.userAgent;"),
    "Referer": main_url
}

response = session.get(url, params=params, headers=headers)

# =============================
# SAVE IMAGE
# =============================
if response.status_code == 200:
    with open("village_map.png", "wb") as f:
        f.write(response.content)
    print("✅ Image saved successfully")
else:
    print("❌ Failed:", response.status_code)

# =============================
# CLEANUP
# =============================
driver.quit()