import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function HolidayCalendar({...props}) {
    return <Calendar selectRange {...props} />
}