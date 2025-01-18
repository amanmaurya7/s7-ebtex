import jsonfile from 'jsonfile';
import fs from 'fs';

// Function to convert JSON to CSV
function jsonToCsv(inputFilePath, outputFilePath) {
    // Read the JSON file
    jsonfile.readFile(inputFilePath)
        .then(jsonData => {
            // Prepare CSV data
            let csvData = 'key,value\n'; // CSV header
            for (const [key, value] of Object.entries(jsonData)) {
                csvData += `${key},${value}\n`; // Append each key-value pair
            }

            // Write CSV data to output file
            fs.writeFile(outputFilePath, csvData, (err) => {
                if (err) {
                    console.error('Error writing to CSV file:', err);
                } else {
                    console.log(`CSV file created successfully at ${outputFilePath}`);
                }
            });
        })
        .catch(err => {
            console.error('Error reading JSON file:', err);
        });
}

// Get input and output file paths from command line arguments
const inputFilePath = process.argv[2]; // First argument
const outputFilePath = process.argv[3]; // Second argument

// Check if both arguments are provided
if (!inputFilePath || !outputFilePath) {
    console.error('Usage: node jsonToCsv.js <input.json> <output.csv>');
    process.exit(1);
}

// Call the function to convert JSON to CSV
jsonToCsv(inputFilePath, outputFilePath);

