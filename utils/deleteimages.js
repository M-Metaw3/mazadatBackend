const fs = require('fs');
const path = require('path');

/**
 * Deletes a file if it exists.
 * @param {string} filePath - The path to the file to be deleted.
 * @returns {Promise<void>} - Resolves when the file is deleted or rejects with an error.
 */
async function deleteFileIfExists(filePath) {
    try {
        // Check if the file exists
        await fs.promises.access(filePath, fs.constants.F_OK);
console.log(filePath)
        // File exists, proceed with deletion
        console.log(filePath)
        await fs.promises.unlink(filePath);
        console.log(`File '${path.basename(filePath)}' deleted successfully.`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist
            console.log(`File '${path.basename(filePath)}' not found, so not deleting.`);
        } else {
            // Other error (e.g., permission issues)
            console.error(`Error deleting file '${path.basename(filePath)}': ${error.message}`);
            throw error;
        }
    }
}

// Example usage:
const imagePath = path.join(__dirname, 'images', 'my-image.jpg'); // Adjust the path as needed
deleteFileIfExists(imagePath)
    .then(() => {
        // Handle success (if needed)
    })
    .catch((err) => {
        // Handle error (if needed)
    });

    module.exports = deleteFileIfExists;