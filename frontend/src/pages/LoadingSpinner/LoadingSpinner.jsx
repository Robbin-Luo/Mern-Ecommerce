import {ImSpinner} from 'react-icons/im';
import './LoadingSpinner.css';

const Spinner=()=>{
  return  <div className='spinnerWrapper'>
            <ImSpinner className='spinner'/>
          </div>
}
export default Spinner;