
document.getElementById('searchButton').addEventListener('click', search);
document.getElementById('downloadButton').addEventListener('click', download);
document.getElementById('uploadFile').addEventListener('change', upload);

async function search() {
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('loading-spinner').classList.add('show');

    try {
        const searchTerm = document.getElementById('searchTerm').value;
        if (!searchTerm) {
            alert('Please enter a search term.');
            return;
        }

        const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(searchTerm)}&sortBy=lastUpdatedDate&sortOrder=descending&max_results=200`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const text = await response.text();
        const data = (new window.DOMParser()).parseFromString(text, "text/xml");
        document.getElementById('loading-spinner').style.display = 'none';
        document.getElementById('loading-spinner').classList.remove('show');

        processXmlData(data);

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        alert('There was a problem fetching the data. Please try again later.');
    }
}

function processXmlData(data) {
    const format = document.getElementById('downloadFormat').value;
    const entries = data.querySelectorAll('entry');
    if(entries.length === 0) {
        document.getElementById('result').textContent = 'No results found.';
    }
    let resultContent = '';
    entries.forEach(entry => {
        const title = entry.querySelector('title').textContent;
        const summary = entry.querySelector('summary').textContent;
        const authors = entry.querySelectorAll('author');
        const authorNames = [];
        authors.forEach(author => {
            const authorName = author.querySelector('name').textContent;
            authorNames.push(authorName);
        });
        const publishedDate = entry.querySelector('published').textContent;
        const updatedDate = entry.querySelector('updated').textContent;
        const link = entry.querySelector('link[title="pdf"]').getAttribute('href');
        const doiElement = entry.getElementsByTagNameNS('*', 'doi')[0];
        const doi = doiElement ? doiElement.textContent : 'N/A';
        const categoryElement = entry.getElementsByTagNameNS('*', 'primary_category')[0];
        const categories = categoryElement ? categoryElement.getAttribute('term') : 'N/A';
        const arxivId = entry.querySelector('id').textContent.split('/').pop();

        resultContent += `# ${title}\n\n`;
        resultContent += `**Authors**: ${authorNames.join(', ')}\n\n`;
        resultContent += `**Published**: ${publishedDate}\n\n`;
        resultContent += `**Updated**: ${updatedDate}\n\n`;
        resultContent += `**DOI**: ${doi}\n\n`;
        resultContent += `**Categories**: ${categories}\n\n`;
        resultContent += `**ArXiv ID**: ${arxivId}\n\n`;
        resultContent += `**Link**: ${link}\n\n`;
        resultContent += `**Summary**: ${summary}\n\n`;
        resultContent += `---\n\n`;
    });

    document.getElementById('result').textContent = resultContent;
    document.getElementById('downloadButton').disabled = false;
    displayContent(resultContent, format);
}

async function download() {
    const format = document.getElementById('downloadFormat').value;
    let content = document.getElementById('result').textContent;
    let filename, contentType;

    // Convert content to selected format
    content = convertToFormat(content, format);

    switch (format) {
        case 'xml':
            contentType = 'text/xml';
            filename = `output-${Date.now()}.xml`;
            break;
        case 'yaml':
            contentType = 'text/yaml';
            filename = `output-${Date.now()}.yaml`;
            break;
        case 'html':
            contentType = 'text/html';
            filename = `output-${Date.now()}.html`;
            break;
        default:  // markdown
            contentType = 'text/markdown';
            filename = `output-${Date.now()}.md`;
    }

    const blob = new Blob([content], {type: contentType});
    const totalLength = blob.size;
    let bytesReceived = 0;

    // Simulate download progress
    while (bytesReceived < totalLength) {
        await new Promise(resolve => setTimeout(resolve, 100));  // Simulate network delay
        bytesReceived = Math.min(bytesReceived + 1024, totalLength);  // Simulate 1KB chunks download
        const progress = (bytesReceived / totalLength) * 100;
        console.log(`Download progress: ${progress.toFixed(2)}%`);
        // Update progress bar here
    }

    // Once download is "complete", create a link element to trigger download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function displayContent(content, format) {
    const resultDiv = document.getElementById('result');
    switch (format) {
        case 'html':
            resultDiv.innerHTML = content;  // Directly set the HTML content
            break;
        case 'yaml':
            resultDiv.textContent = content;  // Set as text content
            hljs.highlightBlock(resultDiv);  // Apply syntax highlighting
            break;
        case 'md':
        default:
            const md = new markdownit();
            resultDiv.innerHTML = md.render(content);  // Render Markdown to HTML
    }
}
function convertToFormat(content, format) {
    switch (format) {
        case 'xml':
            // Conversion to XML
            content = `<document>${content.replace(/#/g, '<title>').replace(/<\/title>/g, '</title>\n')}</document>`;
            break;
        case 'yaml':
            // Conversion to YAML (assuming each section is a key-value pair)
            content = content.replace(/# (.*?)(\n\n)/g, '$1: |+\n  ').replace(/\n/g, '\n  ');
            break;
        case 'html':
            // Conversion to HTML
            content = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Document</title>
                </head>
                <body>
                    ${content.replace(/#/g, '<h1>').replace(/<\/h1>/g, '</h1>\n')}
                </body>
                </html>
            `;
            break;
        // No conversion needed for markdown
    }
    return content;
}
document.getElementById('resultSearchTerm').addEventListener('input', searchInResult);

function searchInResult() {
    const searchTerm = document.getElementById('resultSearchTerm').value;
    const resultElement = document.getElementById('result');
    const instance = new Mark(resultElement);
    instance.unmark();  // Remove any previous highlights
    if (searchTerm) {
        instance.mark(searchTerm);
    }
}

function upload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const format = document.getElementById('downloadFormat').value;
            displayContent(e.target.result, format);
            document.getElementById('downloadButton').disabled = false;
        };
        reader.readAsText(file);
    }
}
