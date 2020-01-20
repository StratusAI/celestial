const pdfFiller = require('pdffiller');
const fs = require('fs');
const axios = require('axios');
let destinationPDF =  "./output/completed.pdf";
const GTC = ["Gewesen Transportation Corp.", "B03278", "Maximinio De Jesus", "./pdf/GTC-MD.pdf"]
const ASC = ["Amerikanisch Services Corp.", "B03279", "Sarah De Jesus", "./pdf/BLANK-NOSIG.pdf"]
const STC = ["Starostka Transportation Corp", "-", "Ingrid Baez", "./pdf/BLANK-NOSIG.pdf"]
const HEC = ["Heisenberg-Esser Corp", "-", "Maximo Polanco", "./pdf/BLANK-NOSIG.pdf"]


let data = {
  'Cell phone': '917',
  undefined_12: '440',
  undefined_13: '3563',
  'Email Address': 'corp@wherego.io',
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
  Group8: 'Choice1',
  Group9: 'Choice1',
  Group13: 'Choice1',
  Group16: 'Choice2',
  Group17: 'Choice12',
  Group18: 'Choice2',
  Group19: 'Choice1',
  Group24: 'Choice1', //DONE
  Group25: 'Choice1', //DONE
}

const getCompany = async (tlcBizName) => {
  try {
    return await axios.get(`https://data.ny.gov/resource/n9v6-gdp6.json?$q=${tlcBizName}`)
  } catch (error) {
    console.log(`Company ${tlcBizName}not found`, error)
    return "C-NOTFOUND"
  }
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
    console.log(`TLC PLATE ${tlcPlate} not found`, error)
  }
}

const getVinDetails = (vinNumber) => {
  try {
    return axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vinNumber}*BA?format=json`)
  } catch (error) {
    console.log(`${vinNumber} not found`, error)
  }
}

let vehiclesList = [
['T709400C', ASC],
['T709398C', GTC],
['T709397C', HEC],
['T709394C', STC],
['T719685C', HEC],
['T719716C', HEC],
['T719725C', HEC],
['T719912C', HEC],
['T724613C', STC],
['T724611C', ASC],
['T719826C', STC],
['T752450C', STC],
['T755361C', STC],
['T732096C', ASC],
['T743993C', GTC],
['T744004C', HEC],
['T752794C', ASC],
['T768394C', ASC]
['T794981C', GTC]
];
for(let i = 0; i <= vehiclesList.length; i++){

  const backup = [
  {
    active: 'YES',
    vehicle_license_number: '5742047',
    name: '00--',
    license_type: 'FOR HIRE VEHICLE',
    expiration_date: '2020-11-29T00:00:00.000',
    dmv_license_plate_number: '-',
    vehicle_vin_number: '-',
    vehicle_year: '-',
    base_number: '-',
    base_name: '-',
    base_type: 'BLACK-CAR',
    base_telephone_number: '(718)971-5559',
    website: 'ZWEINYC.COM',
    base_address: '636 WEST   28 STREET NEW YORK NY 10001',
    reason: 'G',
    last_date_updated: '2020-01-18T00:00:00.000',
    last_time_updated: '13:25'
  }
]

  const useAPI = async () => {
    const tlcAPI = getTLCVehicleDetails(vehiclesList[i][0])
      .then(vehicleDetails => {
        let vhr = JSON.stringify(vehicleDetails.data);
        let hrf = JSON.parse(vhr);
        console.log(hrf)

        // console.log(hrf[0].vehicle_vin_number)

        if(hrf[0] === undefined){
          console.log(hrf[0] === undefined);
          fs.writeFile(`notInTLC/${vehiclesList[i][0]}.txt`, `${vehiclesList[i][0]}`, (err) => {

            // In case of a error throw err.
          if (err) throw err;
          })
          i = vehiclesList.length;
        }
        else {
          data['VEHICLE ID_2'] = hrf[0].vehicle_vin_number;
          data.YEAR_2 = hrf[0].vehicle_year;
          data['with the vehicle identification number'] = hrf[0].vehicle_vin_number;
          data['BASE  AUTHORITY NAME_2'] = hrf[0].base_name;
          data['BASE LICENSE_2'] = hrf[0].base_number;
      }
        console.dir(`Done with that ${hrf[0].base_number}`)
        getVinDetails(hrf[0].vehicle_vin_number)
          .then(nhtsaLookup => {
            data.MAKE_2 = nhtsaLookup.data.Results[6].Value;
            getCompany(hrf[0].name)
              .then(res => {
                console.log(res.data[0])
                data.Name = res.data[0].current_entity_name;
                data['Mailing Address'] = res.data[0].dos_process_address_1;
                data['Residence Address No PO Boxes'] = res.data[0].dos_process_address_1;
                data.City = res.data[0].dos_process_city;
                data.City_2 = res.data[0].dos_process_city;
                data.State = res.data[0].dos_process_state;
                data.State_2 = res.data[0].dos_process_state;
                data.Zip = res.data[0].dos_process_zip;
                data.Zip_2 = res.data[0].dos_process_zip;

                data.PLATE_2 = vehiclesList[i][0];
                data['BASE  AUTHORITY NAME'] = vehiclesList[i][1][0];
                data['BASE LICENSE'] = vehiclesList[i][1][1];
                data['Print Name_2'] = vehiclesList[i][1][2]



                pdfFiller.fillForm( vehiclesList[i][1][3], `./output/${vehiclesList[i][0]}.pdf`, data, function(err) {
                    console.log("In callback (we're done).");
                });
              })

          })

        // console.log(data);


      })
      .catch(error => {
      console.log(error)
    });
  }

  useAPI();

  // console.log(data);
}
