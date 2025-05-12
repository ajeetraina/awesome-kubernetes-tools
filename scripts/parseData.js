#!/usr/bin/env node

/**
 * Script to parse the kubetools README.md and generate a JSON data file
 * 
 * Usage: node parseData.js
 * 
 * This script will:
 * 1. Fetch the README.md from the kubetools repository
 * 2. Parse the markdown tables into structured JSON data
 * 3. Save the data to src/data/tools.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const fetch = require('node-fetch');

// URL of the raw README.md file
const readmeUrl = 'https://raw.githubusercontent.com/ajeetraina/kubetools/main/README.md';

// Function to get GitHub stars count for a repository
async function getGitHubStars(repoUrl) {
  try {
    if (!repoUrl || !repoUrl.includes('github.com')) {
      return 0;
    }

    // Extract owner and repo from URL
    const parts = repoUrl.replace('https://github.com/', '').split('/');
    if (parts.length < 2) {
      return 0;
    }

    const owner = parts[0];
    const repo = parts[1];

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: process.env.GITHUB_TOKEN 
        ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
        : {}
    });

    if (response.ok) {
      const data = await response.json();
      return data.stargazers_count || 0;
    }
    
    return 0;
  } catch (error) {
    console.error(`Error getting stars for ${repoUrl}:`, error.message);
    return 0;
  }
}

// Function to parse markdown table
async function parseMarkdownTable(markdown) {
  const lines = markdown.split('\n');
  const tools = [];
  let currentCategory = '';
  let id = 1;
  
  for (const line of lines) {
    // Check for category headers (## Category Name)
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim();
      continue;
    }
    
    // Check for table rows
    if (line.startsWith('|') && line.includes('|') && !line.includes('---')) {
      // Skip table headers
      if (line.includes('Sr No') || line.includes('Tool Name') || line.includes('Description')) {
        continue;
      }
      
      // Parse table row
      const columns = line.split('|').filter(col => col.trim());
      if (columns.length >= 4) {
        // Extract name
        const name = columns[1].trim();
        
        // Extract URL and description from markdown link format [Description](URL)
        const descColumn = columns[2].trim();
        const linkMatch = descColumn.match(/\[(.*?)\]\((.*?)\)/);
        let description = '';
        let url = '';
        
        if (linkMatch) {
          description = linkMatch[1].trim();
          url = linkMatch[2].trim();
        } else {
          description = descColumn;
        }
        
        // For now, we'll use the GitHub API to get the actual stars count
        // This will make the script slower but more accurate
        const stars = await getGitHubStars(url);
        
        tools.push({
          id: id++,
          name,
          description,
          url,
          category: currentCategory,
          stars
        });
        
        // Log progress
        console.log(`Processed: ${name} (${currentCategory})`);
      }
    }
  }
  
  return tools;
}

// Main function
async function main() {
  try {
    console.log("Fetching README.md from GitHub...");
    
    // Fetch the README.md
    const response = await fetch(readmeUrl);
    const markdown = await response.text();
    
    console.log("Parsing markdown tables...");
    const tools = await parseMarkdownTable(markdown);
    
    console.log(`Parsed ${tools.length} tools from the README.md`);
    
    // Create the data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save the data to tools.json
    const outputPath = path.join(dataDir, 'tools.json');
    fs.writeFileSync(outputPath, JSON.stringify(tools, null, 2));
    
    console.log(`Data saved to ${outputPath}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
