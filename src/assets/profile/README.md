Add your photo here (e.g. zaky.jpg), then in src/sections/Home.jsx:
1. Uncomment the `import profilePhoto from '../assets/profile/zaky.jpg'` line.
2. Replace the placeholder <span> block with:
   <img src={profilePhoto} alt="Zaky" className="w-full h-full object-cover" />
