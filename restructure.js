const fs = require('fs');
const path = require('path');

const clientSrc = path.join(__dirname, 'client', 'src');
const pagesDir = path.join(clientSrc, 'pages');
const appDir = path.join(clientSrc, 'app');

if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir);
}

// Map of old page path to new app path and new filename
const fileMap = {
  'Home.jsx': ['page.jsx'],
  'Home.css': ['page.css'],
  'Login.jsx': ['login', 'page.jsx'],
  'Register.jsx': ['register', 'page.jsx'],
  'Auth.css': ['auth.css'], // shared CSS
  'Dashboard.jsx': ['dashboard', 'page.jsx'],
  'Dashboard.css': ['dashboard', 'page.css'],
  'Profile.jsx': ['profile', 'page.jsx'],
  'Profile.css': ['profile', 'page.css'],
  'Tutors.jsx': ['tutors', 'page.jsx'],
  'Tutors.css': ['tutors', 'page.css'],
  'TutorDetail.jsx': ['tutors', '[id]', 'page.jsx'],
  'TutorDetail.css': ['tutors', '[id]', 'page.css'],
  'MyBookings.jsx': ['bookings', 'page.jsx'],
  'Bookings.css': ['bookings.css'], // shared CSS
  'ManageBookings.jsx': ['manage-bookings', 'page.jsx'],
  'NotFound.jsx': ['not-found', 'page.jsx'],
  'NotFound.css': ['not-found', 'page.css'],
};

// Create dirs and move files
for (const [oldName, newPathArr] of Object.entries(fileMap)) {
  const oldPath = path.join(pagesDir, oldName);
  
  if (fs.existsSync(oldPath)) {
    // Generate new path 
    const newDir = path.join(appDir, ...newPathArr.slice(0, -1));
    const newPath = path.join(newDir, newPathArr[newPathArr.length - 1]);
    
    if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
    
    // Read content to update relative imports
    let content = fs.readFileSync(oldPath, 'utf8');
    
    // Auth.css and Bookings.css moves
    if (oldName === 'Login.jsx' || oldName === 'Register.jsx') {
      content = content.replace("'./Auth.css'", "'../auth.css'");
    }
    if (oldName === 'MyBookings.jsx' || oldName === 'ManageBookings.jsx') {
      content = content.replace("'./Bookings.css'", "'../bookings.css'");
    }
    
    // Tutor detail CSS 
    if (oldName === 'TutorDetail.jsx') {
      content = content.replace("'./TutorDetail.css'", "'./page.css'");
    }

    // Other css imports
    content = content.replace(/import '\.\/(.*?)\.css'/g, (match, p1) => {
      if (p1 === oldName.replace('.jsx', '')) return "import './page.css'";
      return match;
    });

    // Update relative component/context imports
    const depth = newPathArr.length - 1;
    let relativePrefix = '../';
    if (depth === 1) relativePrefix = '../../';
    if (depth === 2) relativePrefix = '../../../'; // e.g. tutors/[id]/page.jsx
    
    content = content.replace(/from '\.\.\//g, `from '${relativePrefix}`);
    content = content.replace(/import (.*?) from '\.\.\//g, `import $1 from '${relativePrefix}`);

    fs.writeFileSync(newPath, content);
    console.log(`Moved ${oldName} -> app/${newPathArr.join('/')}`);
  }
}

// Update App.jsx imports
const appJsxPath = path.join(clientSrc, 'App.jsx');
if (fs.existsSync(appJsxPath)) {
  let appJsx = fs.readFileSync(appJsxPath, 'utf8');
  
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/Home'/g, "import $1 from './app/page'");
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/Login'/g, "import $1 from './app/login/page'");
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/Register'/g, "import $1 from './app/register/page'");
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/Dashboard'/g, "import $1 from './app/dashboard/page'");
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/Profile'/g, "import $1 from './app/profile/page'");
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/Tutors'/g, "import $1 from './app/tutors/page'");
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/TutorDetail'/g, "import $1 from './app/tutors/[id]/page'");
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/MyBookings'/g, "import $1 from './app/bookings/page'");
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/ManageBookings'/g, "import $1 from './app/manage-bookings/page'");
  appJsx = appJsx.replace(/import (.*?) from '\.\/pages\/NotFound'/g, "import $1 from './app/not-found/page'");
  
  fs.writeFileSync(appJsxPath, appJsx);
  console.log('Updated App.jsx routing paths.');
}

// Remove old pages directory safely 
try {
  fs.rmSync(pagesDir, { recursive: true, force: true });
  console.log('Removed old pages/ directory.');
} catch (e) {
  console.log('Could not remove pages/ dir automatically.');
}

console.log('✅ Next.js app directory restructuring complete!');
