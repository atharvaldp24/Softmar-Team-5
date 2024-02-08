from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def open_and_close_chrome(url, open_duration=20, close_duration=15):
    # Set up Chrome options
    chrome_options = Options()

    # Add the headless option to run Chrome in headless mode
    chrome_options.add_argument('--headless')

    # Specify the path to your user data directory
    user_data_dir = "C:/Users/anurag.kumar/AppData/Local/Google/Chrome/User Data"
    chrome_options.add_argument(f'--user-data-dir={user_data_dir}')

    while True:
        # Create a Chrome WebDriver instance
        driver = webdriver.Chrome(options=chrome_options)

        try:
            # Open the specified URL
            driver.get(url)

            # Wait for the specified duration while the browser is open
            WebDriverWait(driver, open_duration).until(EC.presence_of_element_located((By.TAG_NAME, 'body')))

        finally:
            # Wait for the specified duration before opening the browser again
            time.sleep(close_duration)

            # Close the browser
            driver.quit()


if __name__ == "__main__":
    # Replace 'http://localhost:3000/' with your desired URL
    target_url = 'http://localhost:3000/dashboard'
    open_and_close_chrome(target_url)
