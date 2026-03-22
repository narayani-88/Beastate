import requests
from bs4 import BeautifulSoup
import pandas as pd

BASE_SEARCH_URL = "https://www.eauctionsindia.com/search"
PROPERTY_URL = "https://www.eauctionsindia.com/properties/"

headers = {
    "User-Agent": "Mozilla/5.0"
}

# -----------------------------
# Search parameters (CHANGE HERE)
# -----------------------------
params = {
    "keyword": "",
    "category": "residential",
    "state": "maharashtra",
    "city": "mumbai",
    "area": "",
    "bank": "",
    "from": "",
    "to": "",
    "min_price": "",
    "max_price": ""
}

# -----------------------------
# STEP 1: GET AUCTION IDS
# -----------------------------
def get_auction_ids():

    response = requests.get(BASE_SEARCH_URL, params=params, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    auction_ids = []

    rows = soup.find_all("div", class_="row")

    for r in rows:

        text = r.get_text()

        if "Auction ID" in text:

            try:
                auction_id = text.split("Auction ID :#")[1].split()[0]
                auction_ids.append(auction_id.strip())
            except:
                pass

    return list(set(auction_ids))


# -----------------------------
# STEP 2: SCRAPE PROPERTY PAGE
# -----------------------------
def scrape_property(auction_id):

    url = PROPERTY_URL + auction_id
    res = requests.get(url, headers=headers)

    soup = BeautifulSoup(res.text, "html.parser")

    data = {}
    data["auction_id"] = auction_id
    data["url"] = url

    # Title
    try:
        data["title"] = soup.find("h1").text.strip()
    except:
        data["title"] = None

    # Bank Details
    details = soup.find_all("li")

    for d in details:

        text = d.get_text(strip=True)

        if "Bank Name" in text:
            data["bank"] = text.split(":")[-1].strip()

        elif "Reserve Price" in text:
            data["reserve_price"] = text.split(":")[-1].strip()

        elif "EMD" in text:
            data["emd"] = text.split(":")[-1].strip()

        elif "Branch Name" in text:
            data["branch"] = text.split(":")[-1].strip()

        elif "Service Provider" in text:
            data["service_provider"] = text.split(":")[-1].strip()

        elif "Borrower Name" in text:
            data["borrower"] = text.split(":")[-1].strip()

        elif "Property Type" in text:
            data["property_type"] = text.split(":")[-1].strip()

        elif "Auction Start Date" in text:
            data["auction_start"] = text.split(":")[-1].strip()

        elif "Auction End Time" in text:
            data["auction_end"] = text.split(":")[-1].strip()

    # Description
    try:
        desc = soup.find("div", class_="card-body").find("p")
        data["description"] = desc.text.strip()
    except:
        data["description"] = None

    # Location
    try:
        location = soup.find_all("strong")

        for l in location:

            if "Province/State" in l.text:
                data["state"] = l.find_next("span").text.strip()

            if "City/Town" in l.text:
                data["city"] = l.find_next("span").text.strip()

            if "Area/Town" in l.text:
                data["area"] = l.find_next("span").text.strip()
    except:
        pass

    return data


# -----------------------------
# MAIN FUNCTION
# -----------------------------
def run_scraper():

    auction_ids = get_auction_ids()

    print("Found Auctions:", auction_ids)

    all_data = []

    for aid in auction_ids:

        print("Scraping:", aid)

        try:
            data = scrape_property(aid)
            all_data.append(data)
        except Exception as e:
            print("Error:", e)

    df = pd.DataFrame(all_data)

    df.to_csv("auctions.csv", index=False)

    print("Saved auctions.csv")


# -----------------------------
# RUN
# -----------------------------
run_scraper()