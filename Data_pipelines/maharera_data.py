from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time
import re

# ---------------- CONFIG ----------------
PINCODE = "414005"
URL = "https://maharera.maharashtra.gov.in/projects-search-result"

# ---------------- DRIVER ----------------
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

driver.get(URL)
wait = WebDriverWait(driver, 20)

# ---------------- ENTER PINCODE ----------------
pincode_box = wait.until(
    EC.presence_of_element_located((By.ID, "edit-project-location"))
)

pincode_box.clear()
pincode_box.send_keys(PINCODE)

# ---------------- CLICK SEARCH ----------------
search_button = wait.until(
    EC.presence_of_element_located((By.ID, "edit-submit--2"))
)
driver.execute_script("arguments[0].click();", search_button)

# wait for results
time.sleep(5)

# ---------------- GET TOTAL PAGES ----------------
pagination_text = driver.find_element(By.CSS_SELECTOR, "div.pagination").text
total_pages_text = pagination_text.split("of")[-1]
total_pages = int(re.search(r'\d+', total_pages_text).group())
print("Total pages:", total_pages)

data = []

# ---------------- LOOP THROUGH PAGES ----------------
for page in range(total_pages):
    print(f"Scraping page {page+1} of {total_pages} ...")
    
    projects = driver.find_elements(
        By.CSS_SELECTOR,
        "div.row.shadow.p-3.mb-5.bg-body.rounded"
    )

    for p in projects:
        try:
            rera_no = p.find_element(By.CSS_SELECTOR, "p.p-0").text.replace("#","")
        except:
            rera_no = ""
        try:
            project_name = p.find_element(By.CSS_SELECTOR, "h4.title4").text
        except:
            project_name = ""
        try:
            promoter = p.find_element(By.CSS_SELECTOR, "p.darkBlue.bold").text
        except:
            promoter = ""

        # State, Pincode, District, Last Modified
        try:
            fields = p.find_elements(By.CSS_SELECTOR, "div.col-xl-4 p")
            state = fields[0].text if len(fields) > 0 else ""
            pincode_val = fields[1].text if len(fields) > 1 else ""
            district = fields[2].text if len(fields) > 2 else ""
            last_modified = fields[3].text if len(fields) > 3 else ""
        except:
            state = pincode_val = district = last_modified = ""

        try:
            details_link = p.find_element(By.CSS_SELECTOR, "a.viewLink").get_attribute("href")
        except:
            details_link = ""

        data.append({
            "RERA_No": rera_no,
            "Project_Name": project_name,
            "Promoter": promoter,
            "State": state,
            "Pincode": pincode_val,
            "District": district,
            "Last_Modified": last_modified,
            "Details_Link": details_link
        })

    # ---------------- CLICK NEXT PAGE ----------------
    if page < total_pages - 1:
        try:
            next_button = driver.find_element(By.CSS_SELECTOR, "a.next")
            driver.execute_script("arguments[0].click();", next_button)
            time.sleep(4)  # wait for next page to load
        except:
            print("Next button not found, ending loop.")
            break

# ---------------- SAVE CSV ----------------
df = pd.DataFrame(data)
df.to_csv("maharera_projects_all_pages.csv", index=False)

print("Scraping complete. Total projects:", len(df))
print("Saved to maharera_projects_all_pages.csv")

driver.quit()