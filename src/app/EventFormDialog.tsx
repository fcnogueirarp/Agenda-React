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
import {
  createEventEndpoint,
  deleteEventEndpoint,
  ICalendar,
  IEditingEvent,
  updateEventEndpoint,
} from './backend';
import { Box } from '@mui/material';

interface IEventFormDialogProps {
  event: IEditingEvent | null;
  calendars: ICalendar[];
  onCancel: () => void;
  onSave: () => void;
}

interface IValidationErrors {
  [field: string]: string;
}

export default function EventFormDialog(props: IEventFormDialogProps) {
  const [event, setEvent] = React.useState<IEditingEvent | null>(props.event);
  const [errors, setErrors] = React.useState<IValidationErrors>({});
  const inputDate = React.useRef<HTMLInputElement | null>();
  const inputDesc = React.useRef<HTMLInputElement | null>();

  React.useEffect(() => {
    setEvent(props.event);
    setErrors({});
  }, [props.event]);

  const isNew = !event?.id;

  function validate(): boolean {
    if (event) {
      const currentErrors: IValidationErrors = {};
      if (!event.date) {
        currentErrors['date'] = 'A data deve ser preenchida';
        inputDate.current?.focus();
      }
      if (!event.desc) {
        currentErrors['desc'] = 'A descrição deve ser preenchida';
        inputDesc.current?.focus();
      }
      setErrors(currentErrors);
      return Object.keys(currentErrors).length === 0;
    }
    return false;
  }
  function save(evt: React.FormEvent) {
    evt.preventDefault();
    if (event) {
      if (validate()) {
        if (isNew) {
          createEventEndpoint(event).then(props.onSave);
        } else {
          updateEventEndpoint(event).then(props.onSave);
        }
      }
    }
  }

  function deleteEvent() {
    if (event) {
      deleteEventEndpoint(event.id!).then(props.onSave);
    }
  }

  return (
    <div>
      <Dialog open={!!event} onClose={props.onCancel}>
        <form onSubmit={save}>
          <DialogTitle>{isNew ? 'CriarEvento' : 'Editar Evento'}</DialogTitle>
          <DialogContent>
            {event && (
              <>
                <TextField
                  inputRef={inputDate}
                  type="date"
                  margin="normal"
                  fullWidth
                  label="Date"
                  variant="standard"
                  value={event.date}
                  onChange={evt =>
                    setEvent({ ...event, date: evt.target.value })
                  }
                  error={!!errors.date}
                />
                <TextField
                  inputRef={inputDesc}
                  autoFocus
                  margin="normal"
                  label="Descrição"
                  fullWidth
                  variant="standard"
                  value={event.desc}
                  onChange={evt =>
                    setEvent({ ...event, desc: evt.target.value })
                  }
                  error={!!errors.desc}
                />
                <TextField
                  type="time"
                  margin="normal"
                  label="Hora"
                  fullWidth
                  variant="standard"
                  value={event.time ?? ''}
                  onChange={evt =>
                    setEvent({ ...event, time: evt.target.value })
                  }
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
            {!isNew && (
              <Button type="button" onClick={deleteEvent}>
                Excluir
              </Button>
            )}
            <Box flex="1"></Box>
            <Button type="button" onClick={props.onCancel}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
