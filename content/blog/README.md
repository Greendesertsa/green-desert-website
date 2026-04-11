# Blog Management Guide

This guide explains how to manage blog articles for the Green Desert website. No technical knowledge is required!

## 📁 Folder Structure

```
content/blog/
├── en/          # English articles
├── ar/          # Arabic articles
└── README.md    # This guide
```

## ✍️ Adding a New Article

### Step 1: Choose the Language Folder
- For **English** articles: Use the `en/` folder
- For **Arabic** articles: Use the `ar/` folder

### Step 2: Create a New File
1. Click "Add file" → "Create new file" in GitHub
2. Name your file with the format: `article-title.md`
   - Use dashes (-) instead of spaces
   - End with `.md` extension
   - Example: `hemp-cultivation-benefits.md`

### Step 3: Article Format
Copy this template and fill in your content:

```markdown
---
title: Your Article Title Here
date: 2024-12-01
author: Your Name
excerpt: A brief summary of your article (1-2 sentences)
image: /image-filename.jpg
tags: Tag1, Tag2, Tag3
---

# Your Article Title Here

Your article content goes here. You can use:

## Headings
### Smaller Headings

**Bold text** and *italic text*

- Bullet points
- Another point

[Links to websites](https://example.com)

![Images](/image.jpg)

https://www.youtube.com/watch?v=VIDEO_ID
```

### Step 4: Fill Out the Header Information

**Required Fields:**
- `title`: The main title of your article
- `date`: Publication date (YYYY-MM-DD format)
- `excerpt`: Short description for previews

**Optional Fields:**
- `author`: Who wrote the article
- `image`: Featured image (upload to `/public/` folder first)
- `tags`: Categories separated by commas

## 🖼️ Adding Images

1. Upload images to the `/public/` folder in the main repository
2. Reference them in your article like this: `/your-image.jpg`
3. For the featured image, use the same path in the `image:` field

## 🎬 Embedding YouTube Videos

You can embed a YouTube video anywhere in an article body. Just paste the YouTube URL on its own line, with an empty line before and after it:

```markdown
Some paragraph before the video.

https://www.youtube.com/watch?v=VIDEO_ID

Some paragraph after the video.
```

The video will appear as a full-width, responsive 16:9 player.

**Supported URL formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`

**Rules:**
- The URL must be on its own line, surrounded by blank lines
- Do not wrap it in brackets or add other text on the same line
- Only YouTube links are supported this way

---

## ✏️ Editing Existing Articles

1. Navigate to the article file in GitHub
2. Click the pencil icon (✏️) to edit
3. Make your changes
4. Scroll down and click "Commit changes"

## 🗑️ Deleting Articles

1. Navigate to the article file
2. Click the trash icon (🗑️)
3. Confirm deletion

## 📝 Writing Tips

### For Markdown Formatting:
- Use `#` for main headings, `##` for subheadings
- Use `**text**` for bold and `*text*` for italic
- Create lists with `-` or `*`
- Add links with `[text](url)`

### For Better SEO:
- Use descriptive titles
- Write compelling excerpts
- Add relevant tags
- Include alt text for images

## 🌍 Language-Specific Notes

### English Articles (`en/` folder):
- Use clear, professional English
- Focus on international audience
- Include global context when relevant

### Arabic Articles (`ar/` folder):
- Write in Modern Standard Arabic
- Consider regional context
- Ensure proper right-to-left text flow

## 📋 Article Checklist

Before publishing, ensure:
- [ ] Article is in the correct language folder
- [ ] Filename uses dashes instead of spaces
- [ ] Header information is complete
- [ ] Content is proofread
- [ ] Images are uploaded and linked correctly
- [ ] Tags are relevant and helpful

## 🔧 Technical Notes

- Articles are written in Markdown format
- The website automatically generates the blog listing
- Changes appear live after committing to GitHub
- No server restart required

## 📞 Need Help?

If you encounter any issues:
1. Check this guide first
2. Look at existing articles as examples
3. Contact the technical team
4. Create an issue in the GitHub repository

---

**Remember**: Every article helps showcase Green Desert's expertise and contributes to Saudi Arabia's environmental goals! 🌱