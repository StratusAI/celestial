const pdfFiller = require('pdffiller');
const fs = require('fs');
const axios = require('axios');
const sourcePDF = "./pdf/tlc-transfer-app.pdf";
let destinationPDF =  "./output/completed.pdf";
const BASE1 = ["Gewesen Transportation Corp.", "B03278"]
const BASE2 = ["Amerikanisch Services Corp.", "B03279"]

let data = {
   Name: 'Affordable Leasing Management Inc.',
  'Mailing Address': '2150 Jerome Avenue',
  City: 'Bronx',
  State: 'NY',
  Zip: '10453',
  'Cell phone': '917',
  undefined_12: '440',
  undefined_13: '3563',
  'Email Address': 'corp@wherego.io',
  'Residence Address No PO Boxes': '2150 Jereme Avenue',
  City_2: 'New York',
  State_2: 'NY',
  Zip_2: '10453',
  NAME: 'BOAZ BAGBAG',
  undefined_20: '917',
  undefined_21: '440',
  undefined_22: '3563',
  Name_2: 'BOAZ BAGBAG',
  Name_3: 'BOAZ BAGBAG',
  'Entity Name either applicant name  base or SHL permit holder': 'Affordable Leasing Management Inc.',
  'Print Name': 'BOAZ BAGBAG',
  Group4: 'Choice1',
  Group6: 'Choice2',
  Group7: 'Choice1',
  Group8: 'Choice2',
  Group9: 'Choice1',
  Group13: 'Choice1',
  Group17: 'Choice1',
  Group18: 'Choice2',
  Group19: 'Choice1',
  Group24: 'Choice1', //DONE
  Group25: 'Choice1', //DONE
}

const getTLCVehicleDetails = async (tlcPlate) => {
  try {
    return await axios.get(`https://data.cityofnewyork.us/resource/8wbx-tsch.json?dmv_license_plate_number=${tlcPlate}`,
      {
        data: {
        "$$app_token" : "VRXomMgmIflhF_Z4j1ZxqGTIge52-FvbFXwj6"
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const getVinDetails = (vinNumber) => {
  try {
    return axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vinNumber}*BA?format=json`)
  } catch (error) {
    console.error(error)
  }
}

let vehiclesList = [["T709394C", BASE1],["T719685C", BASE1],["T719716C", BASE1],["T719725C", BASE2],["T719912C", BASE2],["T719826C", BASE2],["T709400C", BASE2]];

for(let i = 0; i < vehiclesList.length; i++){
  const useAPI = async () => {
    const tlcAPI = getTLCVehicleDetails(vehiclesList[i][0])
      .then(vehicleDetails => {
        let vhr = JSON.stringify(vehicleDetails.data)
        console.log(vhr)
        let hrf = JSON.parse(vhr);

        console.log(hrf[0].vehicle_vin_number)
        data['VEHICLE ID_2'] = hrf[0].vehicle_vin_number;
        data.YEAR_2 = hrf[0].vehicle_year;
        data['with the vehicle identification number'] = hrf[0].vehicle_vin_number;
        data['BASE  AUTHORITY NAME_2'] = hrf[0].base_name;
        data['BASE LICENSE_2'] = hrf[0].base_number;
        console.dir(`Done with that ${hrf[0].base_number}`)
        getVinDetails(hrf[0].vehicle_vin_number)
          .then(nhtsaLookup => {
            data.MAKE_2 = nhtsaLookup.data.Results[6].Value;

            data.PLATE_2 = vehiclesList[i][0];
            data['BASE  AUTHORITY NAME'] = vehiclesList[i][1][0];
            data['BASE LICENSE'] = vehiclesList[i][1][1];

            // console.log(data);
            pdfFiller.fillForm( sourcePDF, `./output/${vehiclesList[i][0]}.pdf`, data, function(err) {
                if (err) throw err;
                console.log("In callback (we're done).");
            });
          })

        // console.log(data);


      })
      .catch(error => {
      console.log(error)
    });
  }

  useAPI();

  console.log(data);
}
