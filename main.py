#http://air4thai.com/forweb/getHistoryData.php?stationID=35t&param=PM25&type=hr&sdate=2025-01-07&edate=2025-01-08&stime=00&etime=23

import json
# from urllib.request import urlopen
import pandas as pd
import urllib.request

url = 'http://air4thai.com/forweb/getHistoryData.php?'

url += 'stationID=35t&param=PM25&type=hr&sdate='

startDate = '2024-11-01'

endDate = '2025-01-08'

url += startDate + '&edate=' + endDate + '&stime=00&etime=23'

contents = urllib.request.urlopen(url).read()

data = json.loads(contents.decode('utf-8'))

station_data = data['stations'][0]['data']

df = pd.DataFrame(station_data)

datetimes = df['DATETIMEDATA']  
pm25_values = df['PM25']     

datetimes_list = datetimes.tolist()
pm25_values_list = pm25_values.tolist()

# print("\nDATETIMEDATA as list:")
# print(datetimes_list)

# print("\nPM25 as list:")
# print(pm25_values_list)

df['DATETIMEDATA'] = pd.to_datetime(df['DATETIMEDATA'])

# Extract time and date
df['Time'] = df['DATETIMEDATA'].dt.strftime('%H:%M')  # Format as HH:MM
df['Date'] = df['DATETIMEDATA'].dt.strftime('%Y/%m/%d')  # Format as YYYY-MM-DD
# df['Date'] = df['DATETIMEDATA'].dt.strftime('%d/%m/%Y')  # Format as DD/MM/YY

# Pivot the table
pivot_df = df.pivot(index='Time', columns='Date', values='PM25')

# Save to Excel
output_file = "/Users/nathan/Documents/Coding/Air4Thai API/data.xlsx"
pivot_df.to_excel(output_file)

print(f"Data saved to {output_file}")
