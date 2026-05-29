import fs from 'fs';
import path from 'path';
import os from 'os';
import matter from 'gray-matter';
import { createClient } from '@sanity/client';

// 1. Load Environment Variables from .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  const env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        env[match[1]] = value;
      }
    });
  }
  return env;
}

const env = loadEnv();
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'od2biciq';
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// 2. Load Auth Token (Global Sanity token has write permissions, fallback to .env.local)
function getAuthToken() {
  try {
    const globalConfigPath = path.join(os.homedir(), '.config', 'sanity', 'config.json');
    if (fs.existsSync(globalConfigPath)) {
      const config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
      if (config.authToken) {
        console.log('🗝️  Using global Sanity CLI auth token.');
        return config.authToken;
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not read global Sanity config, falling back:', error.message);
  }

  if (env.SANITY_API_TOKEN) {
    console.log('🗝️  Using local .env.local API token.');
    return env.SANITY_API_TOKEN;
  }
  return null;
}

const token = getAuthToken();

if (!projectId || !token) {
  console.error('❌ Error: Missing Sanity project ID or write Token.');
  process.exit(1);
}

// 3. Initialize Sanity Client
const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-05-25',
  useCdn: false,
});

// 4. Define Category Data Map & Aliases
const CATEGORY_MAP = {
  "AI & Agen": { 
    _id: "category-ai-agen", 
    title: "AI & Agen", 
    number: "1.0", 
    description: "Masa depan komputasi terdistribusi dan sistem berbasis AI-first." 
  },
  "Desain UX": { 
    _id: "category-desain-ux", 
    title: "Desain UX", 
    number: "2.0", 
    description: "Kecepatan ekstrim, interaksi mikro, dan detail estetika visual premium." 
  },
  "Rekayasa Frontend": { 
    _id: "category-rekayasa-frontend", 
    title: "Rekayasa Frontend", 
    number: "3.0", 
    description: "Arsitektur web modern, performa bundling, dan optimasi runtime." 
  },
  "Simulasi & Komputasi": { 
    _id: "category-simulasi-komputasi", 
    title: "Simulasi & Komputasi", 
    number: "4.0", 
    description: "Simulasi fisika teoretis, geometri dimensi tinggi, dan rekayasa komputasi." 
  },
  "Embedded & IoT": { 
    _id: "category-embedded-iot", 
    title: "Embedded & IoT", 
    number: "5.0", 
    description: "Integrasi perangkat keras pintar, sistem sensor terdistribusi, dan otomasi lapangan." 
  }
};

const CATEGORY_ALIASES = {
  "AI": "AI & Agen",
  "Design": "Desain UX",
  "Engineering": "Rekayasa Frontend",
  "Simulasi": "Simulasi & Komputasi",
  "IoT": "Embedded & IoT"
};

// Helper to slugify string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// 5. Parser: Markdown Inline Elements to Portable Text Spans
function parseParagraphToBlock(text, style = 'normal') {
  const children = [];
  const markDefs = [];
  let remaining = text;
  
  while (remaining) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    
    let firstMatch = null;
    let matchType = '';
    let index = Infinity;
    
    if (linkMatch && linkMatch.index < index) {
      firstMatch = linkMatch;
      matchType = 'link';
      index = linkMatch.index;
    }
    if (boldMatch && boldMatch.index < index) {
      firstMatch = boldMatch;
      matchType = 'bold';
      index = boldMatch.index;
    }
    if (codeMatch && codeMatch.index < index) {
      firstMatch = codeMatch;
      matchType = 'code';
      index = codeMatch.index;
    }
    
    if (firstMatch) {
      if (index > 0) {
        children.push({
          _type: 'span',
          _key: 's_' + Math.random().toString(36).substring(2, 7),
          text: remaining.substring(0, index),
          marks: []
        });
      }
      
      const matchedText = firstMatch[0];
      const content = firstMatch[1];
      
      if (matchType === 'link') {
        const url = firstMatch[2];
        const markKey = 'l_' + Math.random().toString(36).substring(2, 7);
        children.push({
          _type: 'span',
          _key: 's_' + Math.random().toString(36).substring(2, 7),
          text: content,
          marks: [markKey]
        });
        markDefs.push({
          _key: markKey,
          _type: 'link',
          href: url
        });
      } else if (matchType === 'bold') {
        children.push({
          _type: 'span',
          _key: 's_' + Math.random().toString(36).substring(2, 7),
          text: content,
          marks: ['strong']
        });
      } else if (matchType === 'code') {
        children.push({
          _type: 'span',
          _key: 's_' + Math.random().toString(36).substring(2, 7),
          text: content,
          marks: ['code']
        });
      }
      
      remaining = remaining.substring(index + matchedText.length);
    } else {
      children.push({
        _type: 'span',
        _key: 's_' + Math.random().toString(36).substring(2, 7),
        text: remaining,
        marks: []
      });
      remaining = '';
    }
  }
  
  if (children.length === 0) {
    children.push({
      _type: 'span',
      _key: 's_' + Math.random().toString(36).substring(2, 7),
      text: '',
      marks: []
    });
  }

  return {
    _key: 'b_' + Math.random().toString(36).substring(2, 11),
    _type: 'block',
    style: style,
    children: children,
    markDefs: markDefs
  };
}

