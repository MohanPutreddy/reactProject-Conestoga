/**
 * Team 6 - Section 8
 * 1. Roshni Panth - EmployeeCreate
 * 2. Swapnil Sharma - EmployeeDirectory, EmployeeFooter, EmployeeRow, EmployeeSearch, EmployeeTable
 * 3. Anmol - GraphQL
 * 4. Mohan - Mongo DB connections  CSS
 */


import { Routes, Route } from 'react-router-dom';
import Home from './routes/home/home';
import Navigation from './routes/navigation/navigation';
import PageNotFound from './routes/pageNotFound/pageNotFound';
import Create from './routes/Create/Create'
import EmployeeInformation from './components/EmployeeInformation';

function App() {
 /*  return (
      <EmployeeDirectory />
  ); */

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route path='/' element={<Home />} />   
          <Route path='/create' element={<Create />} /> 
          <Route path='/empinfo/:id' element={<EmployeeInformation />} />  
          <Route path='*' element={<PageNotFound />} />        
        </Route>
      </Routes>
    </div>
  );
}

export default App;
