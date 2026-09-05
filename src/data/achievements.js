import sertifikat1 from '../assets/achievements/ethical_hacker.pdf'
import sertifikat2 from '../assets/achievements/keamanan dasar.pdf'
import basket1 from '../assets/achievements/basket.jpeg'
const achievements = [
  {
    id: 'achievement-01',
    title: 'Ethical Hacking',
    year: '2026',
    description: {
      id: 'praktik meretas sistem komputer atau jaringan secara legal dan sah dengan izin dari pemiliknya untuk menemukan celah keamanan sebelum dimanfaatkan oleh pihak berpenjahat.',
      en: 'the practice of hacking a computer system or network legally and lawfully with the owners permission to find security holes before they are exploited by criminals.',
    },
    type: 'pdf',
    file: sertifikat1,
  },
  {
    id: 'achievement-01',
    title: 'Keamanan Sosial Media',
    year: '2026',
    description: {
      id: 'keamanan social media',
      en: 'Security Of Social Media.',
    },
    type: 'pdf',
    file: sertifikat2,
  },
  {
    id: 'achievement-02',
    title: 'Dekan Cup FEB',
    year: '2025',
    description: {
      id: 'Dekan Cup FEB.',
      en: 'DEkan CUp FEB.',
    },
    type: 'image',
    image: basket1,
  },
]

export default achievements
