import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ICalendar, IEvent } from './backend';
import { Box, Icon } from '@mui/material';

const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

interface ICalendarProps {
  weeks: ICalendarCell[][];
}
export default function Calendar(props: ICalendarProps) {
  const { weeks } = props;
  return (
    <TableContainer component={'div'}>
      <Table>
        <TableHead>
          <TableRow>
            {DAYS_OF_WEEK.map(day => (
              <TableCell align="center" key={day}>
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {weeks.map((week, i) => (
            <TableRow key={i}>
              {week.map(cell => (
                <TableCell align="center" key={cell.date}>
                  <div>{cell.dayOfMonth}</div>
                  {cell.events.map(event => (
                    <button key={event.id}>
                      {event.time && (
                        <Icon fontSize="inherit">watch_later</Icon>
                      )}
                      {event.time && (
                        <Box component="span" margin="0 4px">
                          {event.time}
                        </Box>
                      )}
                      <span>{event.desc}</span>
                    </button>
                  ))}
                </TableCell>
              ))}
              <TableCell component="th" scope="row"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export type IEventWithCalendar = IEvent & { calendar: ICalendar };
export interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWithCalendar[];
}