// 6. Parser: Full Markdown Body to Portable Text Blocks
function markdownToPortableText(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let inCodeBlock = false;
  let codeText = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('<div')) {
      // Consuming HTML block as generic htmlBlock
      let htmlContent = [];
      let depth = 1;
      htmlContent.push(line);
      i++;
      while (i < lines.length && depth > 0) {
        const l = lines[i];
        if (l.includes('<div')) {
          const openCount = (l.match(/<div/g) || []).length;
          depth += openCount;
        }
        if (l.includes('</div')) {
          const closeCount = (l.match(/<\/div/g) || []).length;
          depth -= closeCount;
        }
        htmlContent.push(l);
        if (depth > 0) {
          i++;
        }
      }
      
      const htmlText = htmlContent.join('\n');
      
      blocks.push({
        _key: 'b_' + Math.random().toString(36).substring(2, 11),
        _type: 'htmlBlock',
        html: htmlText
      });
      continue;
    }

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const codeString = codeText.join('\n');
        blocks.push({
          _key: 'b_' + Math.random().toString(36).substring(2, 7),
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 's_' + Math.random().toString(36).substring(2, 7),
              _type: 'span',
              text: codeString,
              marks: ['code']
            }
          ]
        });
        codeText = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeText.push(line);
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push(parseParagraphToBlock(line.substring(2), 'h1'));
    } else if (line.startsWith('## ')) {
      blocks.push(parseParagraphToBlock(line.substring(3), 'h2'));
    } else if (line.startsWith('### ')) {
      blocks.push(parseParagraphToBlock(line.substring(4), 'h3'));
    } else if (line.startsWith('#### ')) {
      blocks.push(parseParagraphToBlock(line.substring(5), 'h4'));
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const cleanLine = line.trim().substring(2);
      const level = Math.floor(line.indexOf(line.trim()) / 2) + 1;
      const block = parseParagraphToBlock(cleanLine, 'normal');
      block.listItem = 'bullet';
      block.level = level;
      blocks.push(block);
    } else if (/^\d+\.\s/.test(line.trim())) {
      const cleanLine = line.trim().replace(/^\d+\.\s/, '');
      const block = parseParagraphToBlock(cleanLine, 'normal');
      block.listItem = 'number';
      block.level = 1;
      blocks.push(block);
    } else if (line.startsWith('> ')) {
      blocks.push(parseParagraphToBlock(line.substring(2), 'blockquote'));
    } else if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      // Ignore HRs
    } else if (line.trim() === '') {
      // Skip empty lines
    } else {
      blocks.push(parseParagraphToBlock(line, 'normal'));
    }
  }

  return blocks;
}

