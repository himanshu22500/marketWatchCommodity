const fs = require("fs");
const csvParser = require("csv-parser");
const sqlite3 = require("sqlite3").verbose();

function convertDateFormat(inputDate, year) {
  const months = {
    'jan': '01',
    'feb': '02',
    'mar': '03',
    'apr': '04',
    'may': '05',
    'jun': '06',
    'jul': '07',
    'aug': '08',
    'sep': '09',
    'oct': '10',
    'nov': '11',
    'dec': '12'
  };

  const [day, month] = inputDate.split('-');

  if (!months.hasOwnProperty(month.toLowerCase())) {
    console.log('Invalid month:', month);
    return null;
  }

  const monthInNumber = months[month.toLowerCase()];
  const formattedDate = `${year}-${monthInNumber}-${day.padStart(2, '0')}`;

  return formattedDate;
}


const db = new sqlite3.Database("db.db"); 
function insertDataIntoDatabase(dataArray) {

  const insertQuery = `
  INSERT INTO CommodityData (Commodity, Date, Quality, Location, PricePerKg)
  VALUES (?, ?, ?, ?, ?)
`;

    let cnt = 0;
  dataArray.forEach((data) => {
    let price = data["Price (per kg)"];
    const regex = /^(?:\d{1,4}-\d{1,4}|\d{1,4}\+)$/;
    if (regex.test(price)) {
      const parts = price.split("-");
      const firstPart = parseInt(parts[0]);
      const secondPart = parseInt(parts[1]);

      price = (firstPart + secondPart) / 2;
    }

    const date = convertDateFormat(data.Date, 2024);

    const insertValues = [
      data.Commodity,
      date,
      data.Quality,
      data.Location,
      price,
    ];

    cnt += 1;
    if(cnt == 5) return;
    console.log(insertValues);

    // console.log(insertValues);

    db.run(insertQuery, insertValues, (err) => {
      if (err) {
        console.error("Error inserting data:", err);
      } else {
        console.log("Data inserted successfully");
      }
    });
  });

  db.close();
}

//  {
//     Commodity: 'Dry Chilli',
//     Date: '14-Jul',
//     Quality: 'Medium Grade',
//     Location: 'Unjha / Mundra Delivery',
//     'Price (per kg)': '120'
//   }

const results = [];

fs.createReadStream("data.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    results.push(data);
  })
  .on("end", () => {
    insertDataIntoDatabase(results);
  });
