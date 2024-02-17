import { Outlet, Link } from 'react-router-dom';
import EmployeeHeader from '../../components/EmployeeHeader'

const Navigation = () => {
  return (
    <div>
      <EmployeeHeader/>
      <div className='nav'>
        <Link to='/'>List Employees</Link>
        <Link to='/create'>Create Employee</Link>
      </div>

      <Outlet />
    </div>
  );
}

export default Navigation;