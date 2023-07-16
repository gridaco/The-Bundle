import os
import datetime
import subprocess
from tqdm import tqdm
import concurrent.futures

DATES = []

# make date string, e.g. JUL 12. 365 days
for i in range(365):
    date = datetime.date(2021, 1, 1) + datetime.timedelta(days=i)
    date_str = date.strftime("%b %d")
    DATES.append(date_str.upper())


# reverse the list
DATES = DATES[::-1]

def render(date):
    subprocess.run(
        [
            'python3', '../src/cli.py',
            '-f', './scene.blend',
            '-t', date,
            '-o', "./out/" + date + '/'
        ],
        stdout=subprocess.DEVNULL)
    return date

with concurrent.futures.ThreadPoolExecutor(max_workers=os.cpu_count()) as executor:
    futures = [executor.submit(render, date) for date in DATES]
    for future in tqdm(concurrent.futures.as_completed(futures), total=len(DATES)):
        date = future.result()
