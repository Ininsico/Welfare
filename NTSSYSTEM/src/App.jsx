import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AZMScholarship from './Landingpage';
import Contact from './Contact';
import Gallery from './Gallery';
import ForSchools from './Forschools';
import ScholarshipProgram from './ScholarshipProgram';
import ResultsPage from './resultspage';
import About from './About';
import AdminPanel from './Adminpage';
import AdmitCard from './Admitcard';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AZMScholarship />} />
        <Route path="/about" element={<About />} />
        <Route path="/scholarship-program" element={<ScholarshipProgram />} />
        <Route path="/for-schools" element={<ForSchools />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/adminpanel' element={<AdminPanel />} />
        <Route path="/admit-card/:admitId" element={<AdmitCard />} />
      </Routes>
    </Router>
  );
};

export default App;