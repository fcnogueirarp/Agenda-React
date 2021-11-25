import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import {
  getCalendarsEndpoint,
  getEventsEndpoint,
  ICalendar,
  IEditingEvent,
  IEvent,
} from './backend';
import { useParams } from 'react-router-dom';
import CalendarsView from './CalendarsView';
import CalendarHeader from './CalendarHeader';
import { Box } from '@mui/material';
import Calendar, { ICalendarCell, IEventWithCalendar } from './Calendar';
import EventFormDialog from './EventFormDialog';
import { getToday } from './dateFunctions';

export default function CalendarScreen() {
  const { month } = useParams<{ month: string }>();
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [calendarsSelected, setCalendarsSelected] = useState<boolean[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<IEditingEvent | null>(null);
  const weeks = generateCalendar(
    month + '-01',
    events,
    calendars,
    calendarsSelected
  );
  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([
      getCalendarsEndpoint(),
      getEventsEndpoint(firstDate, lastDate),
    ]).then(([calendars, events]) => {
      setCalendarsSelected(calendars.map(() => true));
      setCalendars(calendars);
      setEvents(events);
    });
  }, [firstDate, lastDate]);

  function refreshEvents() {
    getEventsEndpoint(firstDate, lastDate).then(setEvents);
  }

  function toggleCalendar(i: number) {
    const newValue = [...calendarsSelected];
    newValue[i] = !newValue[i];
    setCalendarsSelected(newValue);
  }

  function OpenNewEvent() {
    setEditingEvent({
      date: getToday(),
      desc: '',
      calendarId: calendars[0].id,
    });
  }

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box
        borderRight="1px solid rgb(224,224,224)"
        width="16em"
        padding="8px 16px"
      >
        <h2>Agenda React</h2>

        <Button variant="contained" onClick={OpenNewEvent}>
          Novo Evento
        </Button>

        <CalendarsView
          calendars={calendars}
          toggleCalendar={toggleCalendar}
          calendarsSelected={calendarsSelected}
        />
      </Box>

      <Box flex="1" display="flex" flexDirection="column">
        <CalendarHeader month={month} />
        <Calendar weeks={weeks} />
        <EventFormDialog
          event={editingEvent}
          onCancel={() => setEditingEvent(null)}
          onSave={() => {
            setEditingEvent(null);
            refreshEvents();
          }}
          calendars={calendars}
        />
      </Box>
    </Box>
  );
}

function generateCalendar(
  date: string,
  allEvents: IEvent[],
  calendars: ICalendar[],
  calendarsSelected: boolean[]
): ICalendarCell[][] {
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + 'T12:00:00');
  const currentMonth = jsDate.getMonth();

  const currentDay = new Date(jsDate.valueOf());
  currentDay.setDate(1);
  const dayOfWeek = currentDay.getDay();
  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];
    for (let i = 0; i < 7; i++) {
      const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = currentDay.getDate().toString().padStart(2, '0');
      const isoDate = `${currentDay.getFullYear()}-${monthStr}-${dayStr}`;

      const events: IEventWithCalendar[] = [];
      for (const event of allEvents) {
        if (event.date === isoDate) {
          const callIndex = calendars.findIndex(
            cal => cal.id === event.calendarId
          );
          if (calendarsSelected[callIndex]) {
            events.push({ ...event, calendar: calendars[callIndex] });
          }
        }
      }
      week.push({
        dayOfMonth: currentDay.getDate(),
        date: isoDate,
        events,
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);
  return weeks;
}
