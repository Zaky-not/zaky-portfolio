import clinicQueueImage from '../assets/projects/Clinic Queue.jpeg'
import firstwebimage from '../assets/projects/firstweb.png'
import profilgithub from '../assets/projects/profilgithub.png'

const projects = [
  {
    id: 'project-01',
    title: 'Clinic Queue Management System',
    category: 'Make A System',
    year: '2026',
    description: {
      id: 'Sistem Manajemen Antrean Klinik yang dibangun menggunakan Python dengan memanfaatkan Queue, Heap, Hash Table, dan Stack.',
      en: 'A Clinic Queue Management System built with Python using Queue, Heap, Hash Table, and Stack.',
    },
    technologies: ['Python'],
    image: clinicQueueImage,
    url: 'https://github.com/Zaky-not/Clinic-Queue-Management-System.git',
  },

  {
    id: 'project-02',
    title: 'First Web',
    category: 'Make A Web',
    year: '2026',
    description: {
      id: 'Web Portofolio Pertama Saya',
      en: 'My first Portfolio Web.',
    },
    technologies: ['JavaScript', 'HTML', 'CSS'],
    image: firstwebimage,
    url: 'https://albarzaky-portfolio.vercel.app/',
  },

  {
    id: 'project-03',
    title: 'Profile Git Hub',
    category: 'Git Hub',
    year: '2026',
    description: {
      id: 'Hanya Profile Git Hub.',
      en: 'Just Git Hub Profile.',
    },
    technologies: ['Git Hub'],
    image: profilgithub,
    url: 'https://github.com/Zaky-not/Zaky-not.git',
  },
]

export default projects