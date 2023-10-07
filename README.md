# ArXiv Search Web Application (Version 1.0alpha)

## Overview
This web application enables users to search the Arxiv repository for academic papers, process the results, and download them in various formats including Markdown, XML, YAML, and HTML.

## DEMO
A live demo of the project is available [here](https://maxime-fleury.github.io/ArXivSearch/).

## Features
- **Search Functionality**: Users can search for academic papers by entering a search term.
- **Download Functionality**: Users can download the search results in Markdown, XML, YAML, or HTML format.
- **Upload Functionality**: Users can upload files to be displayed within the application.
- **Search in Results**: Users can further search within the displayed results.
- **Dark Mode UI**: The application is styled with a dark mode theme for ease of use in low light environments.

## Usage

### Search
1. Enter a search term in the provided text box.
2. Click the "Search" button to execute the search.
3. The results will be displayed below the search box.

### Download
1. Select the desired download format from the dropdown menu.
2. Click the "Download" button to download the results in the selected format.

### Upload
1. Click the "Upload" button and select a file from your device.
2. The contents of the file will be displayed within the application.

### Search in Results
1. Enter a term in the "Search in result" text box to highlight occurrences of the term in the displayed results.

## Technical Details
The main JavaScript file (`script.js`) contains several functions to handle user interactions, search, process, and download data from the Arxiv repository.

### Dependencies
- Bootstrap 5.1.0
- mark.js
- markdown-it
- highlight.js

## Future Enhancements
- Improve error handling and user feedback.
- Optimize performance for handling large result sets.
- Enhance mobile responsiveness.

## Contribution
Feel free to fork this project and submit pull requests for any enhancements.

## License
MIT License
