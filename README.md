# Kamgabaza Solutions Website

A clean, professional static website for Kamgabaza Solutions (Pty) Ltd, featuring a minimalist black-and-white design and a custom Matrix digital rain logo animation.

## Project Structure

- **index.html**: Main website structure and content.
- **style.css**: Styling, responsiveness, and layout.
- **script.js**: "KMG" Matrix logo animation and interactive elements.

## How to Run Locally

You have two options to view the site on your computer:

1.  **Double-click `index.html`**: This will open the file directly in your default browser.
2.  **Use a local server** (Recommended):
    Run the following command in your terminal:
    ```bash
    npx serve .
    ```

## How to Deploy to the Web

Since this is a static website (HTML/CSS/JS), it is very easy to host for free.

### Option 1: Netlify Drop (Easiest)
1.  Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2.  Drag and drop the `kamgabaza_it_services` folder onto the page.
3.  Netlify will instantly publish your site and give you a live URL (e.g., `https://random-name.netlify.app`).
4.  You can later connect your custom domain (e.g., `kamgabaza.co.za`) in the site settings.

### Option 2: Vercel
1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in this directory.
3.  Follow the prompts to deploy.

### Option 3: GitHub Pages
1.  Create a repository on GitHub.
2.  Push these files to the repository.
3.  Go to Settings > Pages and enable GitHub Pages for the `main` branch.

## Customization

- **Logo**: Edit the `text` variable in `script.js` to change "KMG".
- **Colors**: Update CSS variables in `:root` inside `style.css`.
- **Content**: Edit the text directly in `index.html`.
