const fs = require('fs');
const axios = require('axios');
const { parse } = require('json2csv');
const { DateTime } = require('luxon');

const startDate = '2024-11-01';
const endDate = '2025-01-08';

// const url = 'http://air4thai.com/forweb/getHistoryData.php?stationID=35t&param=PM25&type=hr&sdate=2024-11-01&edate=2025-01-08&stime=00&etime=23';

const url = 'http://air4thai.com/forweb/getHistoryData.php?stationID=35t&param=PM25&type=hr&sdate=' + startDate + '&edate=' + endDate + '&stime=00&etime=23';

axios.get(url)
    .then(response => {
        const data = response.data.stations[0].data;

        const formattedData = data.map(entry => {
            const dateTime = DateTime.fromFormat(entry.DATETIMEDATA, 'yyyy-MM-dd HH:mm:ss');
            return {
                Time: dateTime.toFormat('HH:mm'),
                Date: dateTime.toFormat('yyyy/MM/dd'),
                PM25: entry.PM25
            };
        });

        const pivotData = {};
        formattedData.forEach(entry => {
            if (!pivotData[entry.Time]) {
                pivotData[entry.Time] = {};
            }
            pivotData[entry.Time][entry.Date] = entry.PM25;
        });

        const pivotArray = Object.keys(pivotData).map(time => {
            const row = { Time: time };
            Object.keys(pivotData[time]).forEach(date => {
                row[date] = pivotData[time][date];
            });
            return row;
        });

        const csv = parse(pivotArray, { fields: ['Time', ...new Set(formattedData.map(entry => entry.Date))] });

        fs.writeFileSync('/Users/nathan/Documents/Coding/Air4Thai API/data.csv', csv);
        console.log('Data saved to /Users/nathan/Documents/Coding/Air4Thai API/data.csv');
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });