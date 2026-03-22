import pandas as pd
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

# ===============================
# URL
# ===============================
url = "https://www.eauctionsindia.com/properties/711379"

# ===============================
# START SELENIUM
# ===============================
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

driver.get(url)
time.sleep(5)

html = driver.page_source
driver.quit()

# ===============================
# PARSE HTML
# ===============================
soup = BeautifulSoup(html, "html.parser")

data = {}

# ===============================
# TITLE
# ===============================
title = soup.find("h1").text.strip()
data["Title"] = title

# ===============================
# AUCTION ID
# ===============================
auction_id = soup.find("a", string=lambda x: x and "Auction ID" in x).text.strip()
data["Auction ID"] = auction_id

# ===============================
# LOCATION
# ===============================
location = soup.find("i", {"class": "fa-solid fa-location-dot"}).find_parent("p").text.strip()
data["Location"] = location

# ===============================
# AUCTION DATE
# ===============================
auction_date = soup.find("i", {"class": "fa fa-calendar-o"}).find_parent("span").text.strip()
data["Auction Date"] = auction_date

# ===============================
# DESCRIPTION
# ===============================
description = soup.find("h5", string="Description").find_next("p").text.strip()
data["Description"] = description

# ===============================
# BANK DETAILS
# ===============================
bank_section = soup.find("h5", string="Bank Details").find_parent("div").find_next("div")

for li in bank_section.find_all("li"):

    strong = li.find("strong")
    span = li.find("span")

    if strong and span:
        key = strong.text.replace(":", "").strip()
        value = span.text.strip()

        data[key] = value

# ===============================
# PROPERTY DETAILS
# ===============================
prop_section = soup.find("h5", string="Property Details").find_parent("div").find_next("div")

for li in prop_section.find_all("li"):

    strong = li.find("strong")
    span = li.find("span")

    if strong and span:
        key = strong.text.replace(":", "").strip()
        value = span.text.strip()

        data[key] = value

# ===============================
# GET IMAGE
# ===============================
img_tag = soup.find("img")

image_file = None

if img_tag:
    image_url = img_tag.get("src")

    if image_url.startswith("/"):
        image_url = "https://www.eauctionsindia.com" + image_url

    image_file = "property_image.jpg"

    img_data = requests.get(image_url).content

    with open(image_file, "wb") as f:
        f.write(img_data)

data["Image File"] = image_file

# ===============================
# SAVE TO EXCEL
# ===============================
df = pd.DataFrame([data])

excel_file = "auction_property_data.xlsx"
df.to_excel(excel_file, index=False)

print("✅ Data saved to:", excel_file)
print("✅ Image saved as:", image_file)