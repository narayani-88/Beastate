from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select
from webdriver_manager.chrome import ChromeDriverManager
import time
import pandas as pd

# ---------------- DRIVER ----------------
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# ---------------- OPEN WEBSITE ----------------
url = "https://pay2igr.igrmaharashtra.gov.in/eDisplay/Propertydetails/index"
driver.get(url)

time.sleep(3)

# ---------------- INPUT DATA ----------------
district_id = "10"     # example
taluka_id = "3"
village_id = "179"
cts_number = "99"

# ---------------- SELECT YEAR ----------------
year_dropdown = Select(driver.find_element(By.ID, "dbselect"))
year_dropdown.select_by_visible_text("2025")

# ---------------- SELECT DISTRICT ----------------
district_dropdown = Select(driver.find_element(By.ID, "district_id"))
district_dropdown.select_by_value(district_id)

time.sleep(2)

# ---------------- SELECT TALUKA ----------------
taluka_dropdown = Select(driver.find_element(By.ID, "taluka_id"))
taluka_dropdown.select_by_value(taluka_id)

time.sleep(2)

# ---------------- SELECT VILLAGE ----------------
village_dropdown = Select(driver.find_element(By.ID, "village_id"))
village_dropdown.select_by_value(village_id)

# ---------------- ARTICLE (optional) ----------------
# leave empty for all OR use specific
# article_dropdown = Select(driver.find_element(By.ID, "article_id"))
# article_dropdown.select_by_value("9")  # sale deed

# ---------------- ENTER CTS ----------------
driver.find_element(By.ID, "free_text").send_keys(cts_number)

# ---------------- CAPTCHA ----------------
print("\n👉 Please enter CAPTCHA manually in browser...")
input("Press ENTER after solving CAPTCHA...")

# ---------------- CLICK SEARCH ----------------
driver.find_element(By.ID, "submit").click()

time.sleep(5)

# ---------------- PARSE TABLE ----------------
data = []

try:
    table = driver.find_element(By.TAG_NAME, "table")
    rows = table.find_elements(By.TAG_NAME, "tr")

    for row in rows:
        cols = row.find_elements(By.TAG_NAME, "td")
        cols_text = [col.text.strip() for col in cols]

        if cols_text:
            data.append(cols_text)

except:
    print("❌ No table found")

# ---------------- SAVE ----------------
df = pd.DataFrame(data)
df.to_csv("igr_output.csv", index=False)

print("\n✅ Data saved to igr_output.csv")

# ---------------- CLOSE ----------------
# driver.quit()