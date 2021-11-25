import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ICalendar } from './backend';

export interface IEditingEvent {
  id?: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

interface IEventFormDialogProps {
  event: IEditingEvent | null;
  calendars: ICalendar[];
  onClose: () => void;
}

export default function EventFormDialog(props: IEventFormDialogProps) {
  const [event, setEvent] = React.useState<IEditingEvent | null>(props.event);

  React.useEffect(() => {
    setEvent(props.event);
  }, [props.event]);

  return (
    <div>
      <Dialog open={!!event} onClose={props.onClose}>
        <DialogTitle>Criar Evento</DialogTitle>
        <DialogContent>
          {event && (
            <>
              <TextField
                type="date"
                margin="normal"
                fullWidth
                label="Date"
                variant="standard"
                value={event.date}
                onChange={evt => setEvent({ ...event, date: evt.target.value })}
              />
              <TextField
                autoFocus
                margin="normal"
                label="Descrição"
                fullWidth
                variant="standard"
                value={event.desc}
                onChange={evt => setEvent({ ...event, desc: evt.target.value })}
              />
              <TextField
                type="time"
                margin="normal"
                label="Hora"
                fullWidth
                variant="standard"
                value={event.time ?? ''}
                onChange={evt => setEvent({ ...event, time: evt.target.value })}
              />
              <FormControl variant="standard" margin="normal" fullWidth>
                <InputLabel id="select-calendar">Agenda</InputLabel>
                <Select
                  labelId="select-calendar"
                  value={event.calendarId}
                  onChange={evt =>
                    setEvent({
                      ...event,
                      calendarId: evt.target.value as number,
                    })
                  }
                >
                  {props.calendars.map(calendar => (
                    <MenuItem key={calendar.id} value={calendar.id}>
                      {calendar.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancelar</Button>
          <Button onClick={props.onClose}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