// 7. Image Upload Utility
async function uploadImage(imageRelativePath) {
  const cleanPath = imageRelativePath.startsWith('/') ? imageRelativePath.substring(1) : imageRelativePath;
  const fullPath = path.join(process.cwd(), 'public', cleanPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Cover image not found locally: ${fullPath}`);
    return null;
  }

  console.log(`📤  Uploading cover image: ${fullPath}`);
  try {
    const fileStream = fs.createReadStream(fullPath);
    const asset = await client.assets.upload('image', fileStream, {
      filename: path.basename(fullPath),
    });
    console.log(`✅  Uploaded image successfully: asset ID = ${asset._id}`);
    return asset;
  } catch (error) {
    console.error(`❌  Failed to upload image ${fullPath}:`, error.message);
    return null;
  }
}

// 8. Main Migration Function
async function migrate() {
  console.log('🚀 Starting Markdown to Sanity CMS migration...');

  // Step 8a. Ensure categories exist in Sanity
  console.log('\n--- Checking Categories ---');
  for (const key of Object.keys(CATEGORY_MAP)) {
    const cat = CATEGORY_MAP[key];
    console.log(`Checking category: "${cat.title}"`);
    await client.createOrReplace({
      _type: 'category',
      _id: cat._id,
      title: cat.title,
      slug: { _type: 'slug', current: slugify(cat.title) },
      description: cat.description,
      number: cat.number
    });
    console.log(`✅ Category is ready: ${cat._id}`);
  }

  // Step 8b. Read local markdown files
  console.log('\n--- Reading Local Markdown Files ---');
  const postsDir = path.join(process.cwd(), 'src/content/posts');
  if (!fs.existsSync(postsDir)) {
    console.error(`Directory not found: ${postsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  console.log(`Found ${files.length} markdown file(s).`);

  const createdAuthors = new Set();

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    console.log(`\nProcessing file: ${file}`);
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    const slug = file.replace(/\.md$/, '');
    const title = data.title || 'Untitled';
    const authorName = data.author || 'Anonymous';
    const authorRole = data.authorRole || 'Contributor';
    
    // Step 8c. Ensure author document exists in Sanity
    const authorId = 'author-' + slugify(authorName);
    if (!createdAuthors.has(authorId)) {
      console.log(`Checking author: "${authorName}"`);
      await client.createOrReplace({
        _type: 'author',
        _id: authorId,
        name: authorName,
        role: authorRole,
        permissionRole: 'contributor'
      });
      createdAuthors.add(authorId);
      console.log(`✅ Author is ready: ${authorId}`);
    }

    // Step 8d. Map category to reference ID (with alias resolution)
    let catName = data.category;
    if (catName && CATEGORY_ALIASES[catName]) {
      console.log(`Mapping category alias: "${catName}" -> "${CATEGORY_ALIASES[catName]}"`);
      catName = CATEGORY_ALIASES[catName];
    }

    let categoryRefId = null;
    if (catName && CATEGORY_MAP[catName]) {
      categoryRefId = CATEGORY_MAP[catName]._id;
    } else {
      console.warn(`⚠️  Warning: Category "${catName}" for post "${title}" not found in mapping! Skipping category reference.`);
    }

    // Step 8e. Upload cover image if specified
    let imageRef = null;
    if (data.coverImage) {
      const asset = await uploadImage(data.coverImage);
      if (asset) {
        imageRef = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        };
      }
    }

    // Step 8f. Convert Markdown body to Portable Text blocks
    console.log('🔄 Converting body text to Portable Text blocks...');
    const bodyBlocks = markdownToPortableText(content);

    // Step 8g. Create or Replace Post in Sanity CMS
    const postDocument = {
      _type: 'post',
      _id: `post-${slug}`,
      title: title,
      slug: { _type: 'slug', current: slug },
      description: data.description || '',
      date: data.date || new Date().toISOString().split('T')[0],
      readingTime: data.readingTime || '5 min read',
      featured: data.featured === true,
      number: data.number || undefined,
      tags: data.tags || [],
      content: bodyBlocks,
      author: {
        _type: 'reference',
        _ref: authorId
      }
    };

    if (categoryRefId) {
      postDocument.category = {
        _type: 'reference',
        _ref: categoryRefId
      };
    }

    if (imageRef) {
      postDocument.coverImage = imageRef;
    }

    console.log(`💾 Uploading post "${title}" to Sanity...`);
    await client.createOrReplace(postDocument);
    console.log(`🎉 Published to Sanity: "${title}"`);
  }

  console.log('\n🌟 Migration completed successfully!');
}

migrate().catch(err => {
  console.error('❌ Migration failed with error:', err);
  process.exit(1);
});
